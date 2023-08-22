import IStatePage from '../../../tuber-client/src/controllers/interfaces/IStatePage'

const devSignedInAppBar: IStatePage = {
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