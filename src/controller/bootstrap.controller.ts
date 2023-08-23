import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import Config from 'src/config'
import IStateApp from '../../../tuber-client/src/controllers/interfaces/IStateApp'
import { backgroundJson } from 'src/state'
import { loginDialogJson, noteAddDialogJson } from 'src/state/dialogs'
import { loginPage } from 'src/state/pages'
import { defaultAppBarJson } from 'src/state/default.content'
import themeJson from 'src/state/theme.state'
import { DEFAULT_OPTIONS } from 'src/controller/router.option'
import IStateAllPages from '../../../tuber-client/src/controllers/interfaces/IStateAllPages'
import devInstallPage from 'src/INSTALL.DEV/dev.install.page.state'
import devSignedInAppBar from 'src/INSTALL.DEV/dev.signedin-appbar.page.state'
import researchPageJson from 'src/state/pages/research.page.state'
import IStateAllDialogs from '../../../tuber-client/src/controllers/interfaces/IStateAllDialogs'
import IStateAllForms from '../../../tuber-client/src/controllers/interfaces/IStateAllForms'
import loginFormJson from 'src/state/forms/login.form.state'
import newNoteFormJson from 'src/state/forms/new.note.form.state'
import IStateAppBar from '../../../tuber-client/src/controllers/interfaces/IStateAppBar'
import devInstallForm from 'src/INSTALL.DEV/dev.install.form.state'
import researchPageAppBarJson from 'src/state/appBar/research.page.appbar.state'
import { homeLinkJson, loginLinkJson } from 'src/state/nav.link'

const opts = {
  ...DEFAULT_OPTIONS,
  preValidation: undefined
  // TODO Add custom route options here
}

export default async function bootstrapController(fastify: FastifyInstance) {
  // GET /api/v1/user
  fastify.post('/', opts, async function (
    _request: FastifyRequest,
    reply: FastifyReply
  ) {

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

    if (Config.DEV) {
      appJson['inDebugMode'] = true
      appJson['inDevelMode'] = true
      appJson['homePage'] = 'dev-install'
    }

    const appBar: IStateAppBar = {
      ...defaultAppBarJson
    }

    const pages: IStateAllPages = {}
    pages['login'] = loginPage

    // TODO: Insert more pages here

    if (Config.DEV) {
      pages['dev-install'] = devInstallPage
      pages['dev-signedin-appbar'] = devSignedInAppBar
      pages['research-app'] = {
        ...researchPageJson,
        appBar: {
          ...researchPageAppBarJson,
          items: [ homeLinkJson, loginLinkJson ]
        }
      }
    }

    const forms: IStateAllForms = {}
    forms['loginForm'] = loginFormJson
    forms['newNoteForm'] = newNoteFormJson
    forms['devInstallForm'] = devInstallForm

    // TODO: Insert more forms here

    const dialogs: IStateAllDialogs = {}
    dialogs['noteAddDialog'] = noteAddDialogJson
    dialogs['loginDialog'] = loginDialogJson

    // TODO: Insert more dialogs here

    reply.send({
      state: {
        app: appJson,
        theme: themeJson,
        appBar,
        pages,
        background: backgroundJson,
        forms,
        dialogs
      }
    })
  })
}
