import { FastifyInstance } from 'fastify';
// import { randomBytes } from 'crypto';
// import dev_controller from './DEV/dev.controller';
import prod_install_controller from './install/prod.controller';
import Config from './config';
import platform_controller from './platform/platform.controller';
import state_controller from './state/state.controller';
import JsonapiErrorBuilder from './business.logic/builder/JsonapiErrorBuilder';
import { default_404_error_response } from './business.logic/errors';
import * as C from '@tuber/shared/dist/constants.server';
import { log } from './utility/logging';

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
    log('[ERROR]', error);
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

  fastify.register(state_controller, { prefix: `/${C.EP_STATE}` });

  if (!Config.DEV) { 
    /*[TODO] Add permission here. Administrator and above */
    fastify.register(prod_install_controller, { prefix: `/${C.EP_INSTALL}` });
  }

  // [TODO] Add permission here. Administrator and above
  fastify.register(platform_controller, { prefix: `/${C.EP_PLATFORM}` });
}
