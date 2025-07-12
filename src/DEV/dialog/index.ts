import { TBootstrapState } from 'src/state/_state.common.types';
import { TStateDialog } from '../../common.types';

/** @deprecated */
export const devUserAddDialogJson: TStateDialog = {
  '_type': 'form',
  '_key': 'devUserAddDialog',
  'title': 'Create New User',
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': '$form : devUserAdd : users',
  'open': true
}

const dev_dialog_state = {

  'devUserAddDialog': {
    '_type': 'form',
    '_key': 'devUserAddDialog',
    'title': 'Create New User',
    'props': {
      'fullWidth': true,
      'maxWidth': 'md',
    },
    'titleProps': {
      'sx': { 'textAlign': 'center' }
    },
    'content': '$form : devUserAdd : users',
    'open': true
  }

  // TODO - Insert dialog states here

} as TBootstrapState<TStateDialog>;

export default dev_dialog_state;