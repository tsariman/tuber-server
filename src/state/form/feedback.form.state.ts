import { SxProps } from '@mui/material'
import { type TStateForm } from '@tuber/shared'
import { register } from '../../business.logic/registry'
import { clone_with_descriptors, t } from '../../business.logic'
import STATE_KEY from '../../business.logic/state.key'

const $88 = STATE_KEY['88']

register('state', '88', $88)
/** Form state for feedback submissions. @id 88 */
export const feedbackFormState: TStateForm = {
  '_type': 'box',
  '_id': '88',
  '_key': $88,
  'props': {
    'sx': {
      'p': 2,
      'width': '100%'
    } as SxProps,
  },
  'paperBackground': true,
  'paperProps': { 'elevation': 0 },
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'state_select',
          'name': 'category',
          get 'label'() { return t('feedback_type', 'Type') },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('feedback_type_required', 'Please choose a feedback type') },
            'defaultValue': 'Bug Report',
            'items': [
              { 'value': 'Bug Report', 'label': 'Bug Report' },
              { 'value': 'Suggestion', 'label': 'Suggestion' }
            ]
          }
        },
        {
          'type': 'textarea',
          'name': 'details',
          get 'label'() { return t('feedback_details', 'Details') },
          'props': {
            'multiline': true,
            'rows': 5,
            'placeholder': 'Tell us what happened or what you would like improved...'
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('feedback_details_required', 'Please provide details') }
          }
        },
        {
          'type': 'textfield',
          'name': 'serialized_state',
          'props': {
            'sx': { 'display': 'none' }
          },
          'inputProps': {
            'readOnly': true
          },
          'has': {
            'defaultValue': '{}'
          }
        },
        {
          'type': 'submit',
          'props': { 'type': 'submit' },
          'has': {
            'icon': 'send',
            'iconPosition': 'right',
            get 'title'() { return t('feedback_submit', 'Submit') },
            'onclickHandler': 'tuberCallbacks.$87_C_1'
          }
        }
      ]
    }
  ]
}

export default feedbackFormState

/** Dark theme mode for feedback form state. @id 88 */
export const $88DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(feedbackFormState)
  return base
})()
