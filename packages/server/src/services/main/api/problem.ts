import { Type } from '@sinclair/typebox'
import { MINIO_BUCKET_PROBLEM } from '../../../config/index.js'
import { type IProblem, Problems } from '../../../db/problem.js'
import {
  defaultGameSchedule,
  kGameSchedule,
  sysGet
} from '../../../db/syskv.js'
import { getDownloadUrl } from '../../../storage/index.js'
import { unsafePagingToOptions } from '../../../utils/paging.js'
import { httpErrors, server } from '../index.js'
import { adminFilterSchema, adminSearchSchema, protectedChain } from './base.js'

async function shouldShowProblems(group: string) {
  const schedule = await sysGet(kGameSchedule, defaultGameSchedule)
  return Date.now() >= schedule.start || group === 'admin' || group === 'staff'
}

export const problemRouter = protectedChain
  .router()
  .handle('GET', '/list', (C) =>
    C.handler().handle(async (ctx) => {
      if (!(await shouldShowProblems(ctx.user.group))) {
        return []
      }
      const showAll = ctx.user.group === 'admin' || ctx.user.group === 'staff'
      const problems = await Problems.find(showAll ? {} : { public: true }, {
        projection: { content: 0, runnerArgs: 0 }
      }).toArray()
      return problems as Array<Omit<IProblem, 'content'>>
    })
  )
  .handle('GET', '/render', (C) =>
    C.handler()
      .query(
        Type.Object({
          _id: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        if (!(await shouldShowProblems(ctx.user.group))) {
          throw server.httpErrors.notFound()
        }
        const showAll = ctx.user.group === 'admin' || ctx.user.group === 'staff'
        const filter = showAll ? {} : { public: true }
        const problem = await Problems.findOne(
          { _id: req.query._id, ...filter },
          { projection: { content: 1 } }
        )
        if (!problem) throw req.server.httpErrors.notFound()
        return { result: problem.content }
      })
  )
  .handle('POST', '/getDownloadUrl', (C) =>
    C.handler()
      .body(
        Type.Object({
          _id: Type.String(),
          key: Type.String({
            minLength: 1,
            maxLength: 32,
            pattern: '^[a-zA-Z0-9_]+(\\.[a-zA-Z0-9_]+)*$'
          })
        })
      )
      .handle(async (ctx, req) => {
        if (!(await shouldShowProblems(ctx.user.group))) {
          throw server.httpErrors.notFound()
        }
        const showAll = ctx.user.group === 'admin' || ctx.user.group === 'staff'
        const filter = showAll ? {} : { public: true }
        const problem = await Problems.findOne(
          { _id: req.body._id, ...filter },
          { projection: { _id: 1 } }
        )
        if (!problem) throw req.server.httpErrors.notFound()

        return {
          url: await getDownloadUrl(
            MINIO_BUCKET_PROBLEM,
            `${problem._id}/attachment/${req.body.key}`
          )
        }
      })
  )
  .route('/admin', (C) =>
    C.transform((ctx) => {
      ctx.requires(ctx.user.group === 'staff')
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
            const { _id } = req.query
            const message = await Problems.findOne({ _id })
            if (!message) throw httpErrors.notFound()
            return message
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
            await Problems.deleteOne({ _id })
            return 0
          })
      )
      .handle('PUT', '/', (C) =>
        C.handler()
          .body(
            Type.Object({
              _id: Type.String(),
              $set: Type.Object(
                {
                  public: Type.Boolean(),
                  title: Type.String(),
                  content: Type.String(),
                  score: Type.Number(),
                  maxSubmissionCount: Type.Number(),
                  maxSubmissionSize: Type.Number(),
                  runnerArgs: Type.String(),
                  category: Type.String(),
                  tags: Type.Array(Type.String()),
                  metadata: Type.Record(Type.String(), Type.Unknown())
                },
                { additionalProperties: false }
              )
            })
          )
          .handle(async (ctx, req) => {
            const { _id, $set } = req.body
            await Problems.updateOne({ _id }, { $set }, { upsert: true })
            return 0
          })
      )
      .handle('POST', '/count', (C) =>
        C.handler()
          .body(adminFilterSchema)
          .handle(async (ctx, req) => {
            return Problems.countDocuments(req.body.filter)
          })
      )
      .handle('POST', '/search', (C) =>
        C.handler()
          .body(adminSearchSchema)
          .handle(async (ctx, req) => {
            const users = await Problems.find(req.body.filter, {
              ...unsafePagingToOptions(req.body)
            }).toArray()
            return users
          })
      )
  )
