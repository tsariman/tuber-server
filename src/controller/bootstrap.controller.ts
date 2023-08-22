import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import Config from 'src/config'
import IStateApp from '../../../tuber-client/src/controllers/interfaces/IStateApp'
import { background } from 'src/state'
import dialogs from 'src/state/dialogs'
import pages from 'src/state/pages'
import forms from 'src/state/forms'
import appBar from 'src/state/default.content/default.appBar.state'
import theme from 'src/state/theme.state'
import { DEFAULT_OPTIONS } from 'src/controller/router.option'

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
    const app: IStateApp = {
      'inDebugMode': false,
      'inDevelMode': false,
      'logoUri': '../tuber.png',
      'logoWidth': 212,
      'logoHeight': 35,
      'title': '[DEV] Tuberesearcher',

      // [TODO] In the web-ui specify that when setting the 'route' from the
      //        server, the 'homePage' needs to be set with the same value.

      // TODO -OPTIONAL- Un-comment the next two lines to force the user to
      //                 log-in.
      // 'route': 'login',
      // 'homePage': 'login'

      // TODO -OPTIONAL- Un-comment the next two lines to make the "Research"
      //                 app page the homepage.
      'homePage': 'research-app',
      'isBootstrapped': true
    }

    if (Config.DEV) {
      app['inDebugMode'] = true
      app['inDevelMode'] = true
      app['homePage'] = 'dev-install'
    }

    reply.send({
      state: {
        app,
        theme,
        appBar,
        pages,
        background,
        forms,
        dialogs
      }
    })
  })
}
