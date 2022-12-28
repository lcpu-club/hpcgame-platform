import { Type } from '@sinclair/typebox'
import { nanoid } from 'nanoid'
import { Problems } from '../../../db/problem.js'
import { Submissions } from '../../../db/submission.js'
import { Users } from '../../../db/user.js'
import { getUploadUrl } from '../../../storage/index.js'
import { server } from '../index.js'
import { protectedChain } from './base.js'

export const submissionRouter = protectedChain
  .router()
  // List submissions
  .handle('GET', '/list', (C) =>
    C.handler()
      .query(
        Type.Object({
          userId: Type.String(),
          problemId: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        return Submissions.find(req.query).toArray()
      })
  )
  // Get a submission
  .handle('GET', '/', (C) =>
    C.handler()
      .query(
        Type.Object({
          _id: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        const { _id } = req.query
        const submission = await Submissions.findOne({
          _id,
          userId: ctx.user._id
        })
        if (!submission) throw req.server.httpErrors.notFound()
        return submission
      })
  )
  // Create a submission
  .handle('POST', '/', (C) =>
    C.handler()
      .body(
        Type.Object({
          problemId: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        const { problemId } = req.body
        const problem = await Problems.findOne({ _id: problemId })
        if (!problem) throw req.server.httpErrors.badRequest()
        const id = nanoid()
        const result = await Users.updateOne(
          {
            _id: ctx.user._id,
            $or: [
              { [`problemStatus.${problemId}`]: { $exists: false } },
              {
                [`problemStatus.${problemId}.submissionCount`]: {
                  $lt: problem.submissionLimit
                }
              }
            ]
          },
          {
            $set: <never>{
              [`problemStatus.${problemId}.score`]: 0,
              [`problemStatus.${problemId}.effectiveSubmissionId`]: id
            },
            $inc: {
              [`problemStatus.${problemId}.submissionCount`]: 1
            }
          }
        )
        if (!result.modifiedCount) throw server.httpErrors.badRequest()
        await Submissions.insertOne({
          _id: id,
          userId: ctx.user._id,
          problemId,
          score: 0,
          status: 'created',
          createdAt: Date.now(),
          updatedAt: Date.now()
        })
        return { _id: id }
      })
  )
  .handle('POST', '/getUploadUrl', (C) =>
    C.handler()
      .body(
        Type.Object({
          _id: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        const { _id } = req.body
        const submission = await Submissions.findOne({
          _id,
          userId: ctx.user._id,
          status: 'created'
        })
        if (!submission) throw server.httpErrors.notFound()

        return {
          url: await getUploadUrl(`submission/${req.body._id}/data.tar`)
        }
      })
  )
  .handle('POST', '/submit', (C) =>
    C.handler()
      .body(
        Type.Object({
          _id: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        const { _id } = req.body
        const submission = await Submissions.findOne({
          _id,
          userId: ctx.user._id,
          status: 'created'
        })
        if (!submission) throw server.httpErrors.notFound()

        return {
          url: await getUploadUrl(`submission/${req.body._id}/data.tar`)
        }
      })
  )
  // Update a submission
  .handle('PUT', '/admin', (C) => C.handler())
  // Delete a submission
  .handle('DELETE', '/admin', (C) => C.handler())
  .handle('POST', '/admin/count', (C) => C.handler())
  .handle('POST', '/admin/search', (C) => C.handler())
