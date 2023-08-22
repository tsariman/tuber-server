import { RouteShorthandOptions } from 'fastify'
import session_pre_validation from './session.pre.validation'
import session_pre_authentication from './session.pre.authentication'

/** Use on all routes by default, unless using custom options. */
export const DEFAULT_OPTIONS: RouteShorthandOptions = {
  preValidation: session_pre_validation
}

export const AUTHENTICATION_OPTIONS: RouteShorthandOptions = {
  preValidation: session_pre_authentication
}

