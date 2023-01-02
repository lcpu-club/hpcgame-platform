import { Type } from '@sinclair/typebox'
import {
  DEV_MODE,
  IAAA_ID,
  IAAA_KEY,
  MAIL_BLACKLIST,
  MAIL_WHITELIST,
  NEWCOMER_YEAR
} from '../../../config/index.js'
import { createUser, UserGroupSchema, Users } from '../../../db/user.js'
import { rootChain } from './base.js'
import { validate } from '@pku-internals/iaaa'
import { server } from '../index.js'
import { redis } from '../../../cache/index.js'
import isemail from 'isemail'
import { sendMail } from '../../../mail/index.js'
import { recaptchaVerify } from '../../../captcha/index.js'

function isNewComer(identityId: string) {
  return identityId.length === 10 && identityId.startsWith(NEWCOMER_YEAR)
}

function generateCode() {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0')
}

function validateMail(mail: string) {
  if (!isemail.validate(mail)) {
    throw server.httpErrors.badRequest()
  }
  if (!MAIL_WHITELIST.some((sfx) => mail.endsWith(sfx))) {
    throw server.httpErrors.badRequest()
  }
  if (MAIL_BLACKLIST.some((sfx) => mail.endsWith(sfx))) {
    throw server.httpErrors.badRequest()
  }
}

export const authRouter = rootChain
  .router()
  .handle('GET', '/dev', (C) =>
    C.handler()
      .query(
        Type.Object({
          name: Type.String(),
          group: UserGroupSchema
        })
      )
      .handle(async (ctx, req) => {
        if (!DEV_MODE) throw req.server.httpErrors.notFound()
        const user = await Users.findOne(
          { name: req.query.name },
          { projection: { scowCredentials: 0 } }
        )
        if (user) {
          return user
        }
        return createUser({
          name: req.query.name,
          group: req.query.group,
          tags: [],
          email: 'no@email.at.all',
          problemStatus: {},
          metadata: {}
        })
      })
  )
  .handle('POST', '/iaaa', (C) =>
    C.handler()
      .body(
        Type.Object({
          token: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        const resp = await validate(req.ip, IAAA_ID, IAAA_KEY, req.body.token)
        if (!resp.success) throw server.httpErrors.forbidden(resp.errMsg)
        const iaaaId = resp.userInfo.identityId
        const user = await Users.findOne(
          { iaaaId },
          { projection: { scowCredentials: 0 } }
        )
        if (user) return user
        return createUser({
          name: resp.userInfo.name,
          group: 'pku',
          tags: isNewComer(iaaaId) ? ['newcomer'] : [],
          email: `${resp.userInfo.identityId}@pku.edu.cn`,
          problemStatus: {},
          iaaaId,
          metadata: {
            realname: resp.userInfo.name,
            organization: resp.userInfo.dept
          }
        })
      })
  )
  .handle('POST', '/mail/send', (C) =>
    C.handler()
      .body(
        Type.Object({
          mail: Type.String(),
          response: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        await recaptchaVerify(req.body.response)

        const to = req.body.mail
        validateMail(to)

        const code = generateCode()
        await redis.set(`mail:${to}`, code, 'EX', 5 * 60)

        await sendMail(
          to,
          `HPC Game验证码`,
          `
<div>
  <center><img src="https://asset.zisu.dev/svg/hpcgame_logo_text.svg" height="128"></center>
  <center><h2>您的验证码是</h2></center>
  <center><h1><code style="background: #eee">${code}</code></h1><h1></h1></center>
  <center><h2>请在5分钟内使用。</h2></center>
  <hr>
  <center>该邮件为系统自动发送，请勿回复。</center>
</div>`
        )

        return 0
      })
  )
  .handle('POST', '/mail/verify', (C) =>
    C.handler()
      .body(
        Type.Object({
          mail: Type.String(),
          code: Type.String()
        })
      )
      .handle(async (ctx, req) => {
        const { mail, code } = req.body
        validateMail(mail)

        const answer = await redis.get(`mail:${mail}`)
        if (!answer) {
          throw server.httpErrors.forbidden()
        }
        await redis.del(`mail:${mail}`)

        if (answer !== code) {
          throw server.httpErrors.forbidden()
        }

        const user = await Users.findOne(
          { authEmail: mail },
          { projection: { scowCredentials: 0 } }
        )
        if (user) return user
        return createUser({
          name: mail.split('@')[0],
          group: 'social',
          tags: [],
          email: mail,
          problemStatus: {},
          authEmail: mail,
          metadata: {}
        })
      })
  )
