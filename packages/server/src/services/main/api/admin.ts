import { Type } from '@sinclair/typebox'
import {
  getSCOWCredentialsForUser,
  getSCOWCredentialsForProblem,
  SCOWCredentials
} from '../../../db/scow.js'
import { sysGet, kTagRules, defaultTagRules } from '../../../db/syskv.js'
import { generateAuthToken, Users } from '../../../db/user.js'
import {
  initSCOW,
  setAccountBlock,
  syncAccountStatusWithSlurm
} from '../../../scow/index.js'
import { getDownloadUrl, getUploadUrl } from '../../../storage/index.js'
import { execuateRules } from '../../../utils/rules.js'
import { httpErrors } from '../index.js'
import { protectedChain } from './base.js'

export const adminRouter = protectedChain
  .transform((ctx) => {
    ctx.requires(ctx.user.group === 'staff')
    return ctx
  })
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
  .handle('POST', '/syncUserTags', (C) =>
    C.handler().handle(async (ctx) => {
      ctx.requires(false)
      const { rules } = await sysGet(kTagRules, defaultTagRules)
      const users = Users.find()
      for await (const user of users) {
        const tags = execuateRules<string[]>(rules, user, user.tags)
        if (tags.some((tag) => !user.tags.includes(tag))) {
          await Users.updateOne(
            { _id: user._id },
            { $addToSet: { tags: { $each: tags } } }
          )
        }
      }
      return 0
    })
  )
  .handle('POST', '/resetAuthTokens', (C) =>
    C.handler().handle(async (ctx) => {
      ctx.requires(false)
      const users = Users.find()
      for await (const user of users) {
        user.authToken = await generateAuthToken(user._id)
      }
      return 0
    })
  )
  .route('/scow', (C) =>
    C.transform((ctx) => {
      ctx.requires(false)
      return ctx
    })
      .router()
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
