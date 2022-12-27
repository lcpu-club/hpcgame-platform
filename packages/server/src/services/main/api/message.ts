import { Type } from '@sinclair/typebox'
import type { Filter } from 'mongodb'
import { nanoid } from 'nanoid'
import { Events, IEvent } from '../../../db/message.js'
import { server } from '../index.js'
import { unprotectedChain } from './base.js'

export const messageRouter = unprotectedChain
  .router()
  .handle('GET', '/poll', (C) =>
    C.handler()
      .query(
        Type.Object({
          since: Type.Number()
        })
      )
      .handle(async (ctx, req) => {
        const filter: Filter<IEvent> = {
          timestamp: { $gte: req.query.since },
          $or: ctx.user
            ? [
                { global: true },
                { group: ctx.user.group },
                { userId: ctx.user._id }
              ]
            : [{ global: true }]
        }
        return Events.find(filter, {
          sort: { timestamp: -1 },
          limit: 10
        }).toArray()
      })
  )
  .handle('PUT', '/', (C) =>
    C.handler()
      .body(
        Type.Object({
          _id: Type.String(),
          $set: Type.Object({
            global: Type.Boolean(),
            group: Type.String(),
            userId: Type.String(),
            title: Type.String(),
            content: Type.String(),
            timestamp: Type.Number(),
            metadata: Type.Record(Type.String(), Type.Unknown())
          })
        })
      )
      .handle(async (ctx, req) => {
        if (ctx.user?.group !== 'admin') throw server.httpErrors.notFound()
        const { _id, $set } = req.body
        await Events.updateOne({ _id }, { $set }, { upsert: true })
        return 0
      })
  )
