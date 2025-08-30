import { clone_with_descriptors, t } from '../../business.logic';
import { TStateForm, TStateFormItem } from '../../shared';
import { register } from '../../business.logic/registry';
import { $1_STATE_KEY } from '../../constants.server';

register('state', '1', $1_STATE_KEY);
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
          get 'label'() { return t('250', 'Paste Video URL Here ...'); },
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
            get 'requiredMessage'() { return t('251', 'You forgot the URL of the video'); }
          }
        },
      ] as TStateFormItem[]
    }
  ]
};

export default newVideoUrlFormState;

export const $1DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(newVideoUrlFormState);
  return base;
})();
