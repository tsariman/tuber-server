import Config from '../../config'
import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import IStateFormItem from '../../../../tuber-client/src/controllers/interfaces/IStateFormItem'
import { remove_form_suffix } from './_forms.business.logic'

const _1 = '1' // ID
const _1_KEY = 'newVideoUrlForm'
Config.register('state', _1, _1_KEY)

/** Form to insert a new video URL. @id 1 */
const newVideoUrlFormState: IStateForm = {
  '_id': _1,
  '_key': _1_KEY,
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
          'type': 'text',
          'name': 'url',
          'label': 'Paste Video URL Here ...',
          'props': {
            'fullWidth': true,
            'variant': 'filled',
          },
          'inputProps': {
            'end': {
              'icon': {
                'type': 'icon',
                'has': {
                  'icon': 'arrow_forward_ios_outline',
                  'onclickHandle': `tuberCallbacks._1_C_1`,
                }
              }
            }
          },
          'has': {
            'onkeydownHandle': `tuberCallbacks._1_C_2`,
          }
        },
      ] as IStateFormItem[]
    }
  ]
}

export const NEW_VIDEO_URL_FORM_UNSUFFIXED_NAME = remove_form_suffix(
  newVideoUrlFormState._key
)

export default newVideoUrlFormState