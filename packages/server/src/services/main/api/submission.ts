import { Type } from '@sinclair/typebox'
import { nanoid } from 'nanoid/async'
import { Problems } from '../../../db/problem.js'
import { getSCOWCredentialsForProblem } from '../../../db/scow.js'
import { Submissions, SubmissionStatusSchema } from '../../../db/submission.js'
import {
  sysGet,
  kGameSchedule,
  defaultGameSchedule
} from '../../../db/syskv.js'
import { Users } from '../../../db/user.js'
import { type IJudgeRequestMsg, judgeRequestTopic } from '../../../mq/index.js'
import { publishAsync } from '../../../mq/writer.js'
import { getDownloadUrl, getUploadUrl } from '../../../storage/index.js'
import { pagingToOptions } from '../../../utils/paging.js'
import { httpErrors, server } from '../index.js'
import { adminFilterSchema, adminSearchSchema, protectedChain } from './base.js'

async function shouldAllowSubmit(group: string) {
  const schedule = await sysGet(kGameSchedule, defaultGameSchedule)
  const now = Date.now()
  return (
    (now >= schedule.start && now <= schedule.end) ||
    group === 'admin' ||
    group === 'staff'
  )
}

export const submissionRouter = protectedChain
  .router()
  // List submissions
  .handle('GET', '/list', (C) =>
    C.handler()
      .query(
        Type.Object({
          problemId: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        return Submissions.find(
          {
            userId: ctx.user._id,
            problemId: req.query.problemId
          },
          {
            sort: { createdAt: -1 }
          }
        ).toArray()
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
      .handle(async (ctx, req): Promise<{ _id: string }> => {
        if (!(await shouldAllowSubmit(ctx.user.group))) {
          throw httpErrors.badRequest()
        }

        const { problemId } = req.body
        const submission = await Submissions.findOne({
          problemId,
          userId: ctx.user._id,
          status: 'created'
        })
        if (submission) {
          return { _id: submission._id }
        }

        const problem = await Problems.findOne({ _id: problemId })
        if (!problem) throw req.server.httpErrors.badRequest()

        const id = await nanoid()
        const result = await Users.updateOne(
          {
            _id: ctx.user._id,
            $or: [
              { [`problemStatus.${problemId}`]: { $exists: false } },
              {
                [`problemStatus.${problemId}.submissionCount`]: {
                  $lt: problem.maxSubmissionCount
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
          message: '',
          createdAt: Date.now(),
          updatedAt: 0
        })
        return { _id: id }
      })
  )
  .handle('POST', '/getUploadUrl', (C) =>
    C.handler()
      .body(
        Type.Object({
          _id: Type.String(),
          size: Type.Number()
        })
      )
      .handle(async (ctx, req) => {
        if (!(await shouldAllowSubmit(ctx.user.group))) {
          throw httpErrors.badRequest()
        }

        const { _id } = req.body
        const submission = await Submissions.findOne({
          _id,
          userId: ctx.user._id,
          status: 'created'
        })
        if (!submission) throw server.httpErrors.notFound()
        const problem = await Problems.findOne(
          { _id: submission.problemId },
          { projection: { maxSubmissionSize: 1 } }
        )
        if (!problem) throw server.httpErrors.badRequest()
        if (req.body.size > problem.maxSubmissionSize)
          throw server.httpErrors.badRequest()

        return {
          url: await getUploadUrl(
            `submission/${req.body._id}/data.tar`,
            req.body.size
          )
        }
      })
  )
  .handle('POST', '/getDownloadUrl', (C) =>
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
          userId: ctx.user._id
        })
        if (!submission) throw server.httpErrors.notFound()
        return {
          url: await getDownloadUrl(`submission/${req.body._id}/data.tar`)
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
        if (!(await shouldAllowSubmit(ctx.user.group))) {
          throw httpErrors.badRequest()
        }

        const submission = await Submissions.findOne({ _id: req.body._id })
        if (!submission) throw httpErrors.notFound()
        if (submission.status !== 'created') throw httpErrors.badRequest()

        const creds = await getSCOWCredentialsForProblem(
          ctx.user._id,
          submission.problemId
        )

        const { modifiedCount } = await Submissions.updateOne(
          {
            _id: req.body._id,
            userId: ctx.user._id,
            status: 'created'
          },
          { $set: { status: 'pending' } }
        )
        if (!modifiedCount) throw httpErrors.badRequest()

        const problem = await Problems.findOne({
          _id: submission.problemId
        })
        if (!problem) throw httpErrors.internalServerError()

        await publishAsync<IJudgeRequestMsg>(judgeRequestTopic, {
          runner_args: problem.runnerArgs,
          runner_user: creds._id,
          runner_pass: creds.password,
          problem_id: problem._id,
          submission_id: submission._id,
          user_id: ctx.user._id,
          user_group: ctx.user.group
        })

        return 0
      })
  )
  .route('/admin', (C) =>
    C.transform((ctx) => {
      ctx.requires(false)
      return ctx
    })
      .router()
      .handle('GET', '/', (C) =>
        C.handler()
          .query(
            Type.Object({
              _id: Type.String()
            })
          )
          .handle(async (ctx, req) => {
            const submission = await Submissions.findOne(req.query)
            if (!submission) throw req.server.httpErrors.notFound()
            return submission
          })
      )
      .handle('PUT', '/', (C) =>
        C.handler()
          .body(
            Type.Object({
              _id: Type.String(),
              $set: Type.Object({
                score: Type.Number(),
                status: SubmissionStatusSchema,
                message: Type.String(),
                createdAt: Type.Number(),
                updatedAt: Type.Number()
              })
            })
          )
          .handle(async (ctx, req) => {
            const { _id, $set } = req.body
            await Submissions.updateOne({ _id }, { $set })
            return 0
          })
      )
      .handle('DELETE', '/', (C) =>
        C.handler()
          .query(
            Type.Object({
              _id: Type.String()
            })
          )
          .handle(async (ctx, req) => {
            const { _id } = req.query
            await Submissions.deleteOne({ _id })
            return 0
          })
      )
      .handle('POST', '/count', (C) =>
        C.handler()
          .body(adminFilterSchema)
          .handle(async (ctx, req) => {
            return Submissions.countDocuments(req.body.filter)
          })
      )
      .handle('POST', '/search', (C) =>
        C.handler()
          .body(adminSearchSchema)
          .handle(async (ctx, req) => {
            const users = await Submissions.find(req.body.filter, {
              ...pagingToOptions(req.body)
            }).toArray()
            return users
          })
      )
      .handle('POST', '/resubmit', (C) =>
        C.handler()
          .body(
            Type.Object({
              _id: Type.String()
            })
          )
          .handle(async (ctx, req) => {
            const { value } = await Submissions.findOneAndUpdate(req.body, {
              $set: { status: 'pending' }
            })
            if (!value) throw httpErrors.notFound()

            const creds = await getSCOWCredentialsForProblem(
              ctx.user._id,
              value.problemId
            )

            const problem = await Problems.findOne({ _id: value.problemId })
            if (!problem) throw httpErrors.internalServerError()

            await publishAsync<IJudgeRequestMsg>(judgeRequestTopic, {
              runner_args: problem.runnerArgs,
              runner_user: creds._id,
              runner_pass: creds.password,
              problem_id: problem._id,
              submission_id: value._id,
              user_id: ctx.user._id,
              user_group: ctx.user.group
            })

            return 0
          })
      )
  )
