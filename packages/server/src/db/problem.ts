import { db } from './base.js'

export interface IProblem {
  _id: string
  title: string
  content: string
  score: number
  category: string
  tags: string[]
  file: string
}

export const Problems = db.collection<IProblem>('problems')
