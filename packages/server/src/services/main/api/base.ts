import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { createRoot } from 'fastify-typeful'
import { type IUser, verifyAuthToken } from '../../../db/user.js'
import { pagingSchema } from '../../../utils/paging.js'
import { server } from '../index.js'

function requires(this: { user: IUser }, cond: boolean) {
  if (this.user.group === 'admin') return
  if (!cond) throw server.httpErrors.forbidden()
}

export const rootChain = createRoot<TypeBoxTypeProvider>()

export const protectedChain = rootChain.transform(async (ctx, req) => {
  const user = await verifyAuthToken(req.headers['auth-token'])
  if (!user) throw server.httpErrors.badRequest()
  if (user.group === 'banned') throw server.httpErrors.forbidden()
  return { user, requires }
})

export const adminChain = protectedChain.transform(async (ctx) => {
  ctx.requires(false)
  return ctx
})

export const adminFilterSchema = Type.Object({
  filter: Type.Any()
})

export const adminSearchSchema = Type.Intersect([
  pagingSchema,
  adminFilterSchema
])
