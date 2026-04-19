import { describe, it } from 'node:test'
import assert from 'node:assert'
import { validate_mailer_runtime_config } from '../../src/utility/mailer'

describe('mailer runtime configuration', () => {
  it('throws in production when SMTP settings are missing', () => {
    assert.throws(() => validate_mailer_runtime_config({
      NODE_ENV: 'production',
      SMTP_HOST: '',
      SMTP_PORT: 0,
      SMTP_FROM: ''
    }), /SMTP/i)
  })

  it('does not throw in production when SMTP settings are present', () => {
    assert.doesNotThrow(() => validate_mailer_runtime_config({
      NODE_ENV: 'production',
      SMTP_HOST: 'smtp.example.com',
      SMTP_PORT: 587,
      SMTP_FROM: 'no-reply@example.com'
    }))
  })

  it('allows missing SMTP settings in development', () => {
    assert.doesNotThrow(() => validate_mailer_runtime_config({
      NODE_ENV: 'development',
      SMTP_HOST: '',
      SMTP_PORT: 0,
      SMTP_FROM: ''
    }))
  })
})
