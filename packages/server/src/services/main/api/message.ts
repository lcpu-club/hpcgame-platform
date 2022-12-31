import { Type } from '@sinclair/typebox'
import type { Filter } from 'mongodb'
import { Messages, type IMessage } from '../../../db/message.js'
import { pagingSchema, pagingToOptions } from '../../../utils/paging.js'
import { httpErrors } from '../index.js'
import {
  adminChain,
  adminFilterSchema,
  adminSearchSchema,
  protectedChain,
  unprotectedChain
} from './base.js'

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
        const filter: Filter<IMessage> = {
          createdAt: { $gte: req.query.since },
          $or: ctx.user
            ? [
                { global: true },
                { group: ctx.user.group },
                { userId: ctx.user._id }
              ]
            : [{ global: true }]
        }
        return Messages.find(filter, {
          sort: { createdAt: -1 },
          limit: 10
        }).toArray()
      })
  )
  .handle('GET', '/global', (C) =>
    C.handler().handle(async () => {
      return Messages.find(
        { global: true },
        {
          sort: { createdAt: -1 }
        }
      ).toArray()
    })
  )
  .handle(
    'GET',
    '/self',
    protectedChain
      .handler()
      .query(pagingSchema)
      .handle(async (ctx, req) => {
        return Messages.find(
          { $or: [{ userId: ctx.user._id }, { group: ctx.user.group }] },
          { ...pagingToOptions(req.query), sort: { createdAt: -1 } }
        ).toArray()
      })
  )
  .handle(
    'GET',
    '/admin',
    adminChain
      .handler()
      .query(
        Type.Object({
          _id: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        const { _id } = req.query
        const message = await Messages.findOne({ _id })
        if (!message) throw httpErrors.notFound()
        return message
      })
  )
  .handle(
    'PUT',
    '/admin',
    adminChain
      .handler()
      .body(
        Type.Object({
          _id: Type.String(),
          $set: Type.Object({
            global: Type.Boolean(),
            group: Type.String(),
            userId: Type.String(),
            title: Type.String(),
            content: Type.String(),
            createdAt: Type.Number(),
            metadata: Type.Record(Type.String(), Type.Unknown())
          })
        })
      )
      .handle(async (ctx, req) => {
        const { _id, $set } = req.body
        await Messages.updateOne({ _id }, { $set }, { upsert: true })
        return 0
      })
  )
  .handle(
    'DELETE',
    '/admin',
    adminChain
      .handler()
      .query(
        Type.Object({
          _id: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        const { _id } = req.query
        await Messages.deleteOne({ _id })
        return 0
      })
  )
  .handle(
    'POST',
    '/count',
    adminChain
      .handler()
      .body(adminFilterSchema)
      .handle(async (ctx, req) => {
        return Messages.countDocuments(req.body.filter)
      })
  )
  .handle(
    'POST',
    '/search',
    adminChain
      .handler()
      .body(adminSearchSchema)
      .handle(async (ctx, req) => {
        const users = await Messages.find(req.body.filter, {
          ...pagingToOptions(req.body)
        }).toArray()
        return users
      })
  )
