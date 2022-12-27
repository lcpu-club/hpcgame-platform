import { createTransport } from 'nodemailer'
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM,
  MAIL_SENDER
} from '../config/index.js'

const transport = createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
})

export async function sendMail(to: string, subject: string, html: string) {
  await transport.sendMail({
    from: MAIL_FROM,
    sender: MAIL_SENDER,
    to,
    subject,
    html
  })
}
