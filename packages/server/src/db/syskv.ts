import { db } from './base.js'

export interface ISysKVItem {
  _id: string
  value: unknown
}

export const SysKVItems = db.collection<ISysKVItem>('syskv')
