import { test } from 'node:test'
import * as assert from 'node:assert'
import { build, createJsonapiRequest, generateTestAuthForRole, getAuthHeaders } from '../helper'
import { UserModel } from '../../src/model/user'
import { editUserFormState } from '../../src/state/form/edit.user.form.state'

const getMainItems = () => {
  const stack = editUserFormState.items?.[0]
  assert.ok(stack)
  assert.strictEqual(stack.type, 'stack')
  return stack.items ?? []
}

const getTextfield = (name: string) => {
  const item = getMainItems().find(formItem => formItem.type === 'textfield' && formItem.name === name)
  assert.ok(item, `Expected textfield named ${name}`)
  return item
}

const getStateButton = (label: string) => {
  const item = getMainItems().find(formItem => formItem.type === 'state_button' && formItem.has?.label === label)
  assert.ok(item, `Expected state_button labeled ${label}`)
  return item
}

test('account form should gate profile editing behind email verification and show status metadata', () => {
  const fields = ['name', 'firstname', 'lastname', 'email', 'phone']

  for (const fieldName of fields) {
    const field = getTextfield(fieldName)
    assert.strictEqual(field.props?.['data-lock-until-email-verified'], true)
  }

  const emailField = getTextfield('email')
  assert.strictEqual((emailField.inputProps as any)?.props?.['data-email-verified-adornment'], true)

  const submit = getMainItems().find(item => item.type === 'submit')
  assert.ok(submit)
  assert.strictEqual(submit.props?.['data-lock-until-email-verified'], true)
})

test('account form should expose a resend verification action while email is unverified', () => {
  const resendButton = getStateButton('Resend Verification Email')
  assert.strictEqual(resendButton.has?.icon, 'mark_email_unread')
  assert.strictEqual(resendButton.has?.onclickHandlerDirective?.type, '$form_none')
  assert.strictEqual(resendButton.has?.onclickHandlerDirective?.endpoint, 'api/account/resend-verification')
})

test('account form should keep Patreon connect action enabled', () => {
  const patreonBox = getMainItems().find(item => item.type === 'box')
  assert.ok(patreonBox)

  const patreonStack = patreonBox.items?.[0]
  assert.ok(patreonStack)
  assert.strictEqual(patreonStack.type, 'stack')

  const connectButton = patreonStack.items?.find(item => item.type === 'state_button')
  assert.ok(connectButton)
  assert.strictEqual(connectButton.has?.label, 'Connect Patreon')
  assert.strictEqual(connectButton.has?.onclickHandler, 'tuberCallbacks.openPatreonUpgrade')
  assert.notStrictEqual(connectButton.props?.disabled, true)
})

test('POST /api/account should reject profile updates until the email is verified', async (t) => {
  const app = await build(t)
  const auth = await generateTestAuthForRole(app, 'free')

  assert.ok(auth.token)

  const response = await app.inject({
    method: 'POST',
    url: '/api/account',
    headers: getAuthHeaders(auth.token!),
    payload: createJsonapiRequest('account', {
      firstname: 'Updated',
      lastname: 'User'
    })
  })

  assert.strictEqual(response.statusCode, 403)
  const body = JSON.parse(response.payload)
  assert.strictEqual(body.errors?.[0]?.code, 'EMAIL_NOT_VERIFIED')
})

test('POST /api/account/resend-verification should send a fresh verification email for unverified users', async (t) => {
  const app = await build(t)
  const auth = await generateTestAuthForRole(app, 'free')

  assert.ok(auth.token)

  const response = await app.inject({
    method: 'POST',
    url: '/api/account/resend-verification',
    headers: getAuthHeaders(auth.token!),
    payload: {}
  })

  assert.strictEqual(response.statusCode, 200)
  const body = JSON.parse(response.payload)
  assert.match(body.state?.tmp?.['default-success']?.message ?? '', /verification email/i)

  const user = await UserModel.findById(auth.user!._id)
  assert.ok(user?.email_verification_code)
})

test('POST /api/account should allow profile updates after the email is verified', async (t) => {
  const app = await build(t)
  const auth = await generateTestAuthForRole(app, 'free')

  assert.ok(auth.token)
  assert.ok(auth.user?._id)

  await UserModel.updateOne(
    { _id: auth.user!._id },
    {
      $set: {
        email_verified: true,
        email_verified_at: new Date()
      }
    }
  )

  const response = await app.inject({
    method: 'POST',
    url: '/api/account',
    headers: getAuthHeaders(auth.token!),
    payload: createJsonapiRequest('account', {
      firstname: 'Updated',
      lastname: 'User'
    })
  })

  assert.strictEqual(response.statusCode, 200)
  const body = JSON.parse(response.payload)
  assert.strictEqual(body.data?.attributes?.firstname, 'Updated')
  assert.strictEqual(body.data?.attributes?.lastname, 'User')
})
