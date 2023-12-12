import { RouteShorthandOptions } from 'fastify'
import on_request from '../on.request'
// import pre_handler_authenticate from '../pre.handler.authenticate'

/** Use on all routes by default, unless using custom options. */
export const DEFAULT_OPTIONS: RouteShorthandOptions = {
  // preHandler: pre_handler_authenticate,
  onRequest: on_request
}
