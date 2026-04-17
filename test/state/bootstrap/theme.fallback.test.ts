import { describe, it } from 'node:test'
import assert from 'node:assert'
import Config from '../../../src/config'
import { PrepareState } from '../../../src/state/PrepareState'
import { bootstrap_app_state } from '../../../src/state/bootstrap/app'
import bootstrap_theme_state from '../../../src/state/bootstrap/theme'
import { bootstrap_forms_state } from '../../../src/state/bootstrap/form'
import { bootstrap_pages_state } from '../../../src/state/bootstrap/page'
import { bootstrap_dialogs_state } from '../../../src/state/bootstrap/dialog'

describe('state bootstrap theme fallback', () => {
  it('uses the default theme when context.theme is missing', () => {
    assert.doesNotThrow(() => {
      const context = {} as any

      const appState = new PrepareState<any>(context)
        .process(bootstrap_app_state)
        .get() as { themeMode?: string }
      assert.strictEqual(appState.themeMode, Config.DEFAULT_THEME_MODE)

      const themeState = new PrepareState<any>(context)
        .process(bootstrap_theme_state)
        .get()
      assert.ok(themeState)

      const formsState = new PrepareState<any>(context)
        .process(bootstrap_forms_state)
        .get()
      assert.ok(formsState)

      const pagesState = new PrepareState<any>(context)
        .process(bootstrap_pages_state)
        .get()
      assert.ok(pagesState)

      const dialogsState = new PrepareState<any>(context)
        .process(bootstrap_dialogs_state)
        .get()
      assert.ok(dialogsState)
    })
  })
})
