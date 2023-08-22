import IStatePage from '../../../../tuber-client/src/controllers/interfaces/IStatePage'

const devInstallPage: IStatePage = {
  'content': '$form:devInstall:dev-install',
  'layout': 'layout_default',
  'appBar': {
    'items': [
      {
        'has': {
          'text': 'Research',
          'route': 'research-app'
        }
      },
      {
        'has': {
          'text': 'Client errors',
          'route': 'default-errors-view'
        }
      },
      {
        'has': {
          'text': 'Help',
          'route': 'help-dev-install'
        },
      },
      {
        'has': {
          'text': 'Login',
          'route': 'login'
        }
      },
    ],
  },
}

export default devInstallPage