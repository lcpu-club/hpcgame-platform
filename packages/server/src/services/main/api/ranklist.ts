import { Type } from '@sinclair/typebox'
import { createHash } from 'crypto'
import { redis } from '../../../cache/index.js'
import { Problems } from '../../../db/problem.js'
import { type IRanklist, Ranklists } from '../../../db/ranklist.js'
import {
  defaultGameSchedule,
  kGameSchedule,
  sysGet
} from '../../../db/syskv.js'
import { type IRankRequestMsg, rankRequestTopic } from '../../../mq/index.js'
import { publishAsync } from '../../../mq/writer.js'
import { httpErrors } from '../index.js'
import { protectedChain } from './base.js'

function md5(str: string) {
  const hash = createHash('md5')
  hash.update(str)
  return hash.digest('hex')
}

async function shouldShowRanklists(group: string) {
  const schedule = await sysGet(kGameSchedule, defaultGameSchedule)
  return Date.now() >= schedule.start || group === 'admin' || group === 'staff'
}

export const ranklistRouter = protectedChain
  .router()
  .handle('GET', '/list', (C) =>
    C.handler().handle(async (ctx) => {
      if (!(await shouldShowRanklists(ctx.user.group))) {
        return []
      }
      const showAll = ctx.user.group === 'admin' || ctx.user.group === 'staff'
      return Ranklists.find(showAll ? {} : { public: true }, {
        projection: { _id: 1, name: 1, public: 1, updatedAt: 1 }
      }).toArray() as Promise<
        Pick<IRanklist, '_id' | 'name' | 'public' | 'updatedAt'>[]
      >
    })
  )
  .handle('GET', '/', (C) =>
    C.handler()
      .query(
        Type.Object({
          _id: Type.String()
        })
      )
      .handle(async (ctx, req, rep) => {
        const { _id } = req.query
        const showAll = ctx.user.group === 'admin' || ctx.user.group === 'staff'
        const filter = showAll ? {} : { public: true }
        const cacheKey = `ranklist:${showAll}:${_id}`
        const cached = await redis.get(cacheKey)
        if (cached) {
          rep.header('Content-Type', 'application/json')
          return cached
        }
        const data = await Ranklists.aggregate([
          { $match: { _id, ...filter } },
          {
            $project: {
              players: 1,
              topstars: 1,
              userIds: {
                $map: {
                  input: '$players',
                  as: 'player',
                  in: '$$player.userId'
                }
              }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userIds',
              foreignField: '_id',
              as: 'users'
            }
          },
          {
            $project: {
              players: 1,
              topstars: 1,
              users: {
                _id: 1,
                name: 1,
                group: 1,
                tags: 1,
                email: 1
              }
            }
          }
        ]).next()
        if (!data) throw httpErrors.notFound()
        for (const user of data.users) {
          user.email = md5(user.email)
        }
        data.problems = await Problems.find(filter, {
          projection: { _id: 1, title: 1, score: 1, category: 1 }
        }).toArray()
        await redis.set(cacheKey, JSON.stringify(data), 'EX', 30)
        return data
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
            const { _id } = req.query
            const ranklist = await Ranklists.findOne({ _id })
            if (!ranklist) throw httpErrors.notFound()
            return ranklist
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
            await Ranklists.deleteOne({ _id })
            return 0
          })
      )
      .handle('POST', '/', (C) =>
        C.handler()
          .body(
            Type.Object(
              {
                _id: Type.String(),
                public: Type.Boolean(),
                name: Type.String(),
                options: Type.Object({
                  filter: Type.Any(),
                  playerCount: Type.Number(),
                  topstarCount: Type.Number()
                })
              },
              { additionalProperties: false }
            )
          )
          .handle(async (ctx, req) => {
            await Ranklists.insertOne({
              ...req.body,
              players: [],
              topstars: [],
              updatedAt: 0
            })
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
                  name: Type.String(),
                  options: Type.Object({
                    filter: Type.Any(),
                    playerCount: Type.Number(),
                    topstarCount: Type.Number()
                  })
                },
                { additionalProperties: false }
              )
            })
          )
          .handle(async (ctx, req) => {
            const { _id, $set } = req.body
            await Ranklists.updateOne({ _id }, { $set })
            return 0
          })
      )
      .handle('POST', '/rank', (C) =>
        C.handler().handle(async () => {
          await publishAsync<IRankRequestMsg>(rankRequestTopic, {})
          return 0
        })
      )
  )
