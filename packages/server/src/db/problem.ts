import { db } from './base.js'

export interface IProblem {
  _id: string
  title: string
  content: string
  score: number
  maxSubmissionCount: number
  maxSubmissionSize: number
  runnerArgs: string
  category: string
  tags: string[]
  metadata: Record<string, unknown>
}

export const Problems = db.collection<IProblem>('problems')
