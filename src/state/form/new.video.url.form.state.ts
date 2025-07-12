import { r } from 'src/business.logic';
import { TStateForm, TStateFormItem } from '../../common.types';
import Config from '../../config';
import { $1_STATE_KEY } from '../../constants';

Config.register('state', '1', $1_STATE_KEY);
/** Form to insert a new video URL. @id 1 */
const newVideoUrlFormState: TStateForm = {
  '_id': '1',
  '_key': $1_STATE_KEY,
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
          'label': r('250', 'Paste Video URL Here ...'),
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
            'requiredMessage': r('251', 'You forgot the URL of the video')
          }
        },
      ] as TStateFormItem[]
    }
  ]
};

export default newVideoUrlFormState;

export const $1DarkThemeMode = {
  ...newVideoUrlFormState,
  // TODO - add dark theme mode overrides here
} as TStateForm;
