import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import type { FastifyRequest } from 'fastify'
import { createRoot } from 'fastify-typeful'
import { type IUser, verifyAuthToken } from '../../../db/user.js'
import { pagingSchema } from '../../../utils/paging.js'
import { server } from '../index.js'

function requires(this: { user: IUser }, cond: boolean) {
  if (this.user.group === 'admin') return
  if (!cond) throw server.httpErrors.forbidden()
}

export const rootChain = createRoot<TypeBoxTypeProvider>()

async function loadUser(req: FastifyRequest) {
  const user = await verifyAuthToken(req.headers['auth-token'])
  if (user?.group === 'banned') throw server.httpErrors.forbidden()
  return user
}

export const protectedChain = rootChain.transform(async (ctx, req) => {
  const user = await loadUser(req)
  if (!user) throw server.httpErrors.badRequest()
  return { user, requires }
})

export const unprotectedChain = rootChain.transform(async (ctx, req) => {
  const user = await loadUser(req)
  return { user }
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
