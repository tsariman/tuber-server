import { IJsonapiError } from '../../../tuber-client/src/controllers/interfaces/IJsonapi'

export const MONGODB_DUPLICATE_KEY_ERROR = 'E11000'

export const $401_MISSING_ACCESS_TOKEN = {
  'status': '401',
  'title': 'Unauthorized',
  'detail': 'Missing access token in authorization header in format \'Bearer <token>\''
} as IJsonapiError

export const $401_UNAUTHORIZED_ACCESS = {
  'status': '401',
  'title': 'Unauthorized',
  'detail': 'Unauthorized access to resource.'
} as IJsonapiError

export const $403_ACCESS_TOKEN_FORBIDDEN = {
  'status': '403',
  'title': 'Forbidden token',
  'detail': 'Token does not have the privilege to access the resource.'
} as IJsonapiError

export const $400_MISSING_PAYLOAD = {
  'status': '400',
  'title': 'Missing payload',
  'detail': 'Although the token was valid, payload was unavailable.'
} as IJsonapiError

/** Extract error code from a mongodb error message  */
export const get_mongodb_error = (message: string): {
  code: string;
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
}
