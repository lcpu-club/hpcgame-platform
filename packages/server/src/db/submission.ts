import { Static } from '@sinclair/typebox'
import { StringEnum } from '../utils/type.js'
import { db } from './base.js'

export const SubmissionStatusSchema = StringEnum([
  'pending',
  'running',
  'finished'
])
export type SubmissionStatus = Static<typeof SubmissionStatusSchema>

export interface ISubmission {
  _id: string
  userId: string
  problemId: string
  file: string
  timestamp: number
  score: number
  status: SubmissionStatus
}

export const Submissions = db.collection<ISubmission>('submissions')
