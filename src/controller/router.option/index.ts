import { RouteShorthandOptions } from 'fastify'
import pre_validation_session from './pre.validation.session'

/** Use on all routes by default, unless using custom options. */
export const DEFAULT_OPTIONS: RouteShorthandOptions = {
  preValidation: pre_validation_session
}
