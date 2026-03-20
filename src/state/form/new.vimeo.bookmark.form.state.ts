import { clone_with_descriptors, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import {
  NOTE_FIELD_ROWS,
  NOTE_MAX_LENGTH,
  NOTE_MAX_LENGTH_MESSAGE,
  START_SECONDS_REQUIRED_MESSAGE,
  TITLE_MAX_LENGTH,
  TITLE_MAX_LENGTH_MESSAGE,
  TITLE_REQUIRED_MESSAGE,
  type TStateForm
} from '@tuber/shared'
import STATE_KEY from '../../business.logic/state.key'

const $12 = STATE_KEY['12']

register('state', '12', $12)
/** Form for creating a new Vimeo video bookmark @id 12 */
export const newVimeoBookmarkFormState = {
  '_id': '12',
  '_key': $12,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'stack',
          'props': {
            'direction': 'row',
            'spacing': 1
          },
          'items': [
            {
              'type': 'number',
              'name': 'start_seconds',
              get 'label'() { return t('252', 'Start') },
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('253', START_SECONDS_REQUIRED_MESSAGE) },
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              get 'label'() { return t('254', 'Video ID') },
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              get 'label'() { return t('255', 'Platform') },
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
          ]
        },
        {
          'type': 'textfield',
          'name': 'title',
          get 'label'() { return t('256', 'Title') },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('257', TITLE_REQUIRED_MESSAGE) },
            'maxLength': TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('258', TITLE_MAX_LENGTH_MESSAGE) },
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('259', 'Note') },
          'props': {
            'multiline': true,
            'rows': NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('260', NOTE_MAX_LENGTH_MESSAGE) },
          }
        }
      ]
    },
  ]
} as TStateForm

export default newVimeoBookmarkFormState

export const $12DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(newVimeoBookmarkFormState)
  return base
})()
