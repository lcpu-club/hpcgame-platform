import { Type } from '@sinclair/typebox'
import { DEV_MODE } from '../../../config/index.js'
import { createUser, UserGroupSchema, Users } from '../../../db/user.js'
import { rootChain } from './base.js'

export const authRouter = rootChain.router().handle('GET', '/dev', (C) =>
  C.handler()
    .query(
      Type.Object({
        name: Type.String(),
        group: UserGroupSchema
      })
    )
    .handle(async (ctx, req) => {
      if (!DEV_MODE) throw req.server.httpErrors.notFound()
      const user = await Users.findOne({ name: req.query.name })
      if (user) {
        return user
      }
      return createUser({
        name: req.query.name,
        group: req.query.group,
        tags: [],
        email: 'no@email.at.all',
        gender: 'unknown',
        authSources: {}
      })
    })
)
