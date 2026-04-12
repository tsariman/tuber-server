import { test } from 'node:test'
import * as assert from 'node:assert'
import { build, generateTestAuthForRole, getAuthHeaders } from '../helper'
import { get_bootstrap_key } from '../../src/business.logic/security'
import {
  BOOKMARK_NOTE_LINK_REGEX,
  BOOKMARK_NOTE_LINKS_HELPER_TEXT,
} from '../../src/business.logic/security/bookmark.note.links'

const getNoteField = (body: any, key: string) => {
  return body.state.forms[key].items[0].items[2]
}

test('POST /state/forms - should add note link invalidation for free users', async (t) => {
  const app = await build(t)
  const auth = await generateTestAuthForRole(app, 'free')
  const formsUrl = `/state/${get_bootstrap_key()}/forms`

  assert.ok(auth.token)

  const response = await app.inject({
    method: 'POST',
    url: formsUrl,
    headers: getAuthHeaders(auth.token!),
    payload: {
      key: 'newYouTubeBookmarkForm',
      theme_mode: 'light'
    }
  })

  assert.strictEqual(response.statusCode, 200)
  const body = JSON.parse(response.payload)
  const noteField = getNoteField(body, 'newYouTubeBookmarkForm')

  assert.strictEqual(noteField.name, 'note')
  assert.strictEqual(noteField.has.invalidationRegex, BOOKMARK_NOTE_LINK_REGEX.source)
  assert.strictEqual(noteField.props.helperText, BOOKMARK_NOTE_LINKS_HELPER_TEXT)
})

test('POST /state/forms - should not add note link invalidation for members', async (t) => {
  const app = await build(t)
  const auth = await generateTestAuthForRole(app, 'member')
  const formsUrl = `/state/${get_bootstrap_key()}/forms`

  assert.ok(auth.token)

  const response = await app.inject({
    method: 'POST',
    url: formsUrl,
    headers: getAuthHeaders(auth.token!),
    payload: {
      key: 'newYouTubeBookmarkForm',
      theme_mode: 'light'
    }
  })

  assert.strictEqual(response.statusCode, 200)
  const body = JSON.parse(response.payload)
  const noteField = getNoteField(body, 'newYouTubeBookmarkForm')

  assert.strictEqual(noteField.name, 'note')
  assert.strictEqual(noteField.has?.invalidationRegex, undefined)
  assert.strictEqual(noteField.props?.helperText, undefined)
})