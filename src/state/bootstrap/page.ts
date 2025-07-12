import { TStateAllPages, TStateAppbar, TThemeMode } from 'src/common.types';
import { IStateContext, TBootstrapState } from '../_state.common.types';
import {
  $40_STATE_KEY,
  $44_STATE_KEY,
  $51_STATE_KEY,
  $70_STATE_KEY,
  THEME_MODE
} from 'src/constants';
import researchPageState, {
  $40DarkThemeMode,
  $70DarkThemeMode,
  listingPageState
} from '../page/research.page.state';
import Config from 'src/config';
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
      [$40_STATE_KEY]: {
        ...researchPageState,
        appbar: {
          ...researchPageAppbarState,
          items: [
            ...(inDev ? [
              researchAppErrorsViewLinkState,
              homeLinkState,
              ] : usr ? [
                bookmarkAddFromUrlLinkState,
              ] : []
            ),
            lightModeLinkState,
            usr ? powerLogoutLinkState : powerSignInLinkState,
          ]
        }
      },
      [$70_STATE_KEY]: {
          ...listingPageState,
          appbar: {
            ...researchPageAppbarState,
            items: [
              ...(inDev ? [
                researchAppErrorsViewLinkState,
                homeLinkState,
                ] : usr ? [
                  bookmarkAddFromUrlLinkState,
                ] : []
              ),
              lightModeLinkState,
              powerLogoutLinkState,
            ]
          }
        },
      [$51_STATE_KEY]: {
          ...chippedListingPageState,
          appbar: {
            ...listingPageAppbarState,
            items: [
              ...(inDev ? [
                researchAppErrorsViewLinkState,
                homeLinkState,
                ] : usr ? [
                  bookmarkAddFromUrlLinkState,
                ] : []
              ),
              lightModeLinkState,
              powerLogoutLinkState
            ]
          }
        }
    };

    if (inDev) {
      lightPages[$44_STATE_KEY] = {
        ...devInstallPageState,
        'appbar': {
          ...devInstallPageState,
          'items': [
            ...(devInstallPageState.appbar 
              && devInstallPageState.appbar.items
              || []
            ),
            powerLogoutLinkState,
          ]
        } as TStateAppbar,
      };
    }

    return lightPages;
  }

  // TODO - Insert more (light themed) page states here.
};

const bootstrap_pages_dark_state = {

  DEFAULT: (context: IStateContext): TStateAllPages => {
    const { usr } = context;
    const inDev = Config.DEV && !!usr && usr.role === 'developer';

    const darkPages: TStateAllPages = {
      [$40_STATE_KEY]: {
        ...$40DarkThemeMode,
        appbar: {
          ...$63DarkThemeMode,
          items: [
            ...(inDev ? [
              researchAppErrorsViewLinkState,
              homeLinkState,
              ] : usr ? [
                bookmarkAddFromUrlLinkState,
              ]: []
            ),
            darkModeLinkState,
            usr ? $66DarkThemeMode : $67DarkThemeMode,
          ]
        }
      },
      [$70_STATE_KEY]: {
        ...$70DarkThemeMode,
        appbar: {
          ...$63DarkThemeMode,
          items: [
            ...(inDev ? [
              researchAppErrorsViewLinkState,
              homeLinkState,
              ] : usr ? [
                bookmarkAddFromUrlLinkState,
              ]: []
            ),
            darkModeLinkState,
            $66DarkThemeMode
          ]
        }
      },
      [$51_STATE_KEY]: {
        ...$51DarkThemeMode,
        appbar: {
          ...$71DarkThemeMode,
          items: [
            ...(inDev ? [
              researchAppErrorsViewLinkState,
              homeLinkState,
              ] : usr ? [
                bookmarkAddFromUrlLinkState,
              ] : []
            ),
            darkModeLinkState,
            $66DarkThemeMode
          ]
        }
      }
    };

    if (inDev) {
      darkPages[$44_STATE_KEY] = {
        ...$44DarkThemeMode,
        'appbar': {
          ...$44DarkThemeMode,
          'items': [
            ...($44DarkThemeMode.appbar 
              && $44DarkThemeMode.appbar.items
              || []
            ),
            $66DarkThemeMode,
          ]
        } as TStateAppbar,
      };
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