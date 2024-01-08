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
import researchPageAppBarState, {
  $63DarkThemeMode
} from '../state/appbar/research.page.appbar.state';
import {
  homeLinkState,
  bookmarkAddFromUrlLinkState,
  powerSignInLinkState,
  defaultErrorsViewLinkState,
  lightModeLinkState,
  darkModeLinkState,
  researchAppErrorsViewLinkState,
  $67DarkThemeMode,
  powerLogoutLinkState,
  $66DarkThemeMode
} from '../state/nav.link';
import { 
  get_state_key,
  get_theme_mode,
  parse_cookie,
  set_state_by_key,
  themed
} from '../business.logic';
import { get_documents_count } from '../DEV';
import {
  IBootstrapResponse,
  TStateAllDialogs,
  TStateAllForms,
  TStateAllPages,
  TStateApp,
  TStateAppbar,
} from '../common.types';
import {
  $44_STATE_KEY,
  $46_STATE_KEY,
  $51_STATE_KEY,
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

export default async function bootstrap_controller(fastify: FastifyInstance) {

  const DEFAULT_APP_INFO: TStateApp = {
    'fetchingStateAllowed': true,
    'inDebugMode': false,
    'inDevelMode': false,
    'logoUri': '../tuber.png',
    // 'logoWidth': 212,
    // 'logoHeight': 35,
    'title': Config.DEV ? `[DEV] Tuberesearcher` : `Tuberesearcher`,
    'homePage': $51_STATE_KEY,
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

  const pagesData = {} as Record<string, any>;
  const devInstallPageKey = get_state_key(devInstallPageState);
  const researchPageKey = get_state_key(researchPageState);
  const chippedListingPageKey = get_state_key(chippedListingPageState);
  const listingPageKey = get_state_key(listingPageState);

  fastify.post('/', async function (
    req: FastifyRequest<{ Body: { cookie?: string }}>,
    reply: FastifyReply
  ) {
    let token = '';
    if (req.body.cookie) {
      Config.log('[DEBUG] req.body.cookie:', req.body.cookie);
      token = parse_cookie(req.body.cookie).token;
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
      const mode = appState['themeMode'] = get_theme_mode(req.body.cookie);

      // Research page light mode state
      set_state_by_key(pagesLightState, {
        ...researchPageState,
        appbar: {
          ...themed(researchPageAppBarState, $63DarkThemeMode, mode),
          items: [
            // [TODO] Must be logged in to see this
            // bookmarkAddFromUrlLinkState,
            lightModeLinkState,
            usr ? powerLogoutLinkState : powerSignInLinkState,
          ]
        }
      });

      // Research page dark mode state
      set_state_by_key(pagesDarkState, {
        ...$40DarkThemeMode,
        appbar: {
          ...themed(researchPageAppBarState, $63DarkThemeMode, mode),
          items: [
            // [TODO] Must be logged in to see this
            // bookmarkAddFromUrlLinkState,
            darkModeLinkState,
            usr ? $66DarkThemeMode : $67DarkThemeMode,
          ]
        }
      });

      // Listing (research) page light mode state
      set_state_by_key(pagesLightState, {
        ...listingPageState,
        appbar: {
          ...themed(researchPageAppBarState, $63DarkThemeMode, mode),
          items: [
            // [TODO] Must be logged in to see this
            // bookmarkAddFromUrlLinkState,
            lightModeLinkState,
            usr ? powerLogoutLinkState : powerSignInLinkState,
          ]
        }
      });

      // Listing (research) page dark mode state
      set_state_by_key(pagesDarkState, {
        ...$70DarkThemeMode,
        appbar: {
          ...themed(researchPageAppBarState, $63DarkThemeMode, mode),
          items: [
            // [TODO] Must be logged in to see this
            // bookmarkAddFromUrlLinkState,
            darkModeLinkState,
            usr ? $66DarkThemeMode : $67DarkThemeMode,
          ]
        }
      });

      // Listing page light mode state
      set_state_by_key(pagesLightState, {
        ...chippedListingPageState,
        appbar: {
          ...themed(researchPageAppBarState, $63DarkThemeMode, mode),
          items: [
            // [TODO] Must be logged in to see this
            // bookmarkAddFromUrlLinkState,
            lightModeLinkState,
            usr ? powerLogoutLinkState : powerSignInLinkState,
          ]
        }
      });

      // Listing page dark mode state
      set_state_by_key(pagesDarkState, {
        ...$51DarkThemeMode,
        appbar: {
          ...themed(researchPageAppBarState, $63DarkThemeMode, mode),
          items: [
            // [TODO] Must be logged in to see this
            // bookmarkAddFromUrlLinkState,
            darkModeLinkState,
            usr ? $66DarkThemeMode : $67DarkThemeMode,
          ]
        }
      });

      if (Config.DEV
        && usr
        && (usr.role === 'developer')
      ) {
        appState['inDebugMode'] = true;
        appState['inDevelMode'] = true;
        appState['homePage'] = $44_STATE_KEY;
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
              usr ? powerLogoutLinkState : powerSignInLinkState,
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
              usr ? $66DarkThemeMode : $67DarkThemeMode,
            ]
          } as TStateAppbar,
        };
  
        // Dev install page state
        pagesState[devInstallPageKey] = themed(
          pagesLightState[devInstallPageKey],
          pagesDarkState[devInstallPageKey],
          mode
        );
  
        // Research page light mode state
        pagesLightState[researchPageKey] = {
          ...researchPageState,
          appbar: {
            ...themed(researchPageAppBarState, $63DarkThemeMode, mode),
            items: [
              defaultErrorsViewLinkState,
              homeLinkState,
              bookmarkAddFromUrlLinkState,
              lightModeLinkState,
              usr ? powerLogoutLinkState : powerSignInLinkState,
            ]
          }
        };

        // Research page dark mode state
        pagesDarkState[researchPageKey] = {
          ...$40DarkThemeMode,
          appbar: {
            ...themed(researchPageAppBarState, $63DarkThemeMode, mode),
            items: [
              researchAppErrorsViewLinkState,
              homeLinkState,
              bookmarkAddFromUrlLinkState,
              darkModeLinkState,
              usr ? $66DarkThemeMode : $67DarkThemeMode,
            ]
          }
        };

        // Listing page light mode state
        pagesLightState[listingPageKey] = {
          ...listingPageState,
          appbar: {
            ...themed(researchPageAppBarState, $63DarkThemeMode, mode),
            items: [
              defaultErrorsViewLinkState,
              homeLinkState,
              bookmarkAddFromUrlLinkState,
              lightModeLinkState,
              usr ? powerLogoutLinkState : powerSignInLinkState,
            ]
          }
        };

        // Listing page dark mode state
        pagesDarkState[listingPageKey] = {
          ...$70DarkThemeMode,
          appbar: {
            ...themed(researchPageAppBarState, $63DarkThemeMode, mode),
            items: [
              researchAppErrorsViewLinkState,
              homeLinkState,
              bookmarkAddFromUrlLinkState,
              darkModeLinkState,
              usr ? $66DarkThemeMode : $67DarkThemeMode,
            ]
          }
        };

        // Listing page light mode state
        pagesLightState[chippedListingPageKey] = {
          ...chippedListingPageState,
          appbar: {
            ...themed(researchPageAppBarState, $63DarkThemeMode, mode),
            items: [
              defaultErrorsViewLinkState,
              homeLinkState,
              bookmarkAddFromUrlLinkState,
              lightModeLinkState,
              usr ? powerLogoutLinkState : powerSignInLinkState,
            ]
          }
        };

        // Listing page dark mode state
        pagesDarkState[chippedListingPageKey] = {
          ...$51DarkThemeMode,
          appbar: {
            ...themed(researchPageAppBarState, $63DarkThemeMode, mode),
            items: [
              researchAppErrorsViewLinkState,
              homeLinkState,
              bookmarkAddFromUrlLinkState,
              darkModeLinkState,
              usr ? $66DarkThemeMode : $67DarkThemeMode,
            ]
          }
        };

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
      } // END if (Config.DEV)

      // Research page state
      pagesState[researchPageKey] = themed(
        pagesLightState[researchPageKey],
        pagesDarkState[researchPageKey],
        mode
      );

      // Listing (research) page state
      pagesState[listingPageKey] = themed(
        pagesLightState[listingPageKey],
        pagesDarkState[listingPageKey],
        mode
      );

      // Listing page state
      pagesState[chippedListingPageKey] = themed(
        pagesLightState[chippedListingPageKey],
        pagesDarkState[chippedListingPageKey],
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
        $32DarkThemeMode,
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
          'stateRegistry': Config.getRegistry('state'),
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
