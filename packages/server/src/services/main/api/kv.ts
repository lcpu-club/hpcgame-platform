import { Type } from '@sinclair/typebox'
import { SysKVItems, sysSet, sysTryGet } from '../../../db/syskv.js'
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
        return sysTryGet(req.params.key)
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
          value: Type.Unknown()
        })
      )
      .handle(async (ctx, req) => {
        await sysSet(req.body._id, req.body.value)
        return 0
      })
  )
  .handle(
    'DELETE',
    '/admin',
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
    '/admin/list',
    adminChain.handler().handle(async () => {
      return SysKVItems.find({}, { projection: { _id: 1 } }).toArray()
    })
  )
