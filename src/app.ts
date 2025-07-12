import fastify from 'fastify';
import router from './router';
import * as dotenv from 'dotenv';

// [PROD] comment out this line
import cors from '@fastify/cors';

import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
// import Tokens from '@fastify/csrf'
import { TCipheredUser } from './schema/users';

dotenv.config({ path: `${__dirname}/../.env.app-config` });

declare module 'fastify' {
  interface FastifyRequest {
    usr: TCipheredUser
  }
};

const server = fastify({
  // logger one for production
  logger: !!(process.env.NODE_ENV !== "development")
});

// [PROD] Comment out this code
// Middleware: CORS
server.register(cors, {
  origin: ['http://localhost:3000']
});

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET ?? '',
  cookie: {
    cookieName: 'token',
    signed: false
  },
});

server.register(fastifyCookie);

const cookieDomain = process.env.DOMAIN ?? '127.0.0.1:8080';
console.log(`\u{1F36A} Cookie domain: ${cookieDomain}`);

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
server.register(router);

export default server;