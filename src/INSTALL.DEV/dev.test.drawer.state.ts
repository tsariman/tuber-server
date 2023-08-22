import { IStatePageDrawer } from "../../../tuber-client/src/controllers/interfaces/IStateDrawer"

const devTestDrawer: IStatePageDrawer = {
  '_type': 'mini',
  'items': [
    {
      'type': 'text',
      'has': {
        'text': 'Hello world!'
      }
    }
  ],
}

export default devTestDrawer