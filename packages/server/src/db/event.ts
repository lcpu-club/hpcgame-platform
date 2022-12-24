import { ObjectId } from 'mongodb'
import { db } from './base.js'

export interface IEvent {
  _id: ObjectId
  target: {
    global: boolean
    group: string
    userId: string
  }
  timestamp: number
  type: 'notify' | 'system'
  title: string
  content: string
  metadata: Record<string, unknown>
}

export const Events = db.collection<IEvent>('events')
