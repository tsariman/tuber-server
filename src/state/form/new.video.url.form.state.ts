import Config from '../../config'
import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import IStateFormItem from '../../../../tuber-client/src/controllers/interfaces/IStateFormItem'
import { remove_form_suffix } from './_forms.business.logic'
import { $1_KEY } from '../../constants'

Config.register('state', '1', $1_KEY)
/** Form to insert a new video URL. @id 1 */
const newVideoUrlFormState: IStateForm = {
  '_id': '1',
  '_key': $1_KEY,
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
          'label': 'Paste Video URL Here ...',
          'props': { 'fullWidth': true },
          'inputProps': {
            'end': {
              'icon': {
                'type': 'icon',
                'has': {
                  'icon': 'arrow_forward_ios_outline',
                  'onclickHandle': `tuberCallbacks.$1_C_1`,
                }
              }
            }
          },
          'has': {
            'onkeydownHandle': `tuberCallbacks.$1_C_2`,
            'required': true,
            'requiredMessage': 'You forgot the URL of the video'
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