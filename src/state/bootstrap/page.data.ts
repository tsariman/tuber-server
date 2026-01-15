import { TObj } from '../../common.types'
import { IStateContext, TBootstrapState } from '../_state.common.types'
import Config from '../../config'
import dev_get_pages_data_state from '../../dev/dev.pages.data.state'
import { $40_STATE_KEY } from '@tuber/shared'

const bootstrap_pages_data_state: TBootstrapState<Promise<TObj<TObj>>> = {

  DEFAULT: async (context: IStateContext): Promise<TObj<TObj>> => {
    const { usr } = context;
    const inDev = Config.DEV && usr?.role === 'developer';
    const pagesData: TObj<TObj> = {

      'bookmarks': {
        'playerOpen': false,
        'showThumbnail': true,
        'bookmarkToPlay': undefined
      },
      [$40_STATE_KEY]: {
        'searchMode': 'public',
        'icon': 'public_outline',
        'placeholder': 'Search public bookmarks…'
      },

      ...(inDev ? await dev_get_pages_data_state() : {})
    };

    return pagesData;
  }

  // TODO - Insert more page data states here.
};

export { bootstrap_pages_data_state };