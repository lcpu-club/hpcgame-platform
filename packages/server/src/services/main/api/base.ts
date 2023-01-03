import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import type { FastifyRequest } from 'fastify'
import { createRoot } from 'fastify-typeful'
import { RUNNER_SECRET } from '../../../config/index.js'
import { SCOWCredentials } from '../../../db/scow.js'
import { Users, verifyAuthToken, type IUserInfo } from '../../../db/user.js'
import { pagingSchema } from '../../../utils/paging.js'
import { server } from '../index.js'

function requires(this: { user: IUserInfo }, cond: boolean) {
  if (this.user.group === 'admin') return
  if (!cond) throw server.httpErrors.forbidden()
}

export const rootChain = createRoot<TypeBoxTypeProvider>()

async function loadUserForRunner(req: FastifyRequest) {
  if (req.headers['x-runner-secret'] !== RUNNER_SECRET) return null
  const scowUser = req.headers['x-runner-scow-user']
  if (!scowUser) throw server.httpErrors.badRequest('Missing scow user')
  const cred = await SCOWCredentials.findOne({ _id: scowUser })
  if (!cred) throw server.httpErrors.badRequest('Invalid scow user')
  const user = await Users.findOne(
    { _id: cred.userId },
    { projection: { _id: 1, group: 1, authToken: 1 } }
  )
  return user
}

async function loadUser(req: FastifyRequest) {
  let user = await verifyAuthToken(req.headers['auth-token'])
  user ??= await loadUserForRunner(req)
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
