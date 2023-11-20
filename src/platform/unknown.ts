import axios from 'axios'
import { match_regex_array } from '../business.logic'
import { CONF_THUMB_URL_REGEXP } from 'src/constants'

export async function unknown_fetch_thumbnail_url(url?: string): Promise<string> {
  if (!url) { return '' }
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0'
    }
  })
  const htmlText = await response.data
  const match = match_regex_array(
    htmlText,
    CONF_THUMB_URL_REGEXP
  )
  if (!match) { return '' }
  const [ m2, thumbnail_url ] = match
  if (m2 && thumbnail_url) {
    return thumbnail_url
  }
  return ''
}