import {
  $77_STATE_KEY,
  IHandlerDirective,
  TStateDialog
} from '@tuber/shared'
import { t } from '../business.logic'

/**
 * Message shown to users when they attempt to publish bookmarks without
 * sufficient access level.
 * @id 77
 * @deprecated This handler and the associated dialog are deprecated and will
 *             be removed in a future release. Please use the
 *             `get_bookmark_switch_publish_dummy` function instead to show
 *             the same message in a non-intrusive way without opening a
 *             dialog.
 */
export const get_77_onchange_handler_directive = () => ({
  'type': '$redux_actions',
  'actions': [{
    'type': 'dialog/dialogClose',
  },{
    'type': 'dialog/dialogOpenOrMount',
    'payload': {
      '_id': '77',
      '_key': $77_STATE_KEY,
      get 'title'() { return t('publishing_unavailable', 'Publishing Unavailable') },
      get 'content'() { return t('publishing_unavailable_description', 'To publish bookmarks, please upgrade your account to supporter or above.') },
      'actions': [{
        get 'label'() { return t('49', 'Close') },
        'has': {
          get 'text'() { return t('49', 'Close') },
          'onclickHandler': 'tuberCallbacks.defaultClose'
        }
      }],
      'open': true
    } as TStateDialog
  }]
} as IHandlerDirective)