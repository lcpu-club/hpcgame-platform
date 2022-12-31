import { Type } from '@sinclair/typebox'
import { getDownloadUrl, getUploadUrl } from '../../../storage/index.js'
import { adminChain } from './base.js'

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
