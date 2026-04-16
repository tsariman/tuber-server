import { IStateContext, TBootstrapState } from '../_state.common.types'
import { TStateAllPages } from '@tuber/shared'
import {
  bs_listingPageState,
  bs_researchPageState,
} from '../page/research.page.state'
import { bs_chippedListingPageState } from '../page/listing.page.state'
import { bs_newUserPageState } from '../page/new.user.page.state'
import { bs_resetPasswordPageState } from '../page/password.reset.page.state'
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
import Config from '../../config'
import Access from '../../business.logic/security/Access'
import STATE_KEY from '../../business.logic/state.key'

const $40 = STATE_KEY['40']
const $44 = STATE_KEY['44']
const $51 = STATE_KEY['51']
const $70 = STATE_KEY['70']
const $74 = STATE_KEY['74']
const $90 = STATE_KEY['90']

const bootstrap_pages_state: TBootstrapState<TStateAllPages> = {

  DEFAULT: (context: IStateContext): TStateAllPages => {
    const { theme: themeMode } = context
    if (!themeMode) {
      throw new Error('State bootstrap requires context.theme.')
    }

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
      [$40]: bs_researchPageState(context).light,
      [$70]: bs_listingPageState(context).light,
      [$51]: bs_chippedListingPageState(context).light,
    }

    // Pages that's only available when the user is not authenticated.
    if (!usr) {
      lightPages[$74] = bs_newUserPageState(context).light
      lightPages[$90] = bs_resetPasswordPageState(context).light
    }

    if (Config.DEV && Access.the(usr).can('dev_install_page.view')) {
      lightPages[$44] = (() => {
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

const bootstrap_pages_dark_state: TBootstrapState<TStateAllPages> = {

  DEFAULT: (context: IStateContext): TStateAllPages => {
    const { usr } = context

    const darkPages: TStateAllPages = {
      [$40]: bs_researchPageState(context).dark,
      [$70]: bs_listingPageState(context).dark,
      [$51]: bs_chippedListingPageState(context).dark,
    }

    // Pages that's only available when the user is not authenticated.
    if (!usr) {
      darkPages[$74] = bs_newUserPageState(context).dark
      darkPages[$90] = bs_resetPasswordPageState(context).dark
    }

    if (Config.DEV && Access.the(usr).can('dev_install_page.view')) {
      darkPages[$44] = (() => {
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