import { describe, it } from 'node:test'
import assert from 'node:assert'
import RequestDataValidator from '../../src/business.logic/RequestDataValidator'
import type { TStateForm } from '@tuber/shared'

describe('RequestDataValidator mustMatch', () => {
  const formState: TStateForm = {
    name: 'test-form',
    items: [
      { name: 'password', has: { required: true } },
      { name: 'confirmPassword', has: { mustMatch: 'password' } }
    ]
  } as unknown as TStateForm

  it('passes when fields match', () => {
    const record = { password: 'abc123', confirmPassword: 'abc123' }
    const validator = new RequestDataValidator(record, formState)
    const errors = validator.validateAgainstFormState()
    assert.equal(errors, null)
  })

  it('fails when fields do not match', () => {
    const record = { password: 'abc123', confirmPassword: 'abc124' }
    const validator = new RequestDataValidator(record, formState)
    const errors = validator.validateAgainstFormState()
    assert.ok(errors)
    assert.equal(errors?.errors?.[0]?.code, 'VALIDATION_ERROR')
  })

  it('fails when target field is missing', () => {
    const record = { confirmPassword: 'abc123' }
    const validator = new RequestDataValidator(record, formState)
    const errors = validator.validateAgainstFormState()
    assert.ok(errors)
    assert.equal(errors?.errors?.[0]?.code, 'VALIDATION_ERROR')
  })
})
