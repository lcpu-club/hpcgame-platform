import { db } from './base.js'

export interface IEvent {
  _id: string
  global: boolean
  group: string
  userId: string

  title: string
  content: string
  metadata: Record<string, unknown>

  createdAt: number
}

export const Events = db.collection<IEvent>('events')

await Events.createIndex({ createdAt: -1 }, { unique: false })
