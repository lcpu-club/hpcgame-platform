import { db } from './base.js'

export interface IMessage {
  _id: string
  global: boolean
  group: string
  userId: string

  title: string
  content: string
  metadata: Record<string, unknown>

  createdAt: number
}

export const Messages = db.collection<IMessage>('messages')

await Messages.createIndex({ createdAt: -1 }, { unique: false })
