import { Type } from '@sinclair/typebox'
import { type IProblem, Problems } from '../../../db/problem.js'
import {
  defaultGameSchedule,
  kGameSchedule,
  sysGet
} from '../../../db/syskv.js'
import { server } from '../index.js'
import { protectedChain } from './base.js'

const problemQuerySchema = Type.Object({
  problemId: Type.String()
})

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
        { projection: { content: 0 } }
      ).toArray()
      return problems as Array<Omit<IProblem, 'content' | 'file'>>
    })
  )
  .handle('GET', '/render', (C) =>
    C.handler()
      .query(problemQuerySchema)
      .handle(async (ctx, req) => {
        if (!(await shouldShowProblems(ctx.user.group))) {
          throw server.httpErrors.notFound()
        }

        const problem = await Problems.findOne(
          { _id: req.query.problemId },
          { projection: { content: 1 } }
        )
        if (!problem) throw req.server.httpErrors.notFound()
        return problem.content
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
            submissionLimit: Type.Number(),
            category: Type.String(),
            tags: Type.Array(Type.String()),
            meta: Type.Record(Type.String(), Type.Unknown())
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
  // Delete problem
  .handle('DELETE', '/admin', (C) => C.handler())
  .handle('POST', '/admin/count', (C) => C.handler())
  .handle('POST', '/admin/search', (C) => C.handler())
