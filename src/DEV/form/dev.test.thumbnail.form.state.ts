import { TBootstrapState } from '../../state/_state.common.types'
import { register } from '../../business.logic/registry'
import STATE_KEY from '../../business.logic/state.key'
import {
  type TStateForm,
  THEME_DARK_PAPER_COLOR,
  THEME_LIGHT_PAPER_COLOR
} from '@tuber/shared'
import { clone_with_descriptors } from '../../business.logic'

const $45 = STATE_KEY['45']
const $46 = STATE_KEY['46']

register('state', '45', $45)
/** @id 45 */
const devTestThumbnailFormState: TStateForm = {
  '_type': 'box',
  '_id': '45',
  '_key': $45,
  'props': {
    'sx': { 'p': 2, 'width': 476 },
  },
  'paperBackground': true,
  'paperProps': {
    'elevation': 0,
    'sx': { 'backgroundColor': THEME_LIGHT_PAPER_COLOR }
  },
  'items': [
    {
      'type': 'text',
      'name': 'video_url',
      'label': 'Paste Video URL Here ...',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      }
    },
    {
      'type': 'state_button',
      'props': {
        'sx': { 'width': '100%' }
      },
      'has': {
        'label': 'Get Thumbnail',
        'onclickHandler': 'tuberCallbacks.$45_C_1'
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
        'key': $46
      }
    }
  ]
}

export default devTestThumbnailFormState

/** @id 45 */
export const $45DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(devTestThumbnailFormState)
  const paperProps = clone_with_descriptors(base.paperProps ?? {})
  paperProps.sx = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_PAPER_COLOR
  }
  base.paperProps = paperProps
  return base
})()

export const dev_test_thumbnail_form_state = {

  [$45]: devTestThumbnailFormState,

  // TODO - Insert more form states here.

} as TBootstrapState<TStateForm>

export const dev_test_thumbnail_form_state_dark = {

  [$45]: $45DarkThemeMode,

  // TODO - Insert more form states (dark themed) here.

} as TBootstrapState<TStateForm>
