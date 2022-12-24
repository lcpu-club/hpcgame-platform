import { Type } from '@sinclair/typebox'
import { IProblem, Problems } from '../../../db/problem.js'
import { protectedChain } from './base.js'

const problemQuerySchema = Type.Object({
  problemId: Type.String()
})

export const problemRouter = protectedChain
  .router()
  .handle('GET', '/list', (C) =>
    C.handler().handle(async () => {
      const problems = await Problems.find(
        {},
        { projection: { content: 0, file: 0 } }
      ).toArray()
      return problems as Array<Omit<IProblem, 'content' | 'file'>>
    })
  )
  .handle('GET', '/render', (C) =>
    C.handler()
      .query(problemQuerySchema)
      .handle(async (ctx, req) => {
        const problem = await Problems.findOne(
          { _id: req.query.problemId },
          { projection: { content: 1 } }
        )
        if (!problem) throw req.server.httpErrors.notFound()
        return problem.content
      })
  )
  .handle('POST', '/add', (C) =>
    C.handler().body(
      Type.Object({
        problemId: Type.String()
      })
    )
  )
