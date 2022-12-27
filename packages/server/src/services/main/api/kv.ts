import { Type } from '@sinclair/typebox'
import { SysKVItems } from '../../../db/syskv.js'
import { rootChain, adminChain } from './base.js'

export const kvRouter = rootChain
  .router()
  .handle('GET', '/load/:key', (C) =>
    C.handler()
      .params(
        Type.Object({
          key: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        return SysKVItems.findOne({ _id: req.params.key })
      })
  )
  .handle(
    'PUT',
    '/',
    adminChain
      .handler()
      .body(
        Type.Object({
          _id: Type.String(),
          value: Type.Unknown()
        })
      )
      .handle(async (ctx, req) => {
        await SysKVItems.updateOne(
          { _id: req.body._id },
          { $set: { value: req.body.value } },
          { upsert: true }
        )
        return 0
      })
  )
  .handle(
    'DELETE',
    '/',
    adminChain
      .handler()
      .body(
        Type.Object({
          _id: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        await SysKVItems.deleteOne({ _id: req.body._id })
        return 0
      })
  )
  .handle(
    'GET',
    '/list',
    adminChain.handler().handle(async () => {
      return SysKVItems.find({}, { projection: { _id: 1 } }).toArray()
    })
  )
