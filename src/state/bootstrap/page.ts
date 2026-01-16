import { TThemeMode } from '../../common.types'
import { IStateContext, TBootstrapState } from '../_state.common.types'
import {
  TStateAllPages,
  $40_STATE_KEY,
  $44_STATE_KEY,
  $51_STATE_KEY,
  $70_STATE_KEY,
  $74_STATE_KEY,
  THEME_MODE
} from '@tuber/shared'
import {
  bs_listingPageState,
  bs_researchPageState,
} from '../page/research.page.state'
import { bs_chippedListingPageState } from '../page/listing.page.state'
import { bs_newUserPageState } from '../page/new.user.page.state'
import Config from '../../config'
import { PrepareState } from '../PrepareState'
import devInstallPageState, {
  $44DarkThemeMode
} from '../../dev/page/dev.install.page.state'
import { $66DarkThemeMode, powerLogoutLinkState } from '../nav.link'
import {
  clone_as_collection,
  clone_or_default,
  clone_with_descriptors
} from '../../business.logic'
import Access from '../../business.logic/security/Access'

const bootstrap_pages_state: TBootstrapState<TStateAllPages> = {

  DEFAULT: (context: IStateContext): TStateAllPages => {
    const themeMode = context.theme ?? Config.read<TThemeMode>(THEME_MODE, Config.DEFAULT_THEME_MODE)
    switch (themeMode) {
      case 'dark':
        return new PrepareState<TStateAllPages>(context)
                    .process(bootstrap_pages_dark_state)
                    .get()
      default:
      case 'light':
        return new PrepareState<TStateAllPages>(context)
                    .process(bootstrap_pages_light_state)
                    .get()
    }
  }

  // TODO - Insert more page states here.
}

const bootstrap_pages_light_state: TBootstrapState<TStateAllPages> = {

  DEFAULT: (context: IStateContext): TStateAllPages => {
    const { usr } = context

    const lightPages: TStateAllPages = {
      [$40_STATE_KEY]: bs_researchPageState(context).light,
      [$70_STATE_KEY]: bs_listingPageState(context).light,
      [$51_STATE_KEY]: bs_chippedListingPageState(context).light,
    }

    // Pages that's only available when the user is not authenticated.
    if (!usr) {
      lightPages[$74_STATE_KEY] = bs_newUserPageState(context).light
    }

    if (Access.the(usr).can('dev_install_page.view')) {
      lightPages[$44_STATE_KEY] = (() => {
        const base = clone_with_descriptors(devInstallPageState)
        const appbar = clone_or_default(base.appbar, {})
        const link = clone_as_collection(appbar.items)
        link.add(powerLogoutLinkState)
        appbar.items = link.items
        base.appbar = appbar
        return base
      })()
    }

    return lightPages
  }

  // TODO - Insert more (light themed) page states here.
}

const bootstrap_pages_dark_state = {

  DEFAULT: (context: IStateContext): TStateAllPages => {
    const { usr } = context

    const darkPages: TStateAllPages = {
      [$40_STATE_KEY]: bs_researchPageState(context).dark,
      [$70_STATE_KEY]: bs_listingPageState(context).dark,
      [$51_STATE_KEY]: bs_chippedListingPageState(context).dark,
    }

    // Pages that's only available when the user is not authenticated.
    if (!usr) {
      darkPages[$74_STATE_KEY] = bs_newUserPageState(context).dark
    }

    if (Access.the(usr).can('dev_install_page.view')) {
      darkPages[$44_STATE_KEY] = (() => {
        const base = clone_with_descriptors($44DarkThemeMode)
        const appbar = clone_or_default(base.appbar, {})
        const link = clone_as_collection(appbar.items)
        link.add($66DarkThemeMode)
        appbar.items = link.items
        base.appbar = appbar
        return base
      })()
    }

    return darkPages
  }

  // TODO - Insert more (dark themed) page states here.
}

export {
  bootstrap_pages_state,
  bootstrap_pages_light_state,
  bootstrap_pages_dark_state
}