import { FastifyReply, FastifyRequest } from 'fastify'
import devTestDrawer from '../dev.test.drawer.state'
import { INetState } from '../../../../tuber-client/src/controllers/interfaces/IState'
import { NET_STATE_PATCH_DELETE } from '../../state'

export async function dev_load_test_drawer (
  _request: FastifyRequest,
  reply: FastifyReply
) {

  reply.send({
    'state': {
      'pages': {
        'dev-install': {
          'drawer': devTestDrawer
        }
      },
      'drawer': {
        'open': true // Drawer will open immediately upon being loaded.
      }
    } as INetState
  })
}

export async function dev_unload_test_drawer (
  _request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send({
    'state': {
      'pages': {
        'dev-install': {
          'hideDrawer': true,
          'drawer': NET_STATE_PATCH_DELETE
        }
      },
      'drawer': {
        'open': false // Drawer will open immediately upon being loaded.
      }
    }
  })
}
