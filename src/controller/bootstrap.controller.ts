import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import Config from 'src/config'
import IStateApp from '../../../tuber-client/src/controllers/interfaces/IStateApp'
import { backgroundJson } from 'src/state'
import { loginDialogJson, noteAddDialogJson, noteAddFromUrlDialogJson } from 'src/state/dialogs'
import { loginPage } from 'src/state/pages'
import { defaultAppBarJson } from 'src/state/default.content'
import themeJson from 'src/state/theme.state'
import IStateAllPages from '../../../tuber-client/src/controllers/interfaces/IStateAllPages'
import IStateAllForms from '../../../tuber-client/src/controllers/interfaces/IStateAllForms'
import IStateAllDialogs from '../../../tuber-client/src/controllers/interfaces/IStateAllDialogs'
import IStateAppBar from '../../../tuber-client/src/controllers/interfaces/IStateAppBar'
import devInstallPageJson from 'src/INSTALL.DEV/dev.install.page.state'
import devSignedInAppBar from 'src/INSTALL.DEV/dev.signedin-appbar.page.state'
import devInstallForm from 'src/INSTALL.DEV/dev.install.form.state'
import researchPageJson from 'src/state/pages/research.page.state'
import loginFormJson from 'src/state/forms/login.form.state'
import newNoteFormJson from 'src/state/forms/new.note.form.state'
import researchPageAppBarJson from 'src/state/appBar/research.page.appbar.state'
import { homeLinkJson, noteAddFromUrlLinkJson, powerLinkJson } from 'src/state/nav.link'
import newVideoNoteFormJson from 'src/state/forms/new.note.from.url.form.state'
import { get_state_key, set_state_by_key } from 'src/business.logic'

export default async function bootstrap_controller(fastify: FastifyInstance) {

  /** Application configuration */
  const appJson: IStateApp = {
    'inDebugMode': false,
    'inDevelMode': false,
    'logoUri': '../tuber.png',
    'logoWidth': 212,
    'logoHeight': 35,
    'title': '[DEV] Tuberesearcher',
    'homePage': 'login',
    'isBootstrapped': true
  }

  const appBarJson: IStateAppBar = {
    ...defaultAppBarJson
  }

  const pagesJson: IStateAllPages = {}
  set_state_by_key(pagesJson, loginPage)
  // TODO: Insert more pages here

  const formsJson: IStateAllForms = {}
  set_state_by_key(formsJson, loginFormJson)
  set_state_by_key(formsJson, newNoteFormJson)
  set_state_by_key(formsJson, newVideoNoteFormJson)
  // TODO: Insert more forms here

  const dialogsJson: IStateAllDialogs = {}
  set_state_by_key(dialogsJson, noteAddDialogJson)
  set_state_by_key(dialogsJson, loginDialogJson)
  set_state_by_key(dialogsJson, noteAddFromUrlDialogJson)

  // TODO: Insert more dialogs here

  fastify.post('/', async function (
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    if (Config.DEV) {
      appJson['inDebugMode'] = true
      appJson['inDevelMode'] = true
      appJson['homePage'] = 'dev-install'
    }

    if (Config.DEV) {
      if (devInstallPageJson.appBar) {
        // [TODO] Write logic for power button
      }
      pagesJson[get_state_key(devInstallPageJson)] = {
        ...devInstallPageJson,
        'appBar': {
          ...devInstallPageJson,
          'items': [
            ...(devInstallPageJson.appBar 
              && devInstallPageJson.appBar.items
              || []
            ),
            powerLinkJson
          ]
        },
      }
      pagesJson[get_state_key(devSignedInAppBar)] = devSignedInAppBar
      pagesJson[get_state_key(researchPageJson)] = {
        ...researchPageJson,
        appBar: {
          ...researchPageAppBarJson,
          items: [ noteAddFromUrlLinkJson, homeLinkJson, powerLinkJson ]
        }
      }
    }

    if (Config.DEV) {
      formsJson[get_state_key(devInstallForm)] = devInstallForm
    }

    reply.send({
      state: {
        'app': appJson,
        'theme': themeJson,
        'appBar': appBarJson,
        'pages': pagesJson,
        'background': backgroundJson,
        'forms': formsJson,
        'dialogs': dialogsJson
      }
    })
  })
}
