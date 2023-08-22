import IStateAppBar from '../../../../tuber-client/src/controllers/interfaces/IStateAppBar'

/** Default app bar json. */
const appBar: IStateAppBar = {
  'appBarStyle': 'mini',
  'props': {
    'elevation': 0,
    'color': 'primary',
  },
  'menuItemsSx': {
    'textTransform': 'none'
  }
}

export default appBar
