import { FastifyPluginAsync, FastifyReply } from 'fastify'
import {
  get_bootstrap_key,
  get_client_domain,
  get_server_domain
} from './bootstrap.state'
import { resolve } from 'path'
import { promises } from 'fs'

const { readFile } = promises

const root: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {

  const opts = { ...rootOpts }

  fastify.get('/', opts, async function (request, reply) {
    reply.send({ message: 'Hello world' })
  })
}

export default root

export const backedup_code = async (reply: FastifyReply) => {
  const indexHtmlPath = resolve(__dirname, '../../static/index.html')
  const indexHtmlContent = await readFile(indexHtmlPath, 'utf-8')

  // Inject bootstrap prefix, server domain, and client domain into meta tags
  const bootstrapKey = get_bootstrap_key()
  const serverDomain = get_server_domain()
  const clientDomain = get_client_domain()
  const bootstrapMetaTag = `<meta name="bootstrap" content="${bootstrapKey}" />`
  const domainMetaTag = `<meta name="origin" content="${serverDomain}" />`
  const clientMetaTag = `<meta name="client-origin" content="${clientDomain}" />`

  // Insert all meta tags in the head section
  const htmlWithMeta = indexHtmlContent.replace(
    '</head>',
    `  ${bootstrapMetaTag}\n  ${domainMetaTag}\n  ${clientMetaTag}\n</head>`
  )

  reply
    .header('Content-Type', 'text/html; charset=utf-8')
    .send(htmlWithMeta)
}
