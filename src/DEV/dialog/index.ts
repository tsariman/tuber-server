import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'

export const devUserAddDialogJson: IStateDialog = {
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