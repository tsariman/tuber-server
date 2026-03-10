import { clone_with_descriptors, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import * as C from '@tuber/shared'

register('state', '12', C.$12_STATE_KEY)
/** Form for creating a new Vimeo video bookmark @id 12 */
export const newVimeoBookmarkFormState = {
  '_id': '12',
  '_key': C.$12_STATE_KEY,
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
                get 'requiredMessage'() { return t('253', C.START_SECONDS_REQUIRED_MESSAGE) },
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
            get 'requiredMessage'() { return t('257', C.TITLE_REQUIRED_MESSAGE) },
            'maxLength': C.TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('258', C.TITLE_MAX_LENGTH_MESSAGE) },
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('259', 'Note') },
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('260', C.NOTE_MAX_LENGTH_MESSAGE) },
          }
        }
      ]
    },
  ]
} as C.TStateForm

export default newVimeoBookmarkFormState

export const $12DarkThemeMode: C.TStateForm = (() => {
  const base = clone_with_descriptors(newVimeoBookmarkFormState)
  return base
})()
