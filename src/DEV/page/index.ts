import { remove_form_suffix } from 'src/state/form/_forms.business.logic'
import IStatePage from '../../../../tuber-client/src/controllers/interfaces/IStatePage'
import Config from '../../config'
import { $44_KEY, $45_KEY, $46_KEY } from '../../constants'

Config.register('state', '46', $46_KEY)
const devTestThumbnailPageState: IStatePage = {
  '_id': '46',
  '_key': $46_KEY,
  'appBar': {
    'items': [
      {
        'has': {
          'text': 'Client errors',
          'route': 'default-errors-view'
        }
      },
      {
        'has': {
          'text': 'Back',
          'route': $44_KEY
        }
      }
    ],
    'toolbarProps': {
      'variant': 'dense'
    }
  },
  'content': `$form : ${remove_form_suffix($45_KEY)}`,
  'layout': 'layout_centered_no_scroll'
}

export default devTestThumbnailPageState