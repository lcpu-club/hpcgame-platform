import { db } from './base.js'

export interface ICredential {
  _id: string
  teamId: string
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  synced: boolean
}

export const Credentials = db.collection<ICredential>('credentials')
await Credentials.createIndex({ teamId: 1, type: 1 }, { unique: true })
