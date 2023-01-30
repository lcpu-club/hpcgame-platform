import { nanoid } from 'nanoid/async'
import fetch from 'node-fetch'
import {
  CLUSTER_API_BASE,
  CLUSTER_API_TOKEN_NAME,
  CLUSTER_API_TOKEN_SECRET
} from '../../../config/index.js'
import { Credentials } from '../../../db/credential.js'
import {
  sysGet,
  kClusterBalanceConfig,
  defaultClusterBalanceConfig
} from '../../../db/syskv.js'
import { execuateRules } from '../../../utils/rules.js'

async function invoke(method: string, path: string, payload: unknown) {
  const resp = await fetch(CLUSTER_API_BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Token-Name': CLUSTER_API_TOKEN_NAME,
      'X-Token-Secret': CLUSTER_API_TOKEN_SECRET,
      'User-Agent': 'HPCGP/0.1.0'
    },
    body: JSON.stringify(payload)
  })
  if (!resp.ok) throw new Error(`Cluster API returned ${resp.status}`)
  const { success } = <{ success: boolean }>await resp.json()
  if (!success) throw new Error(`Cluster API failed`)
}

export async function getClusterCredentialForTeam(teamId: string) {
  let cred = await Credentials.findOne({
    teamId,
    type: 'cluster'
  })
  if (!cred) {
    const _id = await nanoid()
    cred = {
      _id,
      teamId,
      type: 'cluster',
      data: {
        tokenName: `team_${teamId}_${_id}`,
        tokenSecret: await nanoid(32)
      },
      synced: false
    }
    await Credentials.insertOne(cred)
  }
  if (!cred.synced) {
    const { rules } = await sysGet(
      kClusterBalanceConfig,
      defaultClusterBalanceConfig
    )
    await invoke('PUT', '/user', {
      name: `team_${teamId}_${cred._id}`,
      role: 'user',
      balance: execuateRules(rules, {}, {})
    })
    await invoke('PUT', `/user/team_${teamId}_${cred._id}/token`, {
      name: cred.data.tokenName,
      secret: cred.data.tokenSecret
    })
    await Credentials.updateOne({ _id: cred._id }, { $set: { synced: true } })
  }
  return cred.data
}
