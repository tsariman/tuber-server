import { FastifyRequest } from 'fastify'
import { request } from 'urllib'
import Config from '../config'
import { IGenericObject, IJsonapiQuerystring } from '../common.types'
import axios from 'axios'

/** Returns `true` if the argument is an object. */
export const is_object = (obj: any) => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

/**
 * Convert object into query string with brackets. e.g.
 * ```ts
 * const obj = {
 *   page: {
 *     size: 10,
 *     number: 1
 *   }
 * }
 * ```
 * becomes:
 * ```ts
 * '?page[size]=10&page[number]=1&'
 * ```
 */
export const bracketize_object_querystring = (
  obj: any,
  parentKey = '?',
  depth = 0
): string => {
  if (!is_object(obj)) return obj
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key]
    if (is_object(value)) {
      parentKey = depth === 0 ? key : `${parentKey}[${key}]`
      return acc + bracketize_object_querystring(
        value, parentKey, depth + 1
      )
    }
    const bracketizedKey = depth === 0 ? key : `${parentKey}[${key}]`
    return acc + `${bracketizedKey}=${value}&`
  }, depth === 0 ? parentKey : '')
}

/** Insert state fragment using `_key` as key. */
export const set_state_by_key = (
  state: IGenericObject,
  fragment: IGenericObject
) => {
  const _key = fragment['_key']
  if (!_key) Config.die('Fragment must have a `_key`.')
  state[_key] = fragment
}

/** Retrieve the value of `_key` from state. */
export const get_state_key = (state: IGenericObject): string => {
  const _key: string = state['_key']
  if (!_key) Config.die('Fragment must have a `_key`.')
  return _key
}

/** Get query string value */
export const get_query = (
  req: FastifyRequest,
  key: keyof IJsonapiQuerystring,
  $default = ''
): string => {
  try {
    const query = req.query as IJsonapiQuerystring
    return query[key] ?? $default
  } catch (e: any) {
    Config.err(e.message)
  }
  return $default
}

/** Convert milliseconds to seconds or minutes */
export const ms_to_seconds = (ms: number) => {
  const seconds = ms / 1000
  if (seconds < 60) return `${seconds.toFixed(2)}s`
  const minutes = seconds / 60
  return `${minutes.toFixed(2)}m`
}

/** Return a limited number of document in an array if its length exceed the provided limit */
export const limit_array = <T=any>(arr: T[], limit: number): T[] => {
  return arr.length > limit ? arr.slice(0, limit) : arr
}

/** Check if collection search index exist for Mongodb Atlas. */
export async function find_index_by_name(indexName: string, collectionName: string) {
  const allIndexesResponse = await request(
    `${Config.DB_ATLAS_SEARCH_INDEX_API_URL}/${Config.DB_NAME}/${collectionName}`,
    {
      dataType: 'json',
      contentType: 'application/json',
      method: 'GET',
      digestAuth: Config.DB_ATLAS_DIGEST_AUTH
    }
  )
  return (allIndexesResponse.data as any[]).find(i => i.name === indexName)
}

/**
 * Get the date of the given time.
 *
 * @param time in milliseconds
 * @returns new `Date` object.
 */
export function get_expiration_date(time: number) {
  const newTimeInMs = Date.now() + time
  const newDate = new Date()
  newDate.setTime(newTimeInMs)
  return newDate
}

export async function fetch_html_page(url?: string): Promise<string> {
  if (!url) { return '' }
  const response = await axios.get(url)
  const htmlText = response.data
  return htmlText
}

/**
 * Given an array of regular expression, iterate and execute each regular
 * expression in sequential order on the given string.
 * Once there's a match, return the match.
 */
export function match_regex_array(
  str: string,
  regexArray: RegExp[]
): RegExpMatchArray | null {
  for (const regex of regexArray) {
    const match = str.match(regex)
    if (match) {
      Config.log(`Matched: ${regex}`)
      return match
    }
  }
  return null
}
