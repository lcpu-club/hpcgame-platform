import type { Static } from '@sinclair/typebox'
import { nanoid } from 'nanoid'
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

export const UserGenderSchema = StringEnum(['male', 'female', 'unknown'])
export type UserGender = Static<typeof UserGenderSchema>

export interface IUserAuthSource {
  iaaa?: string // IAAA Identifier
}

export interface IUser {
  _id: string
  name: string
  group: UserGroup
  tags: string[]
  email: string

  gender: UserGender

  authToken: string
  authSources: IUserAuthSource
  scores: Record<string, number>
}

export const Users = db.collection<IUser>('users')

await Users.createIndex({ name: 1 }, { unique: true })

export function generateAuthToken(userId: string) {
  const token = nanoid(32)
  return userId + ':' + token
}

export async function verifyAuthToken(token: unknown) {
  if (typeof token !== 'string') return null
  const userId = token.split(':')[0]
  if (typeof userId !== 'string') return null
  const user = await Users.findOne({ _id: userId })
  if (!user) return null
  if (user.authToken !== token) return null
  return user
}

export async function createUser(user: Omit<IUser, '_id' | 'authToken'>) {
  const id = nanoid()
  const authToken = generateAuthToken(id)
  await Users.insertOne({ _id: id, ...user, authToken })
  return { _id: id, ...user, authToken }
}
