import { $77_STATE_KEY, IHandlerDirective, TStateDialog } from '@tuber/shared'
import { t } from '../../business.logic'

/**
 * Message shown to users when they attempt to publish bookmarks without
 * sufficient access level.
 * @id 77
 */
export const $77OnchangeHandlerDirective: IHandlerDirective = {
  'type': '$redux_actions',
  'actions': [{
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
}