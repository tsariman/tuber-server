import { clone_with_descriptors, t } from '../../business.logic'
import type { TStateForm } from '@tuber/shared'
import { register } from '../../business.logic/registry'
import STATE_KEY from '../../business.logic/state.key'

const $1 = STATE_KEY['1']

register('state', '1', $1)
/** Form to insert a new video URL. @id 1 */
export const newVideoUrlFormState: TStateForm = {
  '_id': '1',
  '_key': $1,
  'items': [
    {
      'type': 'stack',
      'props': {
        'spacing': 2,
        'sx': {
          'width': '100%'
        }
      },
      'items': [
        {
          'type': 'html',
          'props': {
            'sx': { 'textAlign': 'center' }
          },
          'has': {
            'content': `
              <img
                src="../img/tutorial-pasteinurl.gif"
                style="width: 100%"
                alt="Example that demonstrate how to copy a URL."
              />
            `
          }
        },
        {
          'type': 'text',
          'name': 'url',
          get 'label'() { return t('250', 'Paste shared video link Here ...') },
          'props': { 'fullWidth': true },
          'inputProps': {
            'end': {
              'icon': {
                'type': 'icon',
                'has': {
                  'icon': 'arrow_forward_ios_outline',
                  'onclickHandler': `tuberCallbacks.$1_C_1`,
                }
              }
            }
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('251', 'You forgot the URL of the video') }
          }
        },
      ],
      'eventPropagationEnabled': true,
      'has': {
        'onkeydownHandler': `tuberCallbacks.$1_C_2`
      }
    }
  ]
}

export default newVideoUrlFormState

export const $1DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(newVideoUrlFormState)
  return base
})()
