import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { promises } from 'fs';
import { resolve } from 'path';
// import { DEFAULT_ROUTE_OPTIONS } from '../middleware/router.option';
import { get_bootstrap_key, get_server_domain, get_client_domain } from '../router';

// No authentication required for serving static files
const opts = {
  // TODO Add custom route options here if needed
};

const { readFile } = promises;

export default async function index_controller(fastify: FastifyInstance) {
  fastify.get('/', opts, async function (_request: FastifyRequest, reply: FastifyReply) {
    const indexHtmlPath = resolve(__dirname, '../../static/index.html');
    const indexHtmlContent = await readFile(indexHtmlPath, 'utf-8');

    // Inject bootstrap prefix, server domain, and client domain into meta tags
    const bootstrapKey = get_bootstrap_key();
    const serverDomain = get_server_domain();
    const clientDomain = get_client_domain();
    const bootstrapMetaTag = `<meta name="bootstrap" content="${bootstrapKey}" />`;
    const domainMetaTag = `<meta name="origin" content="${serverDomain}" />`;
    const clientMetaTag = `<meta name="client-origin" content="${clientDomain}" />`;

    // Insert all meta tags in the head section
    const htmlWithMeta = indexHtmlContent.replace(
      '</head>',
      `  ${bootstrapMetaTag}\n  ${domainMetaTag}\n  ${clientMetaTag}\n</head>`
    );

    reply
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(htmlWithMeta);
  })
}