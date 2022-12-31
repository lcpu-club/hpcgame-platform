import { Type } from '@sinclair/typebox'
import { getUploadUrl } from '../../../storage/index.js'
import { adminChain } from './base.js'

export const adminRouter = adminChain
  .router()
  .handle('POST', '/getUploadUrl', (C) =>
    C.handler()
      .body(
        Type.Object({
          ossKey: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        return {
          url: await getUploadUrl(req.body.ossKey)
        }
      })
  )
