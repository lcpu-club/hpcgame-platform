import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { createRoot } from 'fastify-typeful'
import { IUser, verifyAuthToken } from '../../../db/user.js'
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
