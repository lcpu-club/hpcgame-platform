import { redis } from '../cache/index.js'
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
  Record<UserGroup, number>
>
export const defaultUserChargeLimit: Record<UserGroup, number> = {
  admin: 0,
  banned: 1,
  pku: 20,
  social: 10,
  staff: 50
}
