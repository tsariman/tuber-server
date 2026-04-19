import nodemailer from 'nodemailer'
import Config from '../config'

type TMailerRuntimeConfig = {
  NODE_ENV: string
  SMTP_HOST: string
  SMTP_PORT: number
  SMTP_FROM: string
  SMTP_USER?: string
  SMTP_PASS?: string
}

export function validate_mailer_runtime_config(config: TMailerRuntimeConfig): void {
  const isProduction = config.NODE_ENV === 'production'
  const hasHost = Boolean(config.SMTP_HOST?.trim())
  const hasPort = Number(config.SMTP_PORT) > 0
  const normalizedFrom = config.SMTP_FROM?.trim().toLowerCase() ?? ''
  const hasFrom = Boolean(normalizedFrom) && !normalizedFrom.includes('localhost')
  const hasUser = Boolean(config.SMTP_USER?.trim())
  const hasPass = Boolean(config.SMTP_PASS?.trim())

  if (hasUser !== hasPass) {
    throw new Error('SMTP auth is incomplete. Set SMTP_USER and SMTP_PASS together.')
  }

  if (isProduction && (!hasHost || !hasPort || !hasFrom)) {
    throw new Error(
      'SMTP is not configured for production. Set SMTP_HOST, SMTP_PORT, and SMTP_FROM to enable verification and recovery emails.'
    )
  }
}

validate_mailer_runtime_config(Config)

const hasSmtpConfig = Boolean(Config.SMTP_HOST && Config.SMTP_PORT)
const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '')
let hasVerifiedTransport = false

export const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: Config.SMTP_HOST,
      port: Config.SMTP_PORT,
      secure: Config.SMTP_SECURE,
      auth: Config.SMTP_USER && Config.SMTP_PASS
        ? {
            user: Config.SMTP_USER,
            pass: Config.SMTP_PASS,
          }
        : undefined,
    })
  : nodemailer.createTransport({ jsonTransport: true })

async function verifyTransport(): Promise<void> {
  if (!hasSmtpConfig || hasVerifiedTransport) {
    return
  }

  await transporter.verify()
  hasVerifiedTransport = true
  console.info('[MAILER] SMTP transport verified.')
}

function logMailPreview(subject: string, to: string, url: string) {
  if (!hasSmtpConfig) {
    console.info(`[MAILER][DEV] ${subject} prepared for ${to}: ${url}`)
  }
}

export async function sendVerificationEmail(to: string, code: string) {
  const verifyUrl = `${trimTrailingSlash(Config.APP_BASE_URL)}/users/email/verify?email=${encodeURIComponent(to)}&code=${encodeURIComponent(code)}`
  const html = [
    `<p>Welcome!</p>`,
    `<p>Please verify your email address by clicking the link below:</p>`,
    `<p><a href="${verifyUrl}">Verify Email</a></p>`,
    `<p>If the button doesn't work, copy and paste this URL:</p>`,
    `<p>${verifyUrl}</p>`
  ].join('\n')

  await verifyTransport()
  const info = await transporter.sendMail({
    from: Config.SMTP_FROM,
    to,
    subject: 'Verify your email',
    html,
  })

  logMailPreview('Verify your email', to, verifyUrl)
  return info
}

export async function sendPasswordRecoveryEmail(to: string, token: string) {
  const resetBaseUrl = trimTrailingSlash(Config.CLIENT_DOMAIN || Config.APP_BASE_URL)
  const resetUrl = `${resetBaseUrl}/reset-password?email=${encodeURIComponent(to)}&token=${encodeURIComponent(token)}`
  const html = [
    `<p>We received a request to reset your password.</p>`,
    `<p>Click the link below to choose a new password:</p>`,
    `<p><a href="${resetUrl}">Reset Password</a></p>`,
    `<p>This link expires in 1 hour.</p>`,
    `<p>If you did not request this change, you can safely ignore this email.</p>`,
    `<p>${resetUrl}</p>`
  ].join('\n')

  await verifyTransport()
  const info = await transporter.sendMail({
    from: Config.SMTP_FROM,
    to,
    subject: 'Reset your password',
    html,
  })

  logMailPreview('Reset your password', to, resetUrl)
  return info
}
