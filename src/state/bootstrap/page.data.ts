import { TObj } from '../../common.types'
import { IStateContext, TBootstrapState } from '../_state.common.types'
import Config from '../../config'
import Access from '../../business.logic/security/Access'
import dev_get_pages_data_state from '../../dev/dev.pages.data.state'
import STATE_KEY from '../../business.logic/state.key'

const $40 = STATE_KEY['40']

const bootstrap_pages_data_state: TBootstrapState<Promise<TObj<TObj>>> = {

  DEFAULT: async (context: IStateContext): Promise<TObj<TObj>> => {
    const { usr } = context
    const inDev = Config.DEV && Access.the(usr).can('dev_install_page.view')
    const pagesData: TObj<TObj> = {

      'bookmarks': {
        'playerOpen': false,
        'showThumbnail': true,
        'bookmarkToPlay': undefined
      },
      [$40]: usr ? {
        'searchMode': 'private',
        'icon': 'lock',
        'placeholder': 'Search your bookmarks…'
      } : {
        'searchMode': 'public',
        'icon': 'public_outline',
        'placeholder': 'Search public bookmarks…'
      },

      ...(inDev ? await dev_get_pages_data_state() : {})
    }

    return pagesData
  }

  // TODO - Insert more page data states here.
}

export { bootstrap_pages_data_state }