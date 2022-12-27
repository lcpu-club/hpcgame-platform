import { db } from './base.js'

export interface IEvent {
  _id: string
  global: boolean
  group: string
  userId: string

  title: string
  content: string
  timestamp: number
  metadata: Record<string, unknown>
}

export const Events = db.collection<IEvent>('events')

await Events.createIndex({ timestamp: -1 }, { unique: false })
