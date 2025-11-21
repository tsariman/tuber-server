import { FastifyPluginAsync } from 'fastify'
import {
  get_bootstrap_key,
  get_client_domain,
  get_server_domain
} from '../business.logic/security'

let cachedHtml: string | null = null

const root: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {
  const opts = { ...rootOpts }
  const username = 'Tsariman'

  // Build and cache the HTML once
  if (cachedHtml === null) {
    cachedHtml = [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '<head>',
      '  <meta charset="UTF-8">',
      `  <meta name="bootstrap" content="${get_bootstrap_key()}" />`,
      `  <meta name="origin" content="${get_server_domain()}" />`,
      `  <meta name="client-origin" content="${get_client_domain()}" />`,
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '  <title>INAVID</title>',
      '</head>',
      '<body>',
      `  Hello world! My name is ${username}.`,
      '  <div id="root"></div>',
      '  <script src="/app.js"></script>',
      '</body>',
      '</html>'
    ].join('\n')
  }

  fastify.get('/', opts, async function (request, reply) {
    void request
    reply
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(cachedHtml)
  })

}

export default root
