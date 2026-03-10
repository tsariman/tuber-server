import { t } from '../business.logic'
import {
  TStateFormItem,
  $78_STATE_KEY,
  $79_STATE_KEY,
  PUBLISHED_HELPER_TEXT,
  PUBLISHED_UNAVAILABLE
} from '@tuber/shared'

export const dialogDefaultCloseButtonJson: TStateFormItem = {
  'type': 'state_button',
  'props': { 'color': 'secondary' },
  'has': {
    get 'text'() { return t('8', 'Cancel') },
    'onclickHandler': 'tuberCallbacks.defaultClose'
  }
}

/** Switch that controls the publish state of a bookmark @id 79 */
export const get_bookmark_switch_publish = () => ({
  '_id': '79',
  '_key': $79_STATE_KEY,
  'type': 'switch_single',
  'name': 'is_published',
  get 'label'() { return t('79', 'Published') },
  'has': {
    get 'helperText'() { return t('100', PUBLISHED_HELPER_TEXT) }
  }
} as TStateFormItem)

/**
 * A dummy switch item that mimics the appearance of the publish switch but
 * shows a dialog on change instead of updating the form state. Used for users
 * without sufficient access level.
 * @id 78
 */
export const get_bookmark_switch_publish_dummy = () => ({
  '_id': '78',
  '_key': $78_STATE_KEY,
  'type': 'switch_dummy',
  'name': 'is_published',
  get 'label'() { return t('79', 'Published') },
  'has': {
    get 'helperText'() { return t('279', PUBLISHED_UNAVAILABLE) },
    'formControlLabelProps': {
      'sx': { 'flex': 1, 'ml': 1 }
    }
  },
  // 'onchangeHandlerDirective': get_77_onchange_handler_directive()
} as TStateFormItem)