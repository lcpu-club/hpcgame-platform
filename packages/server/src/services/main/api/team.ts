import { Type } from '@sinclair/typebox'
import { nanoid } from 'nanoid/async'
import { getSCOWCredentialsForTeam } from '../../../db/scow.js'
import {
  sysGet,
  kGameSchedule,
  defaultGameSchedule,
  kTeamConfig,
  defaultTeamConfig
} from '../../../db/syskv.js'
import { Teams } from '../../../db/team.js'
import { expireUserInfo, Users } from '../../../db/user.js'
import { httpErrors } from '../index.js'
import { protectedChain } from './base.js'

async function shouldAllowTeamOps() {
  const schedule = await sysGet(kGameSchedule, defaultGameSchedule)
  const now = Date.now()
  return now < schedule.start
}

async function shouldAllowSCOWAccess(group: string) {
  const schedule = await sysGet(kGameSchedule, defaultGameSchedule)
  const now = Date.now()
  return (
    (now >= schedule.start && now <= schedule.end) ||
    group === 'admin' ||
    group === 'staff'
  )
}

export const teamRouter = protectedChain
  .router()
  .handle('GET', '/', (C) =>
    C.handler().handle(async (ctx) => {
      if (!ctx.user.teamId) throw httpErrors.notFound()
      const team = await Teams.aggregate([
        { $match: { _id: ctx.user.teamId } },
        {
          $lookup: {
            from: 'users',
            localField: 'memberIds',
            foreignField: '_id',
            as: 'members'
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            ownerId: 1,
            memberIds: 1,
            problemStatus: 1,
            teamToken: 1,
            members: {
              _id: 1,
              name: 1,
              group: 1,
              tags: 1,
              email: 1
            }
          }
        }
      ]).next()
      if (!team) throw httpErrors.notFound()
      return team
    })
  )
  .handle('POST', '/create', (C) =>
    C.handler()
      .body(
        Type.Object({
          name: Type.String({ minLength: 1, maxLength: 32 }),
          email: Type.String({ format: 'email' })
        })
      )
      .handle(async (ctx, req) => {
        ctx.requires(await shouldAllowTeamOps())
        const _id = await nanoid()
        await Teams.insertOne({
          _id,
          name: req.body.name,
          email: req.body.email,
          ownerId: ctx.user._id,
          memberIds: [ctx.user._id],
          problemStatus: {},
          teamToken: await nanoid(32)
        })
        await Users.updateOne({ _id: ctx.user._id }, { $set: { teamId: _id } })
        await expireUserInfo(ctx.user._id)
        return { _id }
      })
  )
  .handle('POST', '/join', (C) =>
    C.handler()
      .body(
        Type.Object({
          teamToken: Type.String({ minLength: 32, maxLength: 32 })
        })
      )
      .handle(async (ctx, req) => {
        ctx.requires(await shouldAllowTeamOps())
        const config = await sysGet(kTeamConfig, defaultTeamConfig)
        const { value } = await Teams.findOneAndUpdate(
          {
            teamToken: req.body.teamToken,
            [`memberIds.${config.maxTeamSize - 1}`]: { $exists: false }
          },
          { $addToSet: { memberIds: ctx.user._id } },
          { projection: { _id: 1 } }
        )
        if (value) {
          await Users.updateOne(
            { _id: ctx.user._id },
            { $set: { teamId: value._id } }
          )
          await expireUserInfo(ctx.user._id)
        }
        return 0
      })
  )
  .handle('POST', '/leave', (C) =>
    C.handler().handle(async (ctx) => {
      ctx.requires(await shouldAllowTeamOps())
      if (!ctx.user.teamId) throw httpErrors.notFound()
      const team = await Teams.findOne({ _id: ctx.user.teamId })
      if (!team) throw httpErrors.notFound()
      if (team.ownerId === ctx.user._id)
        throw httpErrors.badRequest('Owner cannot leave')
      await Teams.updateOne(
        { _id: ctx.user.teamId },
        { $pull: { memberIds: ctx.user._id } }
      )
      await Users.updateOne({ _id: ctx.user._id }, { $unset: { teamId: '' } })
      await expireUserInfo(ctx.user._id)
      return 0
    })
  )
  .handle('PUT', '/', (C) =>
    C.handler()
      .body(
        Type.Object({
          name: Type.String({ minLength: 1, maxLength: 32 }),
          email: Type.String({ format: 'email' })
        })
      )
      .handle(async (ctx, req) => {
        ctx.requires(await shouldAllowTeamOps())
        if (!ctx.user.teamId) throw httpErrors.notFound()
        const team = await Teams.findOne({ _id: ctx.user.teamId })
        if (!team) throw httpErrors.notFound()
        if (team.ownerId !== ctx.user._id)
          throw httpErrors.forbidden('You must be owner to modify a team')
        await Teams.updateOne(
          { _id: ctx.user.teamId },
          { $set: { name: req.body.name, email: req.body.email } }
        )
        return 0
      })
  )
  .handle('POST', '/resetToken', (C) =>
    C.handler().handle(async (ctx) => {
      if (!ctx.user.teamId) throw httpErrors.notFound()
      const team = await Teams.findOne({ _id: ctx.user.teamId })
      if (!team) throw httpErrors.notFound()
      if (team.ownerId !== ctx.user._id)
        throw httpErrors.forbidden('You must be owner to modify a team')
      await Teams.updateOne(
        { _id: ctx.user.teamId },
        {
          $set: {
            teamToken: await nanoid(32)
          }
        }
      )
      return 0
    })
  )
  .handle('POST', '/kick', (C) =>
    C.handler()
      .body(
        Type.Object({
          userId: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        if (!ctx.user.teamId) throw httpErrors.notFound()
        const team = await Teams.findOne({ _id: ctx.user.teamId })
        if (!team) throw httpErrors.notFound()
        if (team.ownerId !== ctx.user._id)
          throw httpErrors.forbidden('You must be owner to modify a team')
        if (team.ownerId === req.body.userId)
          throw httpErrors.badRequest('Owner cannot be kicked')
        await Teams.updateOne(
          { _id: ctx.user.teamId },
          { $pull: { memberIds: req.body.userId } }
        )
        const { modifiedCount } = await Users.updateOne(
          {
            _id: req.body.userId,
            teamId: ctx.user.teamId
          },
          { $unset: { teamId: '' } }
        )
        if (modifiedCount) {
          await expireUserInfo(req.body.userId)
        }
        return 0
      })
  )
  .handle('DELETE', '/', (C) =>
    C.handler().handle(async (ctx) => {
      ctx.requires(await shouldAllowTeamOps())
      if (!ctx.user.teamId) throw httpErrors.notFound()
      const team = await Teams.findOne({ _id: ctx.user.teamId })
      if (!team) throw httpErrors.notFound()
      if (team.ownerId !== ctx.user._id)
        throw httpErrors.forbidden('You must be owner to delete a team')
      if (team.memberIds.length > 1)
        throw httpErrors.badRequest('Team is not empty')
      await Teams.deleteOne({ _id: ctx.user.teamId })
      await Users.updateOne({ _id: ctx.user._id }, { $unset: { teamId: '' } })
      await expireUserInfo(ctx.user._id)
      return 0
    })
  )
  .handle('POST', '/getSCOWCredentials', (C) =>
    C.handler().handle(async (ctx) => {
      ctx.requires(await shouldAllowSCOWAccess(ctx.user.group))
      if (!ctx.user.teamId) throw httpErrors.notFound()
      return getSCOWCredentialsForTeam(ctx.user.teamId)
    })
  )
