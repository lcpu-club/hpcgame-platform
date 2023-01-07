import { Type } from '@sinclair/typebox'
import {
  getSCOWCredentialsForUser,
  getSCOWCredentialsForProblem,
  SCOWCredentials
} from '../../../db/scow.js'
import {
  initSCOW,
  setAccountBlock,
  syncAccountStatusWithSlurm
} from '../../../scow/index.js'
import { getDownloadUrl, getUploadUrl } from '../../../storage/index.js'
import { httpErrors } from '../index.js'
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
  .route('/scow', (C) =>
    C.router()
      .handle('POST', '/init', (C) =>
        C.handler().handle(async () => {
          await initSCOW()
          return 0
        })
      )
      .handle('POST', '/getCredentialForUser', (C) =>
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
      .handle('POST', '/getCredentialForProblem', (C) =>
        C.handler()
          .body(
            Type.Object({
              _id: Type.String(),
              problemId: Type.String()
            })
          )
          .handle(async (_, req) => {
            return getSCOWCredentialsForProblem(
              req.body._id,
              req.body.problemId
            )
          })
      )
      .handle('POST', '/syncAccountStatusWithSlurm', (C) =>
        C.handler().handle(async () => {
          const log = await syncAccountStatusWithSlurm()
          return { log }
        })
      )
      .handle('POST', '/setAccountBlock', (C) =>
        C.handler()
          .body(
            Type.Object({
              accountName: Type.String(),
              block: Type.Boolean()
            })
          )
          .handle(async (ctx, req) => {
            const log = await setAccountBlock(
              req.body.accountName,
              req.body.block
            )
            return { log }
          })
      )
      .handle('POST', '/credentialDetails', (C) =>
        C.handler()
          .body(
            Type.Object({
              scowUser: Type.String()
            })
          )
          .handle(async (ctx, req) => {
            const cred = await SCOWCredentials.findOne({
              _id: req.body.scowUser
            })
            if (!cred) throw httpErrors.notFound()
            return cred
          })
      )
  )
