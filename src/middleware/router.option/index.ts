import { RouteShorthandOptions } from 'fastify';
import default_on_request, { dev_on_request } from '../on.request';
// import pre_handler_authenticate from '../pre.handler.authenticate'

/** Use on all routes by default, unless using custom options. */
export const DEFAULT_ROUTE_OPTIONS: RouteShorthandOptions = {
  // preHandler: pre_handler_authenticate,
  onRequest: default_on_request
};

/** Use on all development routes by default. */
export const DEV_ROUTE_POTIONS: RouteShorthandOptions = {
  // preHandler: pre_handler_authenticate,
  onRequest: dev_on_request
};