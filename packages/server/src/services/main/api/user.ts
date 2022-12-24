import { Type } from '@sinclair/typebox'
import { UserGenderSchema, Users } from '../../../db/user.js'
import { protectedChain } from './base.js'

const userQuerySchema = Type.Object({
  userId: Type.String()
})

export const userRouter = protectedChain
  .router()
  .handle('GET', '/', (C) =>
    C.handler()
      .query(userQuerySchema)
      .handle(async (ctx, req) => {
        ctx.requires(ctx.user._id === req.query.userId)
        return Users.findOne({ _id: req.query.userId })
      })
  )
  .handle('PATCH', '/', (C) =>
    C.handler()
      .query(userQuerySchema)
      .body(
        Type.Partial(
          Type.Object({
            name: Type.String({ minLength: 1, maxLength: 32 }),
            email: Type.String({ format: 'email' }),
            gender: UserGenderSchema
          })
        )
      )
      .handle(async (ctx, req) => {
        ctx.requires(ctx.user._id === req.query.userId)
        await Users.updateOne({ _id: ctx.user._id }, { $set: req.body })
        return 0
      })
  )
  .handle('DELETE', '/', (C) =>
    C.handler()
      .query(userQuerySchema)
      .handle(async (ctx, req) => {
        ctx.requires(ctx.user._id === req.query.userId)
        // Delete user, not implemented
        throw new Error('Not implemented')
      })
  )
