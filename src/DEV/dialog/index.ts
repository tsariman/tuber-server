import { TStateDialog } from '../../common.types'

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