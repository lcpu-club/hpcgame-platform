import { db } from './base.js'

export interface IProblem {
  _id: string
  title: string
  content: string
  score: number
  submissionLimit: number
  category: string
  tags: string[]
  meta: Record<string, unknown>
}

export const Problems = db.collection<IProblem>('problems')
