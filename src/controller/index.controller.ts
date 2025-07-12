import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { promises } from 'fs';
import { resolve } from 'path';
import { DEFAULT_ROUTE_OPTIONS } from '../middleware/router.option';
import { getBootstrapPrefix } from '../router';

const opts = {
  ...DEFAULT_ROUTE_OPTIONS,
  // TODO Add custom route options here
};

const { readFile } = promises;

export default async function index_controller(fastify: FastifyInstance) {
  fastify.get('/', opts, async function (_request: FastifyRequest, reply: FastifyReply) {
    const indexHtmlPath = resolve(__dirname, '../../static/index.html');
    const indexHtmlContent = await readFile(indexHtmlPath, 'utf-8');

    // Inject bootstrap prefix into meta tag
    const bootstrapPrefix = getBootstrapPrefix();
    const metaTag = `<meta name="bootstrap" content="${bootstrapPrefix}" />`;
    
    // Insert the meta tag in the head section
    const htmlWithMeta = indexHtmlContent.replace(
      '</head>',
      `  ${metaTag}\n</head>`
    );

    reply
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(htmlWithMeta);
  })
}