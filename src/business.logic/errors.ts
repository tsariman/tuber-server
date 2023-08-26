import { IJsonapiError } from '../../../tuber-client/src/controllers/interfaces/IJsonapi'

export const $401_MISSING_ACCESS_TOKEN = {
  'status': '401',
  'title': 'Unauthorized',
  'detail': 'Missing access token in authorization header in format \'Bearer <token>\''
} as IJsonapiError

export const $403_ACCESS_TOKEN_FORBIDDEN = {
  'status': '403',
  'title': 'Forbidden token',
  'detail': 'Token does not have the privilege to access the resource.'
} as IJsonapiError