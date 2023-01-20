import type { Static } from '@sinclair/typebox'
import { StringEnum } from '../utils/type.js'
import { db } from './base.js'

export const SubmissionStatusSchema = StringEnum([
  'created',
  'pending',
  'running',
  'finished'
])
export type SubmissionStatus = Static<typeof SubmissionStatusSchema>

export interface ISubmission {
  _id: string
  teamId: string
  problemId: string
  score: number
  status: SubmissionStatus
  message: string

  createdAt: number
  updatedAt: number

  metadata: {
    ext?: string
  }
}

export const Submissions = db.collection<ISubmission>('submissions')
await Submissions.createIndex({ teamId: 1, problemId: 1 })
await Submissions.createIndex(
  { teamId: 1, problemId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: {
        $in: ['created', 'pending', 'running']
      }
    },
    name: 'unique_submission_per_user'
  }
)
