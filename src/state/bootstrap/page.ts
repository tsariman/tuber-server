import { TStateAllPages } from '../../shared';
import { TThemeMode } from '../../common.types';
import { IStateContext, TBootstrapState } from '../_state.common.types';
import {
  $40_STATE_KEY,
  $44_STATE_KEY,
  $51_STATE_KEY,
  $70_STATE_KEY,
  THEME_MODE
} from 'src/constants.server';
import researchPageState, {
  $40DarkThemeMode,
  $70DarkThemeMode,
  listingPageState
} from '../page/research.page.state';
import Config from '../../config';
import { PrepareState } from '../PrepareState';
import chippedListingPageState, {
  $51DarkThemeMode
} from '../page/listing.page.state';
import devInstallPageState, {
  $44DarkThemeMode
} from 'src/DEV/page/dev.install.page.state';
import {
  $66DarkThemeMode,
  $67DarkThemeMode,
  bookmarkAddFromUrlLinkState,
  darkModeLinkState,
  homeLinkState,
  lightModeLinkState,
  powerLogoutLinkState,
  powerSignInLinkState,
  researchAppErrorsViewLinkState
} from '../nav.link';
import researchPageAppbarState, {
  $63DarkThemeMode,
  $71DarkThemeMode,
  listingPageAppbarState
} from '../appbar';
import {
  clone_empty,
  clone_or_default,
  clone_with_descriptors
} from 'src/business.logic';

const bootstrap_pages_state: TBootstrapState<TStateAllPages> = {

  DEFAULT: (context: IStateContext): TStateAllPages => {
    const mode = context.theme ?? Config.read<TThemeMode>(THEME_MODE, Config.DEFAULT_THEME_MODE);
    switch (mode) {
      case 'dark':
        return new PrepareState<TStateAllPages>(context)
                    .process(bootstrap_pages_dark_state)
                    .get();
      default:
      case 'light':
        return new PrepareState<TStateAllPages>(context)
                    .process(bootstrap_pages_light_state)
                    .get();
    }
  }

  // TODO - Insert more page states here.
};

const bootstrap_pages_light_state: TBootstrapState<TStateAllPages> = {

  DEFAULT: (context: IStateContext): TStateAllPages => {
    const { usr } = context;
    const inDev = Config.DEV && !!usr && usr.role === 'developer';

    const lightPages: TStateAllPages = {
      [$40_STATE_KEY]: (() => {
        const base = clone_with_descriptors(researchPageState);
        const appbar = clone_with_descriptors(researchPageAppbarState);
        const items = clone_empty(appbar.items);
        if (inDev) {
          items.push(researchAppErrorsViewLinkState);
          items.push(homeLinkState);
        } else if (usr) {
          items.push(bookmarkAddFromUrlLinkState);
        }
        items.push(lightModeLinkState);
        items.push(usr ? powerLogoutLinkState : powerSignInLinkState);
        appbar.items = items;
        base.appbar = appbar;
        return base;
      })(),
      [$70_STATE_KEY]: (() => {
        const base = clone_with_descriptors(listingPageState);
        const appbar = clone_with_descriptors(researchPageAppbarState);
        const items = clone_or_default(appbar.items, []);
        if (inDev) {
          items.push(researchAppErrorsViewLinkState);
          items.push(homeLinkState);
        } else if (usr) {
          items.push(bookmarkAddFromUrlLinkState);
        }
        items.push(lightModeLinkState);
        items.push(powerLogoutLinkState);
        appbar.items = items;
        base.appbar = appbar;
        return base;
      })(),
      [$51_STATE_KEY]: (() => {
        const base = clone_with_descriptors(chippedListingPageState);
        const appbar = clone_with_descriptors(listingPageAppbarState);
        const items = clone_or_default(appbar.items, []);
        if (inDev) {
          items.push(researchAppErrorsViewLinkState);
          items.push(homeLinkState);
        } else if (usr) {
          items.push(bookmarkAddFromUrlLinkState);
        }
        items.push(lightModeLinkState);
        items.push(powerLogoutLinkState);
        appbar.items = items;
        base.appbar = appbar;
        return base;
      })(),
    };

    if (inDev) {
      lightPages[$44_STATE_KEY] = (() => {
        const base = clone_with_descriptors(devInstallPageState);
        const appbar = clone_or_default(base.appbar, {});
        const items = clone_or_default(appbar.items, []);
        items.push(powerLogoutLinkState);
        appbar.items = items;
        base.appbar = appbar;
        return base;
      })();
    }

    return lightPages;
  }

  // TODO - Insert more (light themed) page states here.
};

const bootstrap_pages_dark_state = {

  DEFAULT: (context: IStateContext): TStateAllPages => {
    const { usr } = context;
    const inDev = Config.DEV && usr?.role === 'developer';

    const darkPages: TStateAllPages = {
      [$40_STATE_KEY]: (() => {
        const base = clone_with_descriptors($40DarkThemeMode);
        const appbar = clone_with_descriptors($63DarkThemeMode);
        const items = clone_empty(appbar.items);
        if (inDev) {
          items.push(researchAppErrorsViewLinkState);
          items.push(homeLinkState);
        } else if (usr) {
          items.push(bookmarkAddFromUrlLinkState);
        }
        items.push(darkModeLinkState);
        items.push(usr ? $66DarkThemeMode : $67DarkThemeMode);
        appbar.items = items;
        base.appbar = appbar;
        return base;
      })(),
      [$70_STATE_KEY]: (() => {
        const base = clone_with_descriptors($70DarkThemeMode);
        const appbar = clone_with_descriptors($63DarkThemeMode);
        const items = clone_with_descriptors(appbar.items ?? []);
        if (inDev) {
          items.push(researchAppErrorsViewLinkState);
          items.push(homeLinkState);
        } else if (usr) {
          items.push(bookmarkAddFromUrlLinkState);
        }
        items.push(darkModeLinkState);
        items.push($66DarkThemeMode);
        appbar.items = items;
        base.appbar = appbar;
        return base;
      })(),
      [$51_STATE_KEY]: (() => {
        const base = clone_with_descriptors($51DarkThemeMode);
        const appbar = clone_with_descriptors($71DarkThemeMode);
        const items = clone_with_descriptors(appbar.items ?? []);
        if (inDev) {
          items.push(researchAppErrorsViewLinkState);
          items.push(homeLinkState);
        } else if (usr) {
          items.push(bookmarkAddFromUrlLinkState);
        }
        items.push(darkModeLinkState);
        items.push($66DarkThemeMode);
        appbar.items = items;
        base.appbar = appbar;
        return base;
      })(),
    };

    if (inDev) {
      darkPages[$44_STATE_KEY] = (() => {
        const base = clone_with_descriptors($44DarkThemeMode);
        const appbar = clone_or_default(base.appbar, {});
        const items = clone_or_default(appbar.items, []);
        items.push($66DarkThemeMode);
        appbar.items = items;
        base.appbar = appbar;
        return base;
      })();
    }

    return darkPages;
  }

  // TODO - Insert more (dark themed) page states here.
};

export {
  bootstrap_pages_state,
  bootstrap_pages_light_state,
  bootstrap_pages_dark_state
};