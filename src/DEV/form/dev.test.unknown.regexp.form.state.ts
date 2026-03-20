import { register } from '../../business.logic/registry'
import STATE_KEY from '../../business.logic/state.key'
import {
  type TStateForm,
  THEME_DARK_PAPER_COLOR,
  THEME_LIGHT_PAPER_COLOR
} from '@tuber/shared'
import { TBootstrapState } from '../../state/_state.common.types'
import { clone_with_descriptors } from '../../business.logic'

const $57 = STATE_KEY['57']
const $58 = STATE_KEY['58']

register('state', '57', $57)

/**
 * Form to test the regexp to grab the thumbnail url from
 * the html page source of an unknown platform.
 *
 * @id 57
 */
const devTestUnknownRegexpFormState = {
  '_id': '57',
  '_key': $57,
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
        'defaultValue': '"thumbnailUrl".+?"(.+?)"'
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
        'onclickHandler': 'tuberCallbacks.$57_C_1',
      }
    },
    {
      'type': 'html',
      'props': {
        'sx': { 'textAlign': 'center' },
      },
      'has': {
        'content': 'Result: <span id="result"></span>'
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
    {
      'type': 'html',
      'props': {
        'sx': { 'textAlign': 'center' }
      },
      'has': {
        'content': `
          <img
            src="{{ thumbnailUrl }}"
            style="width: 100%"
            alt="Supposed to load thumbnail of video URL."
          />
        `,
        'key': $58
      }
    }
  ]
} as TStateForm

export default devTestUnknownRegexpFormState

/**
 * Dark theme mode for state form to test acquiring thumbnail url from html
 * source.
 * @id 57
 */
export const $57DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(devTestUnknownRegexpFormState)
  const paperProps = clone_with_descriptors(base.paperProps ?? {})
  paperProps.sx = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_PAPER_COLOR
  }
  base.paperProps = paperProps
  return base
})()

export const dev_test_unknown_regexp_form_state = {

  [$57]: devTestUnknownRegexpFormState,

  // TODO - Insert more form states here.

} as TBootstrapState<TStateForm>


export const dev_test_unknown_regexp_form_state_dark = {

  [$57]: $57DarkThemeMode,

  // TODO - Insert more (dark themed) form states here.

} as TBootstrapState<TStateForm>