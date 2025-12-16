import nodemailer from 'nodemailer'
import Config from '../config'

export const transporter = nodemailer.createTransport({
  host: Config.SMTP_HOST,
  port: Config.SMTP_PORT,
  secure: Config.SMTP_SECURE,
  auth: Config.SMTP_USER && Config.SMTP_PASS ? {
    user: Config.SMTP_USER,
    pass: Config.SMTP_PASS,
  } : undefined,
})

export async function sendVerificationEmail(to: string, code: string) {
  const verifyUrl = `${Config.APP_BASE_URL}/users/email/verify?email=${encodeURIComponent(to)}&code=${encodeURIComponent(code)}`
  const html = [
    `<p>Welcome!</p>`,
    `<p>Please verify your email address by clicking the link below:</p>`,
    `<p><a href="${verifyUrl}">Verify Email</a></p>`,
    `<p>If the button doesn't work, copy and paste this URL:</p>`,
    `<p>${verifyUrl}</p>`
  ].join('\n')

  const info = await transporter.sendMail({
    from: Config.SMTP_FROM,
    to,
    subject: 'Verify your email',
    html,
  })
  return info
}
