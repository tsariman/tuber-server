import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
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
  get_body as get_from_body,
  get_state_key,
  get_theme_mode,
  parse_cookie,
  set_state_by_key,
  themed
} from '../business.logic';
import { get_documents_count } from '../DEV';
import {
  IBootstrapResponse,
  TObj,
  TStateAllDialogs,
  TStateAllForms,
  TStateAllPages,
  TStateApp,
  TStateAppbar,
} from '../common.types';
import {
  $40_STATE_KEY,
  $44_STATE_KEY,
  $46_STATE_KEY,
  $58_STATE_KEY,
} from '../constants';
import signInFormState, {
  $41DarkThemeMode
} from 'src/state/form/sign.in.form.state';
import {
  default_500_error_response
} from 'src/business.logic/jsonapi.error.builder';
import { TCipheredUser } from '../schema/users';
import chippedListingPageState, {
  $51DarkThemeMode
} from 'src/state/page/listing.page.state';

/** @deprecated */
export default async function bootstrap_controller(fastify: FastifyInstance) {

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
      Config.log('[DEBUG] req.body.cookie:', cookie);
      token = parse_cookie(cookie).token;
      Config.log('[DEBUG] token:', token);
    } else {
      Config.log('[DEBUG] No cookie received.');
    }

    let usr: TCipheredUser | null = null;

    try {
      usr = await req.jwtVerify<TCipheredUser>();
      Config.log('[DEBUG] Decoded values from token:', usr);
    } catch (err: any) {
      Config.log('[DEBUG] Token verification failed.', err.message);
    }

    try {
      /** Application information state */
      const appState: TStateApp = { ...DEFAULT_APP_INFO };
      const mode = appState['themeMode'] = get_theme_mode(cookie);

      // Research page light mode state
      set_state_by_key(pagesLightState, {
        ...researchPageState,
        appbar: {
          ...researchPageAppbarState,
          items: [
            ...(Config.DEV && usr && usr.role === 'developer' ? [
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
      });

      // Research page dark mode state
      set_state_by_key(pagesDarkState, {
        ...$40DarkThemeMode,
        appbar: {
          ...$63DarkThemeMode,
          items: [
            ...(Config.DEV && usr && usr.role === 'developer' ? [
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
      });

      if (usr) {
        // Listing (research) page light mode state
        set_state_by_key(pagesLightState, {
          ...listingPageState,
          appbar: {
            ...researchPageAppbarState,
            items: [
              ...(Config.DEV && usr.role === 'developer' ? [
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
        });

        // Listing (research) page dark mode state
        set_state_by_key(pagesDarkState, {
          ...$70DarkThemeMode,
          appbar: {
            ...$63DarkThemeMode,
            items: [
              ...(Config.DEV && usr.role === 'developer' ? [
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
        });

        // Listing (chipped) page light mode state
        set_state_by_key(pagesLightState, {
          ...chippedListingPageState,
          appbar: {
            ...listingPageAppbarState,
            items: [
              ...(Config.DEV && usr.role === 'developer' ? [
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
        });

        // Listing (chipped) page dark mode state
        set_state_by_key(pagesDarkState, {
          ...$51DarkThemeMode,
          appbar: {
            ...$71DarkThemeMode,
            items: [
              ...(Config.DEV && usr.role === 'developer' ? [
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
        });

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
        pagesLightState[devInstallPageKey] = {
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
        pagesDarkState[devInstallPageKey] = {
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
          'stateRegistry': Config.getRegistry('state'), // here
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
      } as IBootstrapResponse);

    } catch (err) {
      console.error(err);
      reply.code(500).send(default_500_error_response(err));
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
