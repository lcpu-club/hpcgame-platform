import type { Static } from '@sinclair/typebox'
import { nanoid } from 'nanoid'
import { redis } from '../cache/index.js'
import { StringEnum } from '../utils/type.js'
import { db } from './base.js'

export const UserGroupSchema = StringEnum([
  'banned',
  'pku',
  'social',
  'staff',
  'admin'
])
export type UserGroup = Static<typeof UserGroupSchema>

export interface IUserAuthSource {
  iaaa?: string // IAAA Identifier
}

export interface ProblemStatus {
  score: number
  submissionCount: number
  effectiveSubmissionId: string
}

export interface IUser {
  _id: string
  name: string
  group: UserGroup
  tags: string[]
  email: string

  authToken: string
  iaaaId?: string
  authEmail?: string
  problemStatus: Record<string, ProblemStatus>
}

export const Users = db.collection<IUser>('users')

await Users.createIndex({ iaaaId: 1 }, { unique: true, sparse: true })
await Users.createIndex({ authEmail: 1 }, { unique: true, sparse: true })

export function generateAuthToken(userId: string) {
  const token = nanoid(32)
  return userId + ':' + token
}

export type IUserInfo = Pick<IUser, '_id' | 'group'>

export async function verifyAuthToken(token: unknown) {
  if (typeof token !== 'string') return null
  const userId = token.split(':')[0]
  if (typeof userId !== 'string') return null
  const cached = await redis.get('user:' + token)
  if (!cached) {
    const user = await Users.findOne(
      { _id: userId },
      { projection: { _id: 1, group: 1, authToken: 1 } }
    )
    if (!user) return null
    const { authToken, ...rest } = user
    await redis.set('user:' + authToken, JSON.stringify(rest))
    return user
  }
  return JSON.parse(cached) as IUserInfo
}

export async function expireUserInfo(_id: string) {
  const keys = await redis.keys('user:' + _id + ':*')
  await redis.del(...keys)
}

export async function createUser(user: Omit<IUser, '_id' | 'authToken'>) {
  const id = nanoid()
  const authToken = generateAuthToken(id)
  await Users.insertOne({ _id: id, ...user, authToken })
  return { _id: id, ...user, authToken }
}
