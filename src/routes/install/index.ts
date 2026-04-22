import { FastifyPluginAsync } from 'fastify'

/**
 * Placeholder index to prevent `@fastify/autoload` from loading individual
 * handler files in this directory as Fastify plugins.
 * Install routes are registered in `routes/install.ts`.
 */
const installHandlersIndex: FastifyPluginAsync = async () => {}

export default installHandlersIndex
