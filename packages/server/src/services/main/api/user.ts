import { Type } from '@sinclair/typebox'
import { Users } from '../../../db/user.js'
import { pagingToOptions } from '../../../utils/paging.js'
import { adminFilterSchema, adminSearchSchema, protectedChain } from './base.js'

export const userRouter = protectedChain
  .router()
  .handle('GET', '/', (C) =>
    C.handler().handle(async (ctx) => {
      return ctx.user
    })
  )
  .handle('PATCH', '/', (C) =>
    C.handler()
      .body(
        Type.Partial(
          Type.Object({
            name: Type.String({ minLength: 1, maxLength: 32 }),
            email: Type.String({ format: 'email' })
          })
        )
      )
      .handle(async (ctx, req) => {
        await Users.updateOne({ _id: ctx.user._id }, { $set: req.body })
        return 0
      })
  )
  .handle('DELETE', '/', (C) => C.handler())
  .handle('POST', '/count', (C) =>
    C.handler()
      .body(adminFilterSchema)
      .handle(async (ctx, req) => {
        ctx.requires(false)
        return Users.countDocuments(req.body.filter)
      })
  )
  .handle('POST', '/search', (C) =>
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
