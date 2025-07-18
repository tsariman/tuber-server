import { TObj } from 'src/common.types';
import { IStateContext, TBootstrapState } from '../_state.common.types';
import Config from 'src/config';
import dev_get_pages_data_state from 'src/DEV/dev.pages.data.state';

const bootstrap_pages_data_state: TBootstrapState<TObj> = {

  DEFAULT: async (context: IStateContext): Promise<TObj> => {
    const { usr } = context;
    const inDev = Config.DEV && !!usr && usr.role === 'developer';
    const pagesData: TObj = {

      'bookmarks': {
        'playerOpen': false,
        'showThumbnail': true,
        'bookmarkToPlay': undefined
      },

      ...(inDev ? await dev_get_pages_data_state() : {})
    };

    return pagesData;
  }

  // TODO - Insert more page data states here.
};

export { bootstrap_pages_data_state };