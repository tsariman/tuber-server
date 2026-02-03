import { TContextualUser } from '../../schema/user'
import { TThemeMode } from '@tuber/shared'

declare module 'fastify' {
  interface FastifyRequest {
    token?: string
    usr?: TContextualUser
    cookie?: string
    isFromBrowser?: boolean
    themeMode?: TThemeMode
  }
}
