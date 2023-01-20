import type { Static } from '@sinclair/typebox'
import { nanoid } from 'nanoid/async'
import { redis } from '../cache/index.js'
import { StringEnum } from '../utils/type.js'
import { db } from './base.js'

export const UserGroups = ['banned', 'pku', 'social', 'staff', 'admin'] as const
export const UserGroupSchema = StringEnum(UserGroups)
export type UserGroup = Static<typeof UserGroupSchema>

export interface IUserAuthSource {
  iaaa?: string // IAAA Identifier
}

export interface IUser {
  _id: string
  name: string
  group: UserGroup
  tags: string[]
  email: string

  teamId?: string

  authToken: string
  iaaaId?: string
  authEmail?: string

  metadata: {
    qq?: string
    realname?: string
    organization?: string
  }
}

export const Users = db.collection<IUser>('users')

await Users.createIndex({ iaaaId: 1 }, { unique: true, sparse: true })
await Users.createIndex({ authEmail: 1 }, { unique: true, sparse: true })

export async function generateAuthToken(userId: string) {
  const token = await nanoid(32)
  return userId + ':' + token
}

export type IUserInfo = Pick<IUser, '_id' | 'group' | 'teamId'>

export async function expireUserInfo(_id: string) {
  const keys = await redis.keys('user:' + _id + ':*')
  if (keys.length) {
    const pipeline = redis.pipeline()
    for (const key of keys) {
      pipeline.del(key)
    }
    await pipeline.exec()
  }
}

export async function verifyAuthToken(token: unknown) {
  if (typeof token !== 'string') return null
  const [userId] = token.split(':')
  if (typeof userId !== 'string') return null
  const cached = await redis.get('user:' + token)
  if (!cached) {
    const user = await Users.findOne(
      { _id: userId },
      { projection: { _id: 1, group: 1, authToken: 1, teamId: 1 } }
    )
    if (!user) return null
    const { authToken, ...rest } = user
    if (authToken !== token) return null
    await redis.set('user:' + authToken, JSON.stringify(rest))
    return user
  }
  return JSON.parse(cached) as IUserInfo
}

export async function createUser(user: Omit<IUser, '_id' | 'authToken'>) {
  const id = await nanoid()
  const authToken = await generateAuthToken(id)
  await Users.insertOne({ _id: id, ...user, authToken })
  return { _id: id, ...user, authToken }
}
