import fastify from 'fastify';
import router from './router';
import * as dotenv from 'dotenv';
// Load common settings first
dotenv.config({ path: `${__dirname}/../.env`});
/** Load environment-specific config file */
// const envFile = process.env.NODE_ENV === 'production' 
//   ? `${__dirname}/../.env.production`
//   : `${__dirname}/../.env.development`;
// dotenv.config({ path: envFile });
// dotenv.config({ path: `${__dirname}/../.env.app-config` });
import path from 'node:path';
import cors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifyStatic from '@fastify/static';
import { setupJWT } from './jwt.config';
import { TCipheredUser } from './schema/users';

declare module 'fastify' {
  interface FastifyRequest {
    usr: TCipheredUser;
  }
};

const server = fastify({
  logger: false // Disable logging completely
});

// Async setup function
async function setupServer() {
  // Middleware: CORS
  if (process.env.NODE_ENV !== 'production') {
    await server.register(cors, {
      origin: [process.env.CLIENT_DOMAIN || 'http://localhost:3000']
    });
    if (process.env.CLIENT_DOMAIN) {
      console.log('[INFO] Client\'s domain:',process.env.CLIENT_DOMAIN);
    } else {
      console.log('[ERROR] Client\'s domain is not set in environment variable.');
      console.log('        http://localhost:3000 will be used by default. ');
    }
  }

  // Setup JWT with production key rotation support
  await setupJWT(server);

  await server.register(fastifyCookie);

  // Static file serving for client app
  await server.register(fastifyStatic, {
    root: path.join(__dirname, '../static'),
    prefix: '/static/', // Serve static files with /static/ prefix
  });

  const cookieDomain = process.env.DOMAIN ?? '127.0.0.1:8080';
  console.log(`[INFO] \u{1F36A} Cookie domain: ${cookieDomain}`);

  // Route to set cookie
  server.get('/cookie', async (request, reply) => {
    const token = await reply.jwtSign({
      name: request.usr.name,
      role: request.usr.role,
    });

    reply
      .setCookie('token', token, {
        domain: cookieDomain,
        path: '/',
        secure: false, // send cookie over HTTPS only
        httpOnly: true,
        sameSite: true // alternative CSRF protection
      })
      .code(200)
      .send({ token });
  })

  server.get('/verifycookie', (_request, reply) => {
    reply.send({ code: 'OK', message: 'it works!' })
  });

  // Middleware: Router
  await server.register(router);

  return server;
}

// Initialize server
export default setupServer();