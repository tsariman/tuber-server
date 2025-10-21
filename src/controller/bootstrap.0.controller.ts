import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { parse_cookie } from '../utility';
import Config from '../config';
import { backgroundState } from '../state';
import {
  $32DarkThemeMode,
  $68DarkThemeMode,
  confirmSignOutDialogState,
  signInDialogState,
  newVideoUrlDialogState
} from '../state/dialog';
import { defaultAppBarState } from '../state/default.content';
import get_theme_state, {
  darkThemeState,
  lightThemeState
} from '../state/theme.state';
import devInstallPageState, {
  $44DarkThemeMode
} from '../DEV/page/dev.install.page.state';
import devInstallFormState, {
  $47DarkThemeMode
} from '../DEV/form/dev.install.form.state';
import researchPageState, {
  $40DarkThemeMode,
  $70DarkThemeMode,
  listingPageState
} from '../state/page/research.page.state';
import researchPageAppbarState, {
  $63DarkThemeMode,
  $71DarkThemeMode,
  listingPageAppbarState,
} from '../state/appbar';
import {
  homeLinkState,
  bookmarkAddFromUrlLinkState,
  powerSignInLinkState,
  lightModeLinkState,
  darkModeLinkState,
  researchAppErrorsViewLinkState,
  $67DarkThemeMode,
  powerLogoutLinkState,
  $66DarkThemeMode
} from '../state/nav.link';
import { 
  clone_or_default,
  clone_with_descriptors,
  get_from_body,
  get_state_key,
  get_theme_mode,
  set_state_by_key,
  themed
} from '../business.logic';
import { get_documents_count } from '../DEV';
import {
  TJsonapiStateResponse,
  TStateAllDialogs,
  TStateAllForms,
  TStateAllPages,
  TStateApp,
  TStateAppbar,
} from '../shared';
import { TObj } from '../common.types';
import {
  $40_STATE_KEY,
  $44_STATE_KEY,
  $46_STATE_KEY,
  $58_STATE_KEY,
} from '../constants.server';
import signInFormState, {
  $41DarkThemeMode
} from '../state/form/sign.in.form.state';
import {
  default_500_error_response
} from '../business.logic/builder/JsonapiErrorBuilder';
import { TCipheredUser } from '../schema/users';
import chippedListingPageState, {
  $51DarkThemeMode
} from '../state/page/listing.page.state';
import { get_registry } from '../business.logic/registry';
import { log, log_err } from '../utility/logging';

/** @deprecated */
export default async function bootstrap_0_controller(fastify: FastifyInstance) {

  const DEFAULT_APP_INFO: TStateApp = {
    'fetchingStateAllowed': true,
    'inDebugMode': false,
    'inDevelMode': false,
    'logoUri': '../tuber.png',
    // 'logoWidth': 212,
    // 'logoHeight': 35,
    'title': Config.DEV ? `[DEV] Tuberesearcher` : `Tuberesearcher`,
    'homepage': $40_STATE_KEY,
  };

  const appbarState: TStateAppbar = {
    ...defaultAppBarState
  };

  const pagesState: TStateAllPages = {};
  // set_state_by_key(pagesState, signInPageState)
  // TODO: Insert more pages here

  const pagesLightState: TStateAllPages = {};
  set_state_by_key(pagesLightState, researchPageState);
  // TODO: Don't forget to insert light mode state for each page

  const pagesDarkState: TStateAllPages = {};
  set_state_by_key(pagesDarkState, $40DarkThemeMode);
  // TODO: Don't forget to insert dark mode state for each page

  const formsState: TStateAllForms = {};
  // set_state_by_key(formsState, signInFormState)
  // TODO: Insert more forms here

  const formsLightState: TStateAllForms = {};
  set_state_by_key(formsLightState, signInFormState);
  // TODO: Don't forget to insert light mode state for each form

  const formsDarkState: TStateAllForms = {};
  set_state_by_key(formsDarkState, $41DarkThemeMode);
  // TODO: Don't forget to insert dark mode state for each form

  const dialogsState: TStateAllDialogs = {};
  // TODO: Insert more dialogs here

  const dialogsLightState: TStateAllDialogs = {};
  set_state_by_key(dialogsLightState, signInDialogState);
  set_state_by_key(dialogsLightState, confirmSignOutDialogState);
  // TODO: Don't forget to insert light mode state for each dialog

  const dialogsDarkState: TStateAllDialogs = {};
  set_state_by_key(dialogsDarkState, $32DarkThemeMode);
  set_state_by_key(dialogsDarkState, $68DarkThemeMode);
  // TODO: Don't forget to insert dark mode state for each dialog

  const pagesData = {} as TObj;
  const devInstallPageKey = get_state_key(devInstallPageState);
  const researchPageKey = get_state_key(researchPageState);
  const chippedListingPageKey = get_state_key(chippedListingPageState);
  const listingPageKey = get_state_key(listingPageState);

  fastify.post('/', async function (
    req: FastifyRequest<{ Body: { cookie?: string }}>,
    reply: FastifyReply
  ) {
    let token = '';
    const cookie = get_from_body(req, 'cookie', '');

    if (cookie) {
      log('[DEBUG] req.body.cookie:', cookie);
      token = parse_cookie(cookie).token;
      log('[DEBUG] token:', token);
    } else {
      log('[DEBUG] No cookie received.');
    }

    let usr: TCipheredUser | null = null;

    try {
      usr = await req.jwtVerify<TCipheredUser>();
      log('[DEBUG] Decoded values from token:', usr);
    } catch (e) {
      log('[DEBUG] Token verification failed.', (e as Error).message);
    }

    try {
      /** Application information state */
      const appState: TStateApp = { ...DEFAULT_APP_INFO };
      const mode = appState['themeMode'] = get_theme_mode(cookie);

      // Research page light mode state
      set_state_by_key(pagesLightState, (() => {
        const base = clone_with_descriptors(researchPageState);
        const appbar = clone_with_descriptors(researchPageAppbarState);
        const items = clone_or_default(appbar.items, []);
        if (Config.DEV && usr?.role === 'developer') {
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
      })());

      // Research page dark mode state
      set_state_by_key(pagesDarkState, (() => {
        const base = clone_with_descriptors($40DarkThemeMode);
        const appbar = clone_with_descriptors($63DarkThemeMode);
        const items = clone_or_default(appbar.items, []);
        if (Config.DEV && usr && usr.role === 'developer') {
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
      })());

      if (usr) {
        // Listing (research) page light mode state
        set_state_by_key(pagesLightState, (() => {
          const base = clone_with_descriptors(listingPageState);
          const appbar = clone_or_default(researchPageAppbarState, {});
          const items = clone_or_default(appbar.items, []);
          if (Config.DEV && usr.role === 'developer') {
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
        })());

        // Listing (research) page dark mode state
        set_state_by_key(pagesDarkState, (() => {
          const base = clone_with_descriptors($70DarkThemeMode);
          const appbar = clone_with_descriptors($63DarkThemeMode);
          const items = clone_or_default(appbar.items, []);
          if (Config.DEV && usr.role === 'developer') {
            items.push(researchAppErrorsViewLinkState);
            items.push(homeLinkState);
          } else {
            items.push(bookmarkAddFromUrlLinkState);
          }
          items.push(darkModeLinkState);
          items.push($66DarkThemeMode);
          appbar.items = items;
          base.appbar = appbar;
          return base;
        })());

        // Listing (chipped) page light mode state
        set_state_by_key(pagesLightState, (() => {
          const base = clone_with_descriptors(chippedListingPageState);
          const appbar = clone_with_descriptors(listingPageAppbarState);
          const items = clone_or_default(appbar.items, []);
          if (Config.DEV && usr.role === 'developer') {
            items.push(researchAppErrorsViewLinkState);
            items.push(homeLinkState);
          } else {
            items.push(bookmarkAddFromUrlLinkState);
          }
          items.push(lightModeLinkState);
          items.push(powerLogoutLinkState);
          appbar.items = items;
          base.appbar = appbar;
          return base;
        })());

        // Listing (chipped) page dark mode state
        set_state_by_key(pagesDarkState, (() => {
          const base = clone_with_descriptors($51DarkThemeMode);
          const appbar = clone_with_descriptors($71DarkThemeMode);
          const items = clone_or_default(appbar.items, []);
          if (Config.DEV && usr.role === 'developer') {
            items.push(researchAppErrorsViewLinkState);
            items.push(homeLinkState);
          } else {
            items.push(bookmarkAddFromUrlLinkState);
          }
          items.push(darkModeLinkState);
          items.push($66DarkThemeMode);
          appbar.items = items;
          base.appbar = appbar;
          return base;
        })());

        // Listing (research alias) page state
        pagesState[listingPageKey] = themed(
          pagesLightState[listingPageKey],
          pagesDarkState[listingPageKey],
          mode
        );

        // Listing (chipped) page state
        pagesState[chippedListingPageKey] = themed(
          pagesLightState[chippedListingPageKey],
          pagesDarkState[chippedListingPageKey],
          mode
        );
      }

      if (Config.DEV // DEV mode ----------------------------------------------
        && usr
        && (usr.role === 'developer')
      ) {
        appState['inDebugMode'] = true;
        appState['inDevelMode'] = true;
        appState['homepage'] = $44_STATE_KEY;
        if (devInstallPageState.appbar) {
          // [TODO] Write logic for power button
        };
        pagesLightState[devInstallPageKey] = (() => {
          const base = clone_with_descriptors(devInstallPageState);
          const appbar = clone_or_default(base.appbar, {});
          const items = clone_or_default(appbar.items, []);
          items.push(powerLogoutLinkState);
          appbar.items = items;
          base.appbar = appbar;
          return base;
        })();
        pagesDarkState[devInstallPageKey] = (() => {
          const base = clone_with_descriptors($44DarkThemeMode);
          const appbar = clone_or_default(base.appbar, {});
          const items = clone_or_default(appbar.items, []);
          items.push($66DarkThemeMode);
          appbar.items = items;
          base.appbar = appbar;
          return base;
        })();
  
        // Dev install page state
        pagesState[devInstallPageKey] = themed(
          pagesLightState[devInstallPageKey],
          pagesDarkState[devInstallPageKey],
          mode
        );

        // Dev install form state
        const formState = themed(devInstallFormState, $47DarkThemeMode, mode);
        const devInstallFormKey = get_state_key(formState);
        formsState[devInstallFormKey] = formState;
        formsLightState[devInstallFormKey] = devInstallFormState;
        formsDarkState[devInstallFormKey] = $47DarkThemeMode;
        const counts = await get_documents_count();
        pagesData[devInstallFormKey] = counts;
        pagesData[$46_STATE_KEY] = {
          thumbnailUrl: `${Config.IMAGE_FOLDER}dev-thumbnail-test-placeholder.jpg`
        };
        pagesData[$58_STATE_KEY] = {
          thumbnailUrl: `${Config.IMAGE_FOLDER}dev-thumbnail-test-placeholder.jpg`
        };
      } // END if (Config.DEV) ------------------------------------------------

      // Research page state
      pagesState[researchPageKey] = themed(
        pagesLightState[researchPageKey],
        pagesDarkState[researchPageKey],
        mode
      );

      // Sign in form state
      formsState[get_state_key(signInFormState)] = themed(
        signInFormState,
        $41DarkThemeMode,
        mode
      );

      // Sign in dialog state
      dialogsState[get_state_key(signInDialogState)] = themed(
        signInDialogState,
        $32DarkThemeMode,
        mode
      );

      // Sign out dialog state
      dialogsState[get_state_key(confirmSignOutDialogState)] = themed(
        confirmSignOutDialogState,
        $68DarkThemeMode,
        mode
      );

      appState.isBootstrapped = true;

      reply
      .send({
        'state': {
          'app': appState,
          'theme': get_theme_state(mode),
          'themeLight': lightThemeState,
          'themeDark': darkThemeState,
          'appbar': appbarState,
          'pages': pagesState,
          'pagesLight': pagesLightState,
          'pagesDark': pagesDarkState,
          'pagesData': pagesData,
          'background': backgroundState,
          'forms': formsState,
          'formsLight': formsLightState,
          'formsDark': formsDarkState,
          'dialogs': dialogsState,
          'dialogsLight': dialogsLightState,
          'dialogsDark': dialogsDarkState,
          'staticRegistry': get_registry('state'),
          ...(usr ? { 'net': {
            'name': usr.name,
            'role': usr.role,
            'token': token,
            'jwt_version': usr.jwt_version,
          }} : {
            // Originally, session was null but it crashed the app
            'net': undefined,
          }),
        }
      } as TJsonapiStateResponse);

    } catch (e) {
      log_err('attempting to bootstrap state', e);
      reply.code(500).send(default_500_error_response(e));
    }
  });

  fastify.post('/2', async function (
    _req: FastifyRequest,
    reply: FastifyReply
  ) {
    reply.send({
      state: { 'dialog': newVideoUrlDialogState }
    });
  });
}
