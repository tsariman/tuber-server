import { TJsonapiErrorSource } from '@tuber/shared'
import { signInDialogState } from '../state/dialog'
import JsonapiErrorBuilder, { TJsonapiError } from './builder/JsonapiErrorBuilder'
import { assure } from '../utility'

export const MONGODB_DUPLICATE_KEY_ERROR = 'E11000'

/**
 * Default 500 error response to help prevent repetitive code.
 *
 * @param e error object from try/catch
 * @returns `TJsonapiErrorResponse`
 */
export const default_500_error_response = (e: unknown) => {
  const message = e instanceof Error ? e.message : String(e)
  const stack = e instanceof Error ? e.stack : undefined
  return new JsonapiErrorBuilder()
    .withStatus(500)
    .withCode('INTERNAL_ERROR')
    .withTitle(message)
    .withDetail(stack)
    .build()
}

/**
 * Default 404 error response to help prevent repetitive code.
 *
 * @param error custom error object
 * @returns `TJsonapiErrorResponse`
 */
export const default_404_error_response = (
  error: { title: string, detail?: string, source?: TJsonapiErrorSource }
) => {
  return new JsonapiErrorBuilder()
    .withStatus(404)
    .withCode('NOT_FOUND')
    .withTitle(error.title)
    .withDetail(error.detail)
    .withSource(error.source)
    .build()
}

/**
 * Default 401 error response to help prevent repetitive code.
 * 
 * @param error
 * @param isBrowserReq Set to `true` if request is from a browser.
 */
export const default_401_error_response = (error?: TJsonapiError, isBrowserReq = false) => {
  const { title, detail } = assure(error)
  const builder = new JsonapiErrorBuilder()
    .withStatus(401)
    .withCode('AUTHENTICATION_REQUIRED')
    .withTitle(title || 'Unauthorized')
    .withDetail(detail)
  if (isBrowserReq) {
    builder.withState({ 'dialog': signInDialogState })
  }
  return builder.build()
}

/** Generic response for an authentication-shielded enpoints. */
export const shielded_401_error_response = (error?: TJsonapiError) => {
  const { title, detail } = assure(error)
  return new JsonapiErrorBuilder()
    .withStatus(401)
    .withCode('SERVICE_UNAVAILABLE')
    .withTitle(title || 'The server is busy.')
    .withDetail(detail)
    .build()
}

/**
 * Default 400 error response to help prevent repetitive code.
 *
 * @param error custom error object
 * @returns `TJsonapiErrorResponse`
 */
export const default_400_error_response = (
  error: { title: string, detail?: string }
) => {
  return new JsonapiErrorBuilder()
    .withStatus(400)
    .withCode('INVALID_FORMAT')
    .withTitle(error.title)
    .withDetail(error.detail)
    .build()
}

export class AuthenticationError extends Error {
  public readonly statusCode: number
  public readonly code: string

  constructor(message: string, statusCode: number = 401, code: string = 'AUTH_ERROR') {
    super(message)
    this.name = 'AuthenticationError'
    this.statusCode = statusCode
    this.code = code
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthenticationError)
    }
  }
}

export class DatabaseError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly originalError?: unknown

  constructor(message: string, originalError?: unknown, statusCode: number = 500, code: string = 'DATABASE_ERROR') {
    super(message)
    this.name = 'DatabaseError'
    this.statusCode = statusCode
    this.code = code
    this.originalError = originalError

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError)
    }
  }
}

export class ValidationError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly field?: string

  constructor(message: string, field?: string, statusCode: number = 400, code: string = 'VALIDATION_ERROR') {
    super(message)
    this.name = 'ValidationError'
    this.statusCode = statusCode
    this.code = code
    this.field = field

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }
  }
}

// Types guard

export function isAuthenticationError(error: unknown): error is AuthenticationError {
  return error instanceof AuthenticationError
}

export function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}

export function isCustomError(error: unknown): error is AuthenticationError | DatabaseError | ValidationError {
  return isAuthenticationError(error) || isDatabaseError(error) || isValidationError(error)
}

export const $401_MISSING_ACCESS_TOKEN = {
  'status': '401',
  'title': 'Unauthorized',
  'detail': 'Missing access token in authorization header in format \'Bearer <token>\''
} as TJsonapiError

export const $401_UNAUTHORIZED_ACCESS = {
  'status': '401',
  'title': 'Unauthorized',
  'detail': 'Unauthorized access to resource.'
} as TJsonapiError

export const $403_ACCESS_TOKEN_FORBIDDEN = {
  'status': '403',
  'title': 'Forbidden token',
  'detail': 'Token does not have the privilege to access the resource.'
} as TJsonapiError

export const $400_MISSING_PAYLOAD = {
  'status': '400',
  'title': 'Missing payload',
  'detail': 'Although the token was valid, payload was unavailable.'
} as TJsonapiError

/** Extract error code from a mongodb error message  */
export const get_mongodb_error = (message: string): {
  code: string
  detail: string
} => {
  const pieces = message.split(' ')
  const arrayShift = (array: string[]): string[] => {
    if (array.length === 0) {
      return []
    }
    array.shift()
    return array
  }
  return {
    code: pieces[0],
    detail: arrayShift(pieces).join(' ')
  }
};

/**
 * Converts an unknown value to an Error instance.
 * If the value is already an Error, returns it unchanged.
 * If it's a string, creates a new Error with that string as the message.
 * If it's an object with a 'message' property that's a string, uses that as the message.
 * Otherwise, creates a new Error with the string representation of the value.
 * @param e The value to convert to an Error.
 * @returns An Error instance.
 */
export const as_Error = (e: unknown): Error => {
  if (e instanceof Error) return e
  if (typeof e === 'string') return new Error(e)
  if (e && typeof e === 'object' && 'message' in e && typeof (e as any).message === 'string') {
    return new Error((e as any).message)
  }
  return new Error(String(e))
}