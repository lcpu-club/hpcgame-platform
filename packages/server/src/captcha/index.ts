import fetch, { FetchError } from 'node-fetch'
import { RECAPTCHA_SECRET } from '../config/index.js'
import { logger } from '../logger/index.js'
import { httpErrors } from '../services/main/index.js'

export async function recaptchaVerify(response: string) {
  try {
    // Verify using recaptcha v2
    const recaptchaResponse = await fetch(
      'https://www.recaptcha.net/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          secret: RECAPTCHA_SECRET,
          response
        }).toString()
      }
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recaptchaResult = <any>await recaptchaResponse.json()
    if (!recaptchaResult.success) {
      logger.error(recaptchaResult)
      throw httpErrors.badRequest(`Failed to verify recaptcha`)
    }
  } catch (err) {
    if (err instanceof FetchError) {
      logger.error(err)
      throw httpErrors.badGateway(`Failed to connect to recaptcha server`)
    }
    throw err
  }
}
