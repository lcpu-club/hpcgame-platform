import { redis } from '../cache/index.js'
import type { IRule } from '../utils/rules.js'
import { db } from './base.js'
import type { UserGroup } from './user.js'

export interface ISysKVItem {
  _id: string
  value: unknown
}

export const SysKVItems = db.collection<ISysKVItem>('syskv')

export type ISysKey<T> = string & { __type: T }
export type InferSysType<K extends string> = K extends ISysKey<infer T>
  ? T
  : unknown

export async function sysGet<K extends string>(key: K, init: InferSysType<K>) {
  const cached = await redis.get(`syskv:${key}`)
  if (cached) return JSON.parse(cached) as InferSysType<K>
  const item = await SysKVItems.findOne({ _id: key })
  if (!item) {
    await sysSet(key, init)
    return init
  }
  await redis.set(`syskv:${key}`, JSON.stringify(item.value))
  return item.value as InferSysType<K>
}

export async function sysSet<K extends string>(key: K, value: InferSysType<K>) {
  await SysKVItems.updateOne(
    { _id: key },
    { $set: { value } },
    { upsert: true }
  )
  await redis.set(`syskv:${key}`, JSON.stringify(value))
}

export async function sysTryGet<K extends string>(key: K) {
  const cached = await redis.get(`syskv:${key}`)
  if (cached) return JSON.parse(cached) as InferSysType<K>
  const item = await SysKVItems.findOne({ _id: key })
  return item?.value as InferSysType<K> | null
}

export const kGameSchedule = 'game_schedule' as ISysKey<{
  start: number
  end: number
}>
export const defaultGameSchedule = {
  start: 0,
  end: 0
}

export const kUserChargeLimit = 'user_charge_limit' as ISysKey<
  Record<UserGroup, number | IRule[]>
>
export const defaultUserChargeLimit: Record<UserGroup, number> = {
  admin: 0,
  banned: 1,
  pku: 20,
  social: 10,
  staff: 50
}

export const kEmailConfig = 'email_config' as ISysKey<{
  whitelist: string[]
  blacklist: string[]
}>
export const defaultEmailConfig = {
  whitelist: ['.edu.cn'],
  blacklist: []
}

export const kTagRules = 'tag_rules' as ISysKey<{
  rules: IRule[]
}>
export const defaultTagRules = {
  rules: []
}

export const kTeamConfig = 'team_config' as ISysKey<{
  maxTeamSize: number
}>
export const defaultTeamConfig = {
  maxTeamSize: 5
}

export const kClusterBalanceConfig = 'cluster_balance_config' as ISysKey<{
  rules: IRule[]
}>
export const defaultClusterBalanceConfig = {
  rules: [
    {
      $match: {},
      $returns: {}
    }
  ] satisfies IRule[]
}
