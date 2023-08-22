import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { promises } from 'fs'
import { resolve } from 'path'
import { DEFAULT_OPTIONS } from 'src/component/router.option'

const opts = {
  ...DEFAULT_OPTIONS,
  // TODO Add custom route options here
}

const { readFile } = promises

export default async function indexController(fastify: FastifyInstance) {
  fastify.get('/', opts, async function (_request: FastifyRequest, reply: FastifyReply) {
    const indexHtmlPath = resolve(__dirname, '../../static/index.html')
    const indexHtmlContent = await readFile(indexHtmlPath)

    reply
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(indexHtmlContent)
  })
}