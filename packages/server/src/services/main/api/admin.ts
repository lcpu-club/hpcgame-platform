import { Type } from '@sinclair/typebox'
import { initSCOW } from '../../../scow/index.js'
import { getDownloadUrl, getUploadUrl } from '../../../storage/index.js'
import { adminChain } from './base.js'
import { getSCOWCredentialsFor } from './user.js'

export const adminRouter = adminChain
  .router()
  .handle('POST', '/getUploadUrl', (C) =>
    C.handler()
      .body(
        Type.Object({
          ossKey: Type.String(),
          size: Type.Number()
        })
      )
      .handle(async (ctx, req) => {
        return {
          url: await getUploadUrl(req.body.ossKey, req.body.size)
        }
      })
  )
  .handle('POST', '/getDownloadUrl', (C) =>
    C.handler()
      .body(
        Type.Object({
          ossKey: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        return {
          url: await getDownloadUrl(req.body.ossKey)
        }
      })
  )
  .handle('POST', '/initSCOW', (C) =>
    C.handler().handle(async () => {
      await initSCOW()
      return 0
    })
  )
  .handle('POST', '/getSCOWCredentialsFor', (C) =>
    C.handler()
      .body(
        Type.Object({
          _id: Type.String()
        })
      )
      .handle(async (_, req) => {
        return getSCOWCredentialsFor(req.body._id)
      })
  )
