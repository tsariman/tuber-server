import IStatePage from '../../../tuber-client/src/controllers/interfaces/IStatePage'

const devSignedInAppBar: IStatePage = {
  '_key': 'dev-signedin-appbar',
  'appBar': {
    'items': [
      {
        'has': {
          'text': 'Home',
          'route': '/'
        }
      },

      // Login chip
      {
        'has': {}
      }
    ]
  }
}

export default devSignedInAppBar