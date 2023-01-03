import { Type } from '@sinclair/typebox'
import { MINIO_BUCKET_PROBLEM } from '../../../config/index.js'
import { type IProblem, Problems } from '../../../db/problem.js'
import {
  defaultGameSchedule,
  kGameSchedule,
  sysGet
} from '../../../db/syskv.js'
import { getDownloadUrl } from '../../../storage/index.js'
import { pagingToOptions } from '../../../utils/paging.js'
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

      const problems = await Problems.find(
        {},
        { projection: { content: 0, runnerArgs: 0 } }
      ).toArray()
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

        const problem = await Problems.findOne(
          { _id: req.query._id },
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

        const problem = await Problems.findOne(
          { _id: req.body._id },
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
  .handle('GET', '/admin', (C) =>
    C.handler()
      .query(
        Type.Object({
          _id: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        ctx.requires(false)
        const { _id } = req.query
        const message = await Problems.findOne({ _id })
        if (!message) throw httpErrors.notFound()
        return message
      })
  )
  .handle('DELETE', '/admin', (C) =>
    C.handler()
      .query(
        Type.Object({
          _id: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        ctx.requires(false)
        const { _id } = req.query
        await Problems.deleteOne({ _id })
        return 0
      })
  )
  .handle('PUT', '/admin', (C) =>
    C.handler()
      .body(
        Type.Object({
          _id: Type.String(),
          $set: Type.Object({
            title: Type.String(),
            content: Type.String(),
            score: Type.Number(),
            maxSubmissionCount: Type.Number(),
            maxSubmissionSize: Type.Number(),
            runnerArgs: Type.String(),
            category: Type.String(),
            tags: Type.Array(Type.String()),
            metadata: Type.Record(Type.String(), Type.Unknown())
          })
        })
      )
      .handle(async (ctx, req) => {
        ctx.requires(false)
        const { _id, $set } = req.body
        await Problems.updateOne({ _id }, { $set }, { upsert: true })
        return 0
      })
  )
  .handle('POST', '/admin/count', (C) =>
    C.handler()
      .body(adminFilterSchema)
      .handle(async (ctx, req) => {
        ctx.requires(false)
        return Problems.countDocuments(req.body.filter)
      })
  )
  .handle('POST', '/admin/search', (C) =>
    C.handler()
      .body(adminSearchSchema)
      .handle(async (ctx, req) => {
        ctx.requires(false)
        const users = await Problems.find(req.body.filter, {
          ...pagingToOptions(req.body)
        }).toArray()
        return users
      })
  )
