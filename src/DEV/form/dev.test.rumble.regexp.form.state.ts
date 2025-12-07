import { register } from '../../business.logic/registry'
import {
  TStateForm,
  $54_STATE_KEY,
  THEME_DARK_PAPER_COLOR,
  THEME_LIGHT_PAPER_COLOR
} from '@tuber/shared'
import { TBootstrapState } from '../../state/_state.common.types'
import { clone_with_descriptors } from '../../business.logic'

register('state', '54', $54_STATE_KEY)
/**
 * Form to test the regexp to grab both the video id and the thumbnail url from
 * the rumble video index.html page.
 *
 * @id 54
 */
const devTestRumbleRegexpFormState = {
  '_id': '54',
  '_key': $54_STATE_KEY,
  '_type': 'stack',
  'props': {
    'sx': { 'p': 2, 'width': 476 },
    'spacing': 2,
  },
  'paperBackground': true,
  'paperProps': {
    'elevation': 0,
    'sx': { 'backgroundColor': THEME_LIGHT_PAPER_COLOR }
  },
  'items': [
    {
      'type': 'text',
      'name': 'url',
      'label': 'URL',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      }
    },
    {
      'type': 'text',
      'name': 'regexp',
      'label': 'Regular expression',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      },
      'has': {
        'defaultValue': '"video":"(.*?)"|<meta property=og:image content=(.+?)>'
      }
    },
    {
      'type': 'state_button',
      'props': {
        'variant': 'contained',
        'color': 'primary',
      },
      'has': {
        'label': 'Test',
        'onclickHandler': 'tuberCallbacks.$54_C_1',
      }
    },
    {
      'type': 'html',
      'props': {
        'sx': { 'textAlign': 'center' },
      },
      'has': {
        'content': '<h3>Results</h3>'
      }
    },
    {
      'type': 'text',
      'name': 'videoid',
      'label': 'Video ID',
      'props': {
        'fullWidth': true,
        'variant': 'filled'
      },
      'inputProps': {
        'readOnly': true
      }
    },
    {
      'type': 'text',
      'name': 'thumbnail_url',
      'label': 'Thumbnail URL',
      'props': {
        'fullWidth': true,
        'variant': 'filled'
      },
      'inputProps': {
        'readOnly': true
      }
    },
  ]
} as TStateForm

export default devTestRumbleRegexpFormState

/** Dark theme version for the rumble regexp test form. @id 54 */
export const $54DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(devTestRumbleRegexpFormState)
  const paperProps = clone_with_descriptors(base.paperProps ?? {})
  paperProps.sx = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_PAPER_COLOR
  }
  base.paperProps = paperProps
  return base
})()

export const dev_test_rumble_regexp_form_state = {

  [$54_STATE_KEY]: devTestRumbleRegexpFormState,

  // TODO - Insert more form states here.

} as TBootstrapState<TStateForm>

export const dev_test_rumble_regexp_form_state_dark = {

  [$54_STATE_KEY]: $54DarkThemeMode,

  // TODO - Insert more (dark themed) form states here.

} as TBootstrapState<TStateForm>
