import { Static } from '@sinclair/typebox'
import { StringEnum } from '../utils/type.js'
import { db } from './base.js'

export const RanklistIdSchema = StringEnum(['all', 'pku', 'social'])
export type RanklistId = Static<typeof RanklistIdSchema>

export interface IRanklistItem {
  userId: string
  name: string
  group: string
  tags: string[]
  email: string
  score: number
  scores: Record<string, number>
}

export interface IRanklistTopstarMutation {
  score: number
  timestamp: number
}

export interface IRanklistTopstar {
  userId: string
  mutations: IRanklistTopstarMutation[]
}

export interface IRanklist {
  _id: RanklistId
  items: IRanklistItem[]
  topstars: IRanklistTopstar[]
}

export const Ranklists = db.collection<IRanklist>('ranklists')
