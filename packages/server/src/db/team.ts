import { db } from './base.js'

export interface ProblemStatus {
  score?: number
  submissionCount: number
  effectiveSubmissionId: string
}

export interface ITeam {
  _id: string
  name: string
  email: string
  ownerId: string
  memberIds: string[]
  problemStatus: Record<string, ProblemStatus>
  teamToken: string
}

export const Teams = db.collection<ITeam>('teams')
await Teams.createIndex({ ownerId: 1 }, { unique: true })
await Teams.createIndex({ memberIds: 1 }, { unique: true })
await Teams.createIndex({ teamToken: 1 }, { unique: true })
