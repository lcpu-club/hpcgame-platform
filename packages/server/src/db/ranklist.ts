import type { Filter } from 'mongodb'
import type { IUser } from './user.js'
import { db } from './base.js'

export interface IRanklistPlayer {
  userId: string
  score: number
  scores: Record<string, number>
}

export interface IRanklistOptions {
  filter: Filter<IUser>
  playerCount: number
  topstarCount: number
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
  _id: string
  public: boolean
  name: string
  options: IRanklistOptions
  players: IRanklistPlayer[]
  topstars: IRanklistTopstar[]
  updatedAt: number
}

export const Ranklists = db.collection<IRanklist>('ranklists')
