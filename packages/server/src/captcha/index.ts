import fetch from 'node-fetch'
import { RECAPTCHA_SECRET } from '../config/index.js'

export async function recaptchaVerify(response: string) {
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
  return recaptchaResult.success
}
