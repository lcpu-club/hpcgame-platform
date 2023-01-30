import { Type } from '@sinclair/typebox'
import { expireUserInfo, UserGroupSchema, Users } from '../../../db/user.js'
import { unsafePagingToOptions } from '../../../utils/paging.js'
import { httpErrors } from '../index.js'
import { adminFilterSchema, adminSearchSchema, protectedChain } from './base.js'
import { getClusterCredentialForTeam } from '../cluster/index.js'
import {
  sysGet,
  kGameSchedule,
  defaultGameSchedule
} from '../../../db/syskv.js'

async function shouldAllowClusterAccess(group: string) {
  const schedule = await sysGet(kGameSchedule, defaultGameSchedule)
  return Date.now() >= schedule.start || group === 'admin' || group === 'staff'
}

export const userRouter = protectedChain
  .router()
  .handle('GET', '/', (C) =>
    C.handler().handle(async (ctx) => {
      const user = await Users.findOne({ _id: ctx.user._id })
      if (!user) throw httpErrors.notFound()
      return user
    })
  )
  .handle('PATCH', '/', (C) =>
    C.handler()
      .body(
        Type.Partial(
          Type.Object({
            name: Type.String({ minLength: 1, maxLength: 32 }),
            email: Type.String({ format: 'email' }),
            metadata: Type.Partial(
              Type.Object({
                qq: Type.String({
                  minLength: 6,
                  maxLength: 12,
                  pattern: '^[0-9]+$'
                }),
                realname: Type.String({ minLength: 2, maxLength: 16 }),
                organization: Type.String({ minLength: 2, maxLength: 30 })
              })
            )
          })
        )
      )
      .handle(async (ctx, req) => {
        if (ctx.user.group === 'pku') {
          // PKU users have their realname and organization set by IAAA
          // Thus, only allow them to update their QQ number
          const { metadata, ...rest } = req.body
          await Users.updateOne(
            { _id: ctx.user._id },
            { $set: { ...rest, [`metadata.qq`]: metadata?.qq } }
          )
        } else {
          await Users.updateOne({ _id: ctx.user._id }, { $set: req.body })
        }
        return 0
      })
  )
  .handle('DELETE', '/', (C) => C.handler())
  .handle('POST', '/getClusterCredentials', (C) =>
    C.handler().handle(async (ctx) => {
      if (!(await shouldAllowClusterAccess(ctx.user.group))) {
        throw httpErrors.badRequest('Cluster access is not allowed')
      }
      if (!ctx.user.teamId) {
        throw httpErrors.badRequest('User is not in a team')
      }
      return getClusterCredentialForTeam(ctx.user.teamId)
    })
  )
  .route('/admin', (C) =>
    C.transform((ctx) => {
      ctx.requires(false)
      return ctx
    })
      .router()
      .handle('POST', '/count', (C) =>
        C.handler()
          .body(adminFilterSchema)
          .handle(async (ctx, req) => {
            return Users.countDocuments(req.body.filter)
          })
      )
      .handle('POST', '/search', (C) =>
        C.handler()
          .body(adminSearchSchema)
          .handle(async (ctx, req) => {
            const users = await Users.find(req.body.filter, {
              ...unsafePagingToOptions(req.body)
            }).toArray()
            return users
          })
      )
      .handle('PUT', '/', (C) =>
        C.handler()
          .body(
            Type.Object({
              _id: Type.String(),
              $set: Type.Object(
                {
                  name: Type.String({ minLength: 1, maxLength: 32 }),
                  group: UserGroupSchema,
                  tags: Type.Array(
                    Type.String({ minLength: 1, maxLength: 32 })
                  ),
                  email: Type.String({ format: 'email' })
                },
                { additionalProperties: false }
              )
            })
          )
          .handle(async (ctx, req) => {
            const { _id, $set } = req.body
            await Users.updateOne({ _id }, { $set })
            await expireUserInfo(_id)
            return 0
          })
      )
      .handle('GET', '/', (C) =>
        C.handler()
          .query(
            Type.Object({
              _id: Type.String()
            })
          )
          .handle(async (ctx, req) => {
            const { _id } = req.query
            const message = await Users.findOne({ _id })
            if (!message) throw httpErrors.notFound()
            return message
          })
      )
  )
