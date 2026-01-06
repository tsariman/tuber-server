import { TBootstrapState } from '../../state/_state.common.types'
import * as C from '@tuber/shared'
import { register } from '../../business.logic/registry'
import { clone_with_descriptors } from '../../business.logic'
import * as ITEM from '../dev.form.item.state'
import { devFormItemSeparator as __vertical_separator__ } from '../dev.form.item.state'
import { devHorizontalSeparator as __horizontal_separator__ } from '../dev.form.item.state'
import devFormTestClipboardState from './dev.test.clipboard.form.state'

register('state', '47', C.$47_STATE_KEY)
/** Development shortcuts form. @id 47 */
const devInstallFormState: C.TStateForm = {
  '_type': 'box',
  '_id': '47',
  '_key': C.$47_STATE_KEY,
  'props': { 'p': 2, 'mt': 10 },
  'paperBackground': true,
  'paperProps': {
    'elevation': 0,
    'sx': { 'backgroundColor': C.THEME_LIGHT_PAPER_COLOR }
  },
  'items': [
    {
      'type': 'html',
      'props': { 'sx': { 'textAlign': 'center' } },
      'has': {
        'content': '<h2>Development Shortcuts</h2>'
      }
    },
    {
      'type': 'html',
      'has': {
        'content': `
          <p>
            <em>Use these shortcuts to quickly test the application.</em>
            <em>These shortcuts are not available in production.</em>
          </p>
          <h3>Collections</h3>
          <p>
            &#128172;<span style="color:#0074d8"><b>Bookmarks</b></span> <em>({{ bookmarkCount }})</em>
            <br />
            &#128526;<span style="color:#0074d8"><b>Users</b></span> <em>({{ userCount }})</em>
          </p>
        `,
        'key': C.$47_STATE_KEY
      }
    },
    ITEM.devCreateDevUserStateButton,
    // __vertical_separator__,
    // ITEM.devResetDatabaseStateButton,
    __vertical_separator__,
    ITEM.devTestDrawerStateButton,
    __vertical_separator__,
    ITEM.devRemoveDrawerStateButton,
    __vertical_separator__,
    ITEM.devLinkTestAddNewBookmarkState,
    __horizontal_separator__,
    devFormTestClipboardState,
    // __horizontal_separator__,
    // ITEM.devCreateNewUserLinkState,
    // __vertical_separator__,
    // ITEM.devPopulateUserCollection,
    __vertical_separator__,
    ITEM.devGetBookmarkCollectionTest,
    __vertical_separator__,
    ITEM.devTestSpinner,
    __vertical_separator__,
    ITEM.devGetPlatformThumbnailTest,
    __vertical_separator__,
    ITEM.devSaveConfigValue,
    __vertical_separator__,
    ITEM.devEnterTwitchClientId,
    __vertical_separator__,
    ITEM.devRumbleRegexpTest,
    __vertical_separator__,
    ITEM.devUnknownRegexpTest,
    __vertical_separator__,
    ITEM.devFakePageTest,
    __vertical_separator__,
    {
      'type': 'stack',
      'props': {
        'direction': 'row',
        'spacing': 1
      },
      'items': [
        ITEM.devDropCollectionSelect,
        ITEM.devDropCollectionButton,
        __vertical_separator__,
        ITEM.devPopulateCollectionSelect,
        ITEM.devPopulationQuantity,
        ITEM.devPopulateCollectionButton,
        __vertical_separator__,
        ITEM.devCreateBookmarkSearchIndex,
      ]
    },
  ]
}

export default devInstallFormState

/** Dark theme version for the development shortcuts form. @id 47 */
export const $47DarkThemeMode = (() => {
  const base = clone_with_descriptors(devInstallFormState)
  const paperProps = {
    ...base.paperProps,
    'elevation': 0,
    'sx': {
      ...base.paperProps?.sx,
      'backgroundColor': C.THEME_DARK_PAPER_COLOR
    }
  } as typeof base.paperProps
  base.paperProps = paperProps
  return base
})()

export const dev_install_form_state = {

  [C.$47_STATE_KEY]: devInstallFormState,

  // TODO - Insert installation form states here.

} as TBootstrapState<C.TStateForm>

export const dev_install_form_state_dark = {

  [C.$47_STATE_KEY]: $47DarkThemeMode

  // TODO - Insert installation form states (dark themed) here.

} as TBootstrapState<C.TStateForm>