import { nanoid } from 'nanoid'
import {
  createSCOWUser,
  getRunnerAccount,
  getUserAccount
} from '../scow/index.js'
import { db } from './base.js'
import { defaultUserChargeLimit, kUserChargeLimit, sysGet } from './syskv.js'
import { Users } from './user.js'

export interface ISCOWCredential {
  _id: string
  userId: string
  problemId: string
  password: string
  synced: boolean
}

export const SCOWCredentials = db.collection<ISCOWCredential>('scowCredentials')

await SCOWCredentials.createIndex({ userId: 1, problemId: 1 }, { unique: true })

export async function getSCOWCredentialsForUser(userId: string) {
  let cred = await SCOWCredentials.findOne({ userId, problemId: '' })
  if (!cred) {
    cred = {
      _id: nanoid(),
      userId,
      problemId: '',
      password: nanoid(32),
      synced: false
    }
    await SCOWCredentials.insertOne(cred)
  }
  if (!cred.synced) {
    const user = await Users.findOne(
      { _id: userId },
      { projection: { metadata: 1, authEmail: 1, group: 1 } }
    )
    if (!user) throw new Error('User not found')
    const limits = await sysGet(kUserChargeLimit, defaultUserChargeLimit)
    await createSCOWUser(
      cred._id,
      cred.password,
      getUserAccount(user.group),
      user.metadata.realname,
      user.authEmail,
      limits[user.group]
    )
    await SCOWCredentials.updateOne(
      { _id: cred._id },
      { $set: { synced: true } }
    )
  }
  return { _id: cred._id, password: cred.password }
}

export async function getSCOWCredentialsForProblem(
  userId: string,
  problemId: string
) {
  let cred = await SCOWCredentials.findOne({ userId, problemId })
  if (!cred) {
    cred = {
      _id: nanoid(),
      userId,
      problemId,
      password: nanoid(32),
      synced: false
    }
    await SCOWCredentials.insertOne(cred)
  }
  if (!cred.synced) {
    const user = await Users.findOne(
      { _id: userId },
      { projection: { metadata: 1, authEmail: 1, group: 1 } }
    )
    if (!user) throw new Error('User not found')
    await createSCOWUser(
      cred._id,
      cred.password,
      getRunnerAccount(user.group),
      `${problemId}-${userId}`
    )
    await SCOWCredentials.updateOne(
      { _id: cred._id },
      { $set: { synced: true } }
    )
  }
  return { _id: cred._id, password: cred.password }
}
