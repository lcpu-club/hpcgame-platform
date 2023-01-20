import { nanoid, customAlphabet } from 'nanoid/async'
import {
  createSCOWUser,
  getRunnerAccount,
  getUserAccount
} from '../scow/index.js'
import { db } from './base.js'
import { defaultUserChargeLimit, kUserChargeLimit, sysGet } from './syskv.js'
import { Users } from './user.js'
import { execuateRules } from '../utils/rules.js'
import { Teams } from './team.js'

export interface ISCOWCredential {
  _id: string
  teamId: string
  problemId: string
  password: string
  synced: boolean
}

export const SCOWCredentials = db.collection<ISCOWCredential>('scowCredentials')

await SCOWCredentials.createIndex({ teamId: 1, problemId: 1 }, { unique: true })

// Valid Linux username: [a-z_][a-z0-9_-]*
// ~2^157 unique IDs
const SCOWId = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789_-', 30)

async function generateSCOWId() {
  // Valid Linux username: [a-z_][a-z0-9_-]*
  return 'hp' + (await SCOWId())
}

export async function getSCOWCredentialsForTeam(teamId: string) {
  let cred = await SCOWCredentials.findOne({ teamId, problemId: '' })
  if (!cred) {
    cred = {
      _id: await generateSCOWId(),
      teamId,
      problemId: '',
      password: await nanoid(32),
      synced: false
    }
    await SCOWCredentials.insertOne(cred)
  }
  if (!cred.synced) {
    const team = await Teams.findOne({ _id: teamId })
    if (!team) throw new Error('Team not found')
    const user = await Users.findOne(
      { _id: team.ownerId },
      { projection: { metadata: 1, authEmail: 1, group: 1, tags: 1 } }
    )
    if (!user) throw new Error('User not found')
    const limits = await sysGet(kUserChargeLimit, defaultUserChargeLimit)
    const config = limits[user.group]
    const limit =
      typeof config === 'number' ? config : execuateRules(config, user, 1)
    await createSCOWUser(
      cred._id,
      cred.password,
      getUserAccount(user.group),
      user.metadata.realname,
      user.authEmail,
      limit
    )
    await SCOWCredentials.updateOne(
      { _id: cred._id },
      { $set: { synced: true } }
    )
  }
  return { _id: cred._id, password: cred.password }
}

export async function getSCOWCredentialsForProblem(
  teamId: string,
  problemId: string
) {
  let cred = await SCOWCredentials.findOne({ teamId, problemId })
  if (!cred) {
    cred = {
      _id: await generateSCOWId(),
      teamId,
      problemId,
      password: await nanoid(32),
      synced: false
    }
    await SCOWCredentials.insertOne(cred)
  }
  if (!cred.synced) {
    const team = await Teams.findOne({ _id: teamId })
    if (!team) throw new Error('Team not found')
    const user = await Users.findOne(
      { _id: team.ownerId },
      { projection: { metadata: 1, authEmail: 1, group: 1 } }
    )
    if (!user) throw new Error('User not found')
    await createSCOWUser(
      cred._id,
      cred.password,
      getRunnerAccount(user.group),
      `${problemId}-${teamId}`
    )
    await SCOWCredentials.updateOne(
      { _id: cred._id },
      { $set: { synced: true } }
    )
  }
  return { _id: cred._id, password: cred.password }
}
