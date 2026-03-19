import { FastifyPluginAsync } from 'fastify'
import path from 'path'
import { readFileSync, existsSync } from 'fs'
import {
  get_bootstrap_key,
  get_client_domain,
  get_server_domain
} from '../business.logic/security'

let cachedHtml: string | null = null

function getClientHtml(): string | null {
  if (cachedHtml === null) {
    const clientIndex = path.join(__dirname, '../../client/index.html')
    if (existsSync(clientIndex)) {
      let html = readFileSync(clientIndex, 'utf-8')

      // Inject runtime meta values into the built client HTML
      html = html.replace(
        /(<meta\s+name="bootstrap"\s+content=")[^"]*(")/,
        `$1${get_bootstrap_key()}$2`
      )
      html = html.replace(
        /(<meta\s+name="origin"\s+content=")[^"]*(")/,
        `$1${get_server_domain()}$2`
      )

      // Add client-origin meta tag if not present
      if (!html.includes('name="client-origin"')) {
        html = html.replace(
          /(<meta\s+name="origin"\s+content="[^"]*"\s*\/?>)/,
          `$1\n    <meta name="client-origin" content="${get_client_domain()}" />`
        )
      } else {
        html = html.replace(
          /(<meta\s+name="client-origin"\s+content=")[^"]*(")/,
          `$1${get_client_domain()}$2`
        )
      }

      cachedHtml = html
    }
  }
  return cachedHtml
}

export { getClientHtml }

const root: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {
  const opts = { ...rootOpts }

  // Serve the client SPA for the root route
  fastify.get('/', opts, async function (request, reply) {
    void request
    const html = getClientHtml()
    if (html) {
      reply.header('Content-Type', 'text/html; charset=utf-8').send(html)
    } else {
      reply.status(404).send('Client not built. Run: pnpm run build:client')
    }
  })
}

export default root
