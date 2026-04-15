import { test } from 'node:test'
import * as assert from 'node:assert'
import { build, createJsonapiRequest, generateTestAuthForRole, getAuthHeaders } from '../helper'
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

test('account form should expose role and keep profile fields read-only', () => {
  const fields = ['name', 'firstname', 'lastname', 'email', 'phone', 'role']

  for (const fieldName of fields) {
    const field = getTextfield(fieldName)
    assert.strictEqual(field.inputProps?.readOnly, true)
  }

  const submit = getMainItems().find(item => item.type === 'submit')
  assert.ok(submit)
  assert.strictEqual(submit.props?.disabled, true)
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

test('POST /account should reject profile updates while editing is disabled', async (t) => {
  const app = await build(t)
  const auth = await generateTestAuthForRole(app, 'free')

  assert.ok(auth.token)

  const response = await app.inject({
    method: 'POST',
    url: '/account',
    headers: getAuthHeaders(auth.token!),
    payload: createJsonapiRequest('account', {
      firstname: 'Updated',
      lastname: 'User'
    })
  })

  assert.strictEqual(response.statusCode, 503)
  const body = JSON.parse(response.payload)
  assert.strictEqual(body.errors?.[0]?.code, 'SERVICE_UNAVAILABLE')
})
