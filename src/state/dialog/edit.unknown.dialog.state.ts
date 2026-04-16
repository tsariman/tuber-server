import {
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
  TStateDialog
} from '@tuber/shared'
import {
  t,
  remove_form_suffix,
  clone_with_descriptors
} from '../../business.logic'
import { register } from '../../business.logic/registry'
import { THEME_LIGHT_PAPER_SX_PROPS } from '../theme.state'
import AbstractState from '../AbstractState'
import { TContextualUser } from '../../schema/user'
import Access from '../../business.logic/security/Access'
import STATE_KEY from '../../business.logic/state.key'

const $29 = STATE_KEY['29']
const $31 = STATE_KEY['31']

register('state', '31', $31)
/** Dialog to edit an unknown video platform bookmark @id 31 */
export class EditUnknownBookmarkDialogState extends AbstractState<TStateDialog> {
  constructor(usr?: TContextualUser) { super(usr) }
  static withContext(usr?: TContextualUser) {
    const instance = new EditUnknownBookmarkDialogState(usr)
    return instance
  }
  /** Get the light theme mode dialog state for editing an unknown bookmark, contextualized to the user. */
  get light(): TStateDialog {
    const state: TStateDialog = {
      '_type': 'form',
      '_id': '31',
      '_key': $31,
      get 'title'() { return t('24', 'Edit Unknown Bookmark') },
      'props': {
        'fullWidth': true,
        'maxWidth': 'md',
        'PaperProps': {
          'sx': {
            ...THEME_LIGHT_PAPER_SX_PROPS,
            'overflowX': 'hidden !important'
          }
        }
      },
      'titleProps': {
        'sx': { 'textAlign': 'center' }
      },
      'content': `$form : ${remove_form_suffix($29)} : bookmarks`,
      'actions': [
        {
          'type': 'state_button',
          'props': { 'color': 'secondary' },
          'has': {
            get 'text'() { return t('25', 'Cancel') },
            'onclickHandler': 'tuberCallbacks.defaultClose'
          }
        },
        {
          'type': 'state_button',
          'props': { 'color': 'primary' },
          'has': {
            'disableOnError': true,
            get 'text'() { return t('26', 'Save') },
            'onclickHandler': 'tuberCallbacks.$31_C_1'
          }
        }
      ],
      'open': true
    }
    if (Access.the(this.usr).can('publish.unknown.bookmark')) {
      state.actions?.unshift({
        'type': 'switch_single',
        'name': 'is_published',
        'label': t('27', 'Published'),
        'has': {
          'formControlLabelProps': {
            'sx': { 'flex': 1, 'ml': 1 }
          }
        }
      })
    }
    return state
  }
  /** Get the dark theme mode dialog state for editing an unknown bookmark, contextualized to the user. */
  get dark(): TStateDialog {
    const base = clone_with_descriptors(this.light)
    const props = clone_with_descriptors(base.props ?? {})
    const paperProps = clone_with_descriptors(props.PaperProps ?? {})
    const sx: typeof paperProps['sx'] = {
      ...paperProps.sx,
      'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR
    }
    paperProps.sx = sx
    props.PaperProps = paperProps
    base.props = props
    return base
  }
}

/** Dialog to edit an unknown video platform bookmark @id 31 @deprecated */
const editUnknownBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '31',
  '_key': $31,
  get 'title'() { return t('24', 'Edit Unknown Bookmark') },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': {
      'sx': {
        ...THEME_LIGHT_PAPER_SX_PROPS,
        'overflowX': 'hidden !important'
      }
    }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($29)} : bookmarks`,
  'actions': [
    {
      'type': 'switch_single',
      'name': 'is_published',
      'label': t('27', 'Published'),
      'has': {
        'formControlLabelProps': {
          'sx': { 'flex': 1, 'ml': 1 }
        }
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('25', 'Cancel') },
        'onclickHandler': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'disableOnError': true,
        get 'text'() { return t('26', 'Save') },
        'onclickHandler': 'tuberCallbacks.$31_C_1'
      }
    }
  ],
  'open': true
}

export default editUnknownBookmarkDialogState

/**
 * Dark theme mode for form state to edit an existing unknown video
 * bookmark.
 * @id 31
 * @deprecated Theming for dialog states is now handled within the state itself,
 * so this export is no longer necessary and will be removed in the near future.
 */
export const $31DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(editUnknownBookmarkDialogState)
  const props = clone_with_descriptors(base.props ?? {})
  const paperProps = clone_with_descriptors(props.PaperProps ?? {})
  const sx: typeof paperProps['sx'] = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR
  }
  paperProps.sx = sx
  props.PaperProps = paperProps
  base.props = props
  return base
})()
