import { Type } from '@sinclair/typebox'
import {
  getSCOWCredentialsForUser,
  getSCOWCredentialsForProblem
} from '../../../db/scow.js'
import { initSCOW } from '../../../scow/index.js'
import { getDownloadUrl, getUploadUrl } from '../../../storage/index.js'
import { adminChain } from './base.js'

export const adminRouter = adminChain
  .router()
  .handle('POST', '/getUploadUrl', (C) =>
    C.handler()
      .body(
        Type.Object({
          bucket: Type.String(),
          ossKey: Type.String(),
          size: Type.Number()
        })
      )
      .handle(async (ctx, req) => {
        return {
          url: await getUploadUrl(
            req.body.bucket,
            req.body.ossKey,
            req.body.size
          )
        }
      })
  )
  .handle('POST', '/getDownloadUrl', (C) =>
    C.handler()
      .body(
        Type.Object({
          bucket: Type.String(),
          ossKey: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        return {
          url: await getDownloadUrl(req.body.bucket, req.body.ossKey)
        }
      })
  )
  .handle('POST', '/initSCOW', (C) =>
    C.handler().handle(async () => {
      await initSCOW()
      return 0
    })
  )
  .handle('POST', '/getSCOWCredentialsForUser', (C) =>
    C.handler()
      .body(
        Type.Object({
          _id: Type.String()
        })
      )
      .handle(async (_, req) => {
        return getSCOWCredentialsForUser(req.body._id)
      })
  )
  .handle('POST', '/getSCOWCredentialsForProblem', (C) =>
    C.handler()
      .body(
        Type.Object({
          _id: Type.String(),
          problemId: Type.String()
        })
      )
      .handle(async (_, req) => {
        return getSCOWCredentialsForProblem(req.body._id, req.body.problemId)
      })
  )
