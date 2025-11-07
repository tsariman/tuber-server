import { FastifyReply, FastifyRequest } from 'fastify'
import devTestDrawer from '../dev.test.drawer.state'
import { NET_STATE_PATCH_DELETE } from '../../state'
import { TNetState } from '@tuber/shared'

export async function dev_post_load_test_drawer_endpoint (
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
    } as TNetState
  })
}

export async function dev_post_unload_test_drawer_endpoint (
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
