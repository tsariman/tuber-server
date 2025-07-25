import { FastifyInstance } from 'fastify';
// import { randomBytes } from 'crypto';
import index_controller from './controller/index.controller';
// import bootstrap_controller from './controller/bootstrap.controller';
import dev_controller from './DEV/dev.controller';
import prod_install_controller from './INSTALL/prod.controller';
import Config from './config';
import users_controller from './controller/users.controller';
import authenticate_controller from './controller/authenticate.controller';
import signout_controller from './controller/signout.controller';
import bookmarks_controller from './controller/bookmarks.controller';
import platform_controller from './platform/platform.controller';
import state_controller from './state/state.controller';
import JsonapiErrorBuilder, {
  default_404_error_response
} from './business.logic/builder/jsonapi.error.builder';
import * as C from './constants';
import dev_builder_controller from './DEV/dev.builder.controller';
import $1_bootstrap_controller from './controller/1.bootstrap.controller';

// Global variable to store the current bootstrap prefix
let BOOTSTRAP_PREFIX: string = '';

export function get_bootstrap_key(): string {
  return BOOTSTRAP_PREFIX;
}

export function get_server_domain(): string {
  return Config.DOMAIN || '127.0.0.1:8080';
}

export function get_client_domain(): string {
  return process.env.CLIENT_DOMAIN || 'http://localhost:3000';
}

export default async function router(fastify: FastifyInstance) {

  // Generate a random prefix for the bootstrap controller per session
  const randomPrefix =  '3dad18f2d7bf2214a082c735880bcde9'; // randomBytes(16).toString('hex');
  BOOTSTRAP_PREFIX = randomPrefix;

  // Log the bootstrap prefix for debugging (remove in production)
  console.log('[INFO] Bootstrap prefix generated:', randomPrefix);

  // Default 500 handler
  // [TODO] Dosn't work. Fix it.
  fastify.setErrorHandler((error, _req, reply) => {
    Config.log('[ERROR]', error);
    const status = error.statusCode ?? 500;
    reply.status(status).send(new JsonapiErrorBuilder()
      .withStatus(status)
      .withTitle(error.message)
      .withDetail(error.stack)
      .withMeta('error', error)
      .build()
    );
  });

  // Default 404 handler with SPA support
  fastify.register(function (instance, _options, done) {
    instance.setNotFoundHandler(async (req, reply) => {
      const url = new URL(req.raw.url ?? '', 'http://localhost:3000');
      
      // For non-API routes, serve the client app (SPA fallback)
      if (!url.pathname.startsWith('/api')) {
        return reply.sendFile('index.html');
      }
      
      // For API routes, send JSON error
      reply.code(404).send(default_404_error_response({
        title: 'The requested resource could not be found.',
        source: { pointer: `${url.pathname}${url.search}` }
      }));
    });
    done();
  })

  fastify.register(authenticate_controller, { prefix: `/${C.EP_AUTHENTICATE}` });
  fastify.register(signout_controller, { prefix: `/${C.EP_SIGNOUT}` });
  fastify.register(index_controller, { prefix: '/' });
  fastify.register(state_controller, { prefix: `/${C.EP_STATE}` });
  // fastify.register(bootstrap_controller, { prefix: `/${randomPrefix}` });
  fastify.register($1_bootstrap_controller, { prefix: `/${randomPrefix}` });
  fastify.register(users_controller, { prefix: `/${C.EP_USERS}` });
  fastify.register(bookmarks_controller, { prefix: `/${C.EP_BOOKMARKS}` });

  if (Config.DEV) {
    fastify.register(dev_controller, { prefix: `/${C.EP_DEV}` });
    fastify.register(dev_builder_controller, { prefix: `/${C.EP_DEV_BUILDER}` });
  } else { /*[TODO] Add permission here. Administrator and above */
    fastify.register(prod_install_controller, { prefix: `/${C.EP_INSTALL}` });
  }

  // [TODO] Add permission here. Administrator and above
  fastify.register(platform_controller, { prefix: `/${C.EP_PLATFORM}` });
}
