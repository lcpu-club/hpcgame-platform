import { Type } from '@sinclair/typebox'
import { getSCOWCredentialsForUser } from '../../../db/scow.js'
import {
  sysGet,
  kGameSchedule,
  defaultGameSchedule
} from '../../../db/syskv.js'
import { Users } from '../../../db/user.js'
import { pagingToOptions } from '../../../utils/paging.js'
import { httpErrors } from '../index.js'
import { adminFilterSchema, adminSearchSchema, protectedChain } from './base.js'

async function shouldAllowSCOWAccess(group: string) {
  const schedule = await sysGet(kGameSchedule, defaultGameSchedule)
  const now = Date.now()
  return (
    (now >= schedule.start && now <= schedule.end) ||
    group === 'admin' ||
    group === 'staff'
  )
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
  .handle('POST', '/scowCredentials', (C) =>
    C.handler().handle(async (ctx) => {
      if (!(await shouldAllowSCOWAccess(ctx.user.group))) {
        throw httpErrors.forbidden('SCOW is not available now')
      }
      return getSCOWCredentialsForUser(ctx.user._id)
    })
  )
  .handle('DELETE', '/', (C) => C.handler())
  .handle('POST', '/admin/count', (C) =>
    C.handler()
      .body(adminFilterSchema)
      .handle(async (ctx, req) => {
        ctx.requires(false)
        return Users.countDocuments(req.body.filter)
      })
  )
  .handle('POST', '/admin/search', (C) =>
    C.handler()
      .body(adminSearchSchema)
      .handle(async (ctx, req) => {
        ctx.requires(false)
        const users = await Users.find(req.body.filter, {
          ...pagingToOptions(req.body)
        }).toArray()
        return users
      })
  )
  .handle('PUT', '/admin', (C) => C.handler())
