import { FastifyRequest } from 'fastify'
import JsonapiRequestDriver from './JsonapiRequestDriver'
import { TThemeMode } from '@tuber/shared'
import { is_object, parse_cookie } from '../utility'
import { task, dbug, errr } from '../utility/logging'
import Config from '../config'
import { TContextualUser } from '../schema/user'
import { USER_CACHE } from './cache'
import { read_user_by_name } from '../model/user'
import { is_token_blacklisted } from '../model/blacklisted.token'

interface ICookie {
  token?: string
  theme_mode?: TThemeMode
}

interface IValidationResult {
  authorized: boolean
  reason?: 'token_revoked' | 'jwt_version_mismatch' | 'user_not_found' | 'token_expired'
}

export default class OnRequestAuthorization {
  static BROWSER_PATTERNS = [
    /Mozilla\/\d+\.\d+ \((Windows|Macintosh|Linux|Android|iPhone|iPad);/,
    /AppleWebKit\/\d+\.\d+ \(KHTML, like Gecko\) Chrome\/\d+\.\d+\.\d+\.\d+ Safari\/\d+\.\d+/,
    /mozilla/i,
    /chrome/i,
    /safari/i,
    /firefox/i,
    /edge/i,
    /opera/i,
    /msie/i,
    /trident/i // IE11
  ]
  private _request: FastifyRequest
  private _parsedCookie: ICookie
  private _blacklistEnabled: boolean

  constructor(request: FastifyRequest) {
    this._request = request
    this._parsedCookie = request.headers.cookie 
      ? parse_cookie(request.headers.cookie)
      : { token: '', theme_mode: Config.DEFAULT_THEME_MODE }
    this._blacklistEnabled = true
  }

  /**
   * Set the theme mode on the request object by extracting it from cookies.
   * Defaults to `Config.DEFAULT_THEME_MODE` if not set in cookies.
   * @returns void
   */
  private _setThemeMode(): void {
    this._request.themeMode = this._parsedCookie.theme_mode || Config.DEFAULT_THEME_MODE
  }
  
  /**
   * Determine if the request is from a browser and set the flag on the request
   * object.
   * That information can be used later to adjust responses accordingly.
   * @returns void
   */
  private _setIsFromBrowser(): void {
    // Check if any browser pattern matches
    const hasBrowserUA = OnRequestAuthorization.BROWSER_PATTERNS.some(
      pattern => pattern.test(this._request.headers['user-agent'] ?? '')
    )
    // Additional check: browsers typically send 'Accept' header with 'text/html'
    const accept = this._request.headers['accept'] || ''
    const acceptsHtml = accept.includes('text/html')
    this._request.isFromBrowser = hasBrowserUA && acceptsHtml
  }

  /**
   * Set the JWT token on the request object by extracting it from
   * the Authorization header, cookies, or JSON API request body.
   * @returns void
   */
  private _setToken(): void {
    task('Extract JWT token from Authorization header ')
    let token = this._request.headers.authorization?.replace('Bearer ', '')
    if (token) {
      this._request.token = token
      task.end('[✔️]')
      return
    }
    task.end('[❌]')
    task('Extract JWT token from cookies ')
    token = this._parsedCookie.token
    if (token) {
      this._request.token = token
      task.end('[✔️]')
      return
    }
    task.end('[❌]')
    task('Extract cookie from JSON API request body ')
    if (is_object(this._request.body) && Object.keys(this._request.body).length > 0) {
      const driver = new JsonapiRequestDriver<{ cookie?: string }>(this._request.body)
      const cookie = driver.getAttribute('cookie')
      if (cookie) {
        const parsed = parse_cookie(cookie)
        token = parsed.token
        if (token) {
          this._request.token = token
          task.end('[✔️]')
          return
        }
      }
    }
    task.end('[❌]')
    dbug('No JWT token found in Authorization header, cookies, or request body')
  }

  /**
   * Set the contextual user on the request object by verifying the JWT token.
   * Call `setToken()` before using this method.
   * @returns void
   */
  private async _setContextualUser(): Promise<void> {
    // The @fastify/jwt plugin with cookie configuration should automatically check both
    // Authorization header and cookies when jwtVerify() is called
    const payload = await this._request.jwtVerify()
    if (payload) {
      this._request.usr = payload as TContextualUser
    }
  }

  /**
   * Check if the JWT token on the request is blacklisted.
   * Call `setToken()` before using this method.
   * @returns boolean - `true` if the token is blacklisted, `false` otherwise.
   */
  private async _tokenIsBlacklisted(): Promise<boolean> {
    task('Checking if JWT token is blacklisted ')
    if (!this._request.token || process.env.ENABLE_TOKEN_BLACKLIST !== 'true') {
      task.end(process.env.ENABLE_TOKEN_BLACKLIST !== 'true' ? '[⚠️]' : '[❌]')
      return false
    }
    const result = await is_token_blacklisted(this._request.token)
    task.end(result ? '[❌]' : '[✔️]')
    return result
  }

  /**
   * Validate the request by ensuring the contextual user is set and
   * enforcing JWT version matching against the current user document.
   * @returns IValidationResult - The result of the validation.
   */
  private async _validateRequest(): Promise<IValidationResult> {
    if (!this._request.usr) {
      errr('No contextual user found on request. Authorization failed.')
      return { authorized: false, reason: 'user_not_found' }
    }
    const username = this._request.usr.name
    if (username) {
      task(`Acquiring token version for '${username}' user `)
      // Try cache first
      const cached = USER_CACHE.get(username) as { jwt_version?: number } | undefined
      let currentVersion = cached?.jwt_version
      if (typeof currentVersion !== 'number') {
        const user = await read_user_by_name(username)
        currentVersion = user?.jwt_version
        if (user) {
          USER_CACHE.set(user.name, user)
        } else {
          task.end('[❌]')
          dbug(`User '${username}' not found. Token invalidated.`)
          this._request.usr = undefined
          this._request.token = undefined
          return { authorized: false, reason: 'user_not_found' }
        }
      }
      task.end('[✔️]')
      // Enforce JWT version matching against current user document
      const tokenVersion = this._request.usr.jwt_version ?? 0
      task(`Enforcing JWT version for '${username}' user `)
      if (typeof currentVersion === 'number' && tokenVersion !== currentVersion) {
        this._request.usr = undefined
        this._request.token = undefined
        task.end('[❌]')
        errr(`JWT version mismatch: token version ${tokenVersion} vs current version ${currentVersion}. Token invalidated.`)
        return { authorized: false, reason: 'jwt_version_mismatch'  }
      }
    } else {
      // This should not happen as name is required in TContextualUser
      throw new Error('Contextual user has no name property')
    }
    task.end('[✔️]')
    return { authorized: true }
  }

  /**
   * Authorize the incoming request by performing token extraction,
   * blacklist checking, contextual user setting, and validation.
   * @returns IValidationResult - The result of the authorization process.
   */
  async authorizeRequest(): Promise<IValidationResult> {
    this._setToken()
    this._setThemeMode()
    this._setIsFromBrowser()
    if (this._blacklistEnabled && await this._tokenIsBlacklisted()) {
      this._request.usr = undefined
      this._request.token = undefined
      dbug('Token is blacklisted. Access revoked.')
      return { authorized: false, reason: 'token_revoked' }
    }
    // JWT Throws an exception on following line if authentication fails ======
    await this._setContextualUser()
    // If an exception was thrown, following code will not execute ============
    const result = await this._validateRequest()
    if (!result.authorized) {
      this._request.usr = undefined
      this._request.token = undefined
      return result
    }
    return { authorized: true  }
  }

  /**
   * Disable token blacklist checking for this authorization instance.
   * @returns OnRequestAuthorization - The current instance for chaining.
   */
  disableBlacklist() {
    this._blacklistEnabled = false
    return this
  }
}