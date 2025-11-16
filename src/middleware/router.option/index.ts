import { RouteShorthandOptions } from 'fastify'
import on_request_default, { on_request_dev, on_request_optional } from '../on.request'

/** Use on all routes by default, unless using custom options. */
export const DEFAULT_ROUTE_OPTIONS: RouteShorthandOptions = {
  // preHandler: pre_handler_authenticate,
  onRequest: on_request_default
}

/** Use on all development routes by default. */
export const DEV_ROUTE_POTIONS: RouteShorthandOptions = {
  // preHandler: pre_handler_authenticate,
  onRequest: on_request_dev
}

/** Use on routes where authentication is not required. */
export const OPTIONAL_ROUTE_OPTIONS: RouteShorthandOptions = {
  onRequest: on_request_optional
}