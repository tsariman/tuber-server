import axios from 'axios'
import { PLATFORM_URL } from '.'
import { dbug, errr, log_err, task, task_end } from '../utility/logging'
import { to_error_object } from '../utility'

/**
 * Helper function to make robust HTTP requests to Rumble with anti-bot measures
 */
async function robust_rumble_get(url: string): Promise<string> {
  // Try multiple times with different strategies
  const strategies = [
    {
      maxRedirects: 3,
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    },
    {
      maxRedirects: 0, // No redirects - get the redirect response directly
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      validateStatus: (status: number) => status >= 200 && status < 400 || status === 301 || status === 302
    }
  ]

  for (let i = 0; i < strategies.length; i++) {
    try {
      task(`[Strategy ${i + 1}] fetch for ${url} ... `)
      const response = await axios.get(url, strategies[i])

      // If we got a redirect response, try to follow it manually
      if (response.status === 301 || response.status === 302) {
        task_end('Redirected.')
        const redirectUrl = response.headers.location
        if (redirectUrl && i === 1) { // Only try manual redirect on second strategy
          dbug(`Manual redirect to: ${redirectUrl}`)
          const redirectResponse = await axios.get(redirectUrl, {
            ...strategies[0],
            maxRedirects: 2
          })
          return redirectResponse.data
        }
        continue // Skip this strategy if redirect handling failed
      }
      
      if (response.status === 200) {
        task.end(`Success.`)
        return response.data
      }
      
      task_end(`Failed.[INFO][${response.status}] [Strategy ${i + 1}]`)
    } catch (e) {
      const error = to_error_object(e)
      task_end(`Failed.\n[ERROR][500] [Strategy ${i + 1}] returned error: ${error.message}`)

      // If this is the last strategy, log as error
      if (i === strategies.length - 1) {
        errr('All strategies failed.')
        log_err('retrieving Rumble thumbnail', error)
      }
    }
    
    // Wait between attempts
    if (i < strategies.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  return ''
}

export async function rumble_fetch_html_page(url?: string): Promise<string> {
  if (!url) { return '' }
  return await robust_rumble_get(url)
}

/**
 * Makes a request to the Rumble video page to obtain the thumbnail URL.
 *
 * @param slug The slug of the Rumble video URL.
 * @returns `Promise<string>`
 */
export async function rumble_fetch_thumbnail_url(slug?: string): Promise<string> {
  if (!slug) { return '' }
  const urlObj = new URL(`${PLATFORM_URL['rumble']}/${slug}.html`)

  // Had to get rid of query string because it was causing errors.
  const compliantUrl = `${urlObj.origin}${urlObj.pathname}`
  
  try {
    const htmlText = await robust_rumble_get(compliantUrl)
    if (!htmlText) { return '' }
    
    const matches = htmlText.match(
      /<meta property=og:image content=(.+?)>/
    ) ?? []
    const [ m2, thumbnail_url ] = matches
    if (m2 && thumbnail_url) {
      return thumbnail_url
    }
    return ''
  } catch (e) {
    const error = to_error_object(e)
    errr(`Failed to fetch thumbnail for slug ${slug}:`, error.message)
    log_err(`fetching Rumble thumbnail`, error)
    return ''
  }
}

/**
 * Extract thumbnail URL from a Rumble video HTML page.
 *
 * @param html The HTML page of a Rumble video.
 * @returns `Promise<string>`
 */
export function rumble_parse_thumbnail_url(html: string): string {
  const matches = html.match(
    /<meta property=og:image content=(.+?)>/
  ) ?? []
  const [ m2, thumbnail_url ] = matches
  if (m2 && thumbnail_url) {
    return thumbnail_url
  }
  return ''
}

/**
 * Makes a request to the Rumble video page to obtain the video ID.
 *
 * @param slug The slug of the Rumble video URL.
 * @returns `Promise<string>`
 */
export async function rumble_fetch_videoid(slug: string): Promise<string> {
  const urlObj = new URL(`${PLATFORM_URL['rumble']}/${slug}.html`)

  // Had to get rid of query string because it was causing errors.
  const compliantUrl = `${urlObj.origin}${urlObj.pathname}`

  try {
    const htmlText = await robust_rumble_get(compliantUrl)
    if (!htmlText) { return '' }
    
    const matches = htmlText.match(
      /"video":"(.*?)"/
    ) ?? []
    const [ m2, videoid ] = matches
    if (m2 && videoid) {
      return videoid
    }
    return ''
  } catch (e) {
    const error = to_error_object(e)
    errr(`Failed to fetch videoid for slug ${slug}:`, error.message)
    log_err(`fetching Rumble videoid`, error)
    return ''
  }
}

/**
 * Extract videoid from a Rumble video HTML page.
 *
 * @param html The HTML page of a Rumble video.
 * @returns `Promise<string>`
 */
export function rumble_parse_videoid (html: string): string {
  const matches = html.match(
    /"video":"(.*?)"/
  ) ?? []
  const [ m2, videoid ] = matches
  if (m2 && videoid) {
    return videoid
  }
  return ''
}

/**
 * Makes a request to the Rumble video page to obtain the video ID and the
 * thumbnail URL.
 *
 * @param slug The slug of the Rumble video URL.
 * @returns `Promise<{ videoid: string, thumbnail_url: string }>`
 * @deprecated
 */
export async function rumble_fetch_videoid_thumbnail(
  slug: string
): Promise<{ videoid: string, thumbnail_url: string }> {
  const urlObj = new URL(`${PLATFORM_URL['rumble']}/${slug}.html`)

  // Had to get rid of query string because it was causing errors.
  const compliantUrl = `${urlObj.origin}${urlObj.pathname}`

  try {
    const htmlText = await robust_rumble_get(compliantUrl)
    if (!htmlText) { return { videoid: '', thumbnail_url: '' } }
    
    const regexp = new RegExp(
      /"video":"(.*?)"|<meta property=og:image content=(.+?)>/,
      'g'
    )
    const iterator = htmlText.matchAll(regexp)
    const matches = [ ...iterator ]
    const videoid = matches[1]?.[1]
    const thumbnail_url = matches[0]?.[2]
    if (videoid && thumbnail_url) {
      return { videoid, thumbnail_url }
    }
    return { videoid: '', thumbnail_url: '' }
  } catch (e) {
    const error = to_error_object(e)
    errr(`Failed to fetch videoid and thumbnail for slug ${slug}:`, error.message)
    log_err(`fetching Rumble videoid`, error)
    return { videoid: '', thumbnail_url: '' }
  }
}

/**
 * Fetches video data using Rumble's oEmbed API (more efficient than scraping HTML).
 *
 * @param slug The slug of the Rumble video URL.
 * @returns `Promise<{ videoid: string, thumbnail_url: string }>`
 */
export async function rumble_fetch_oembed_data(slug: string): Promise<{ videoid: string, thumbnail_url: string }> {
  if (!slug) { return { videoid: '', thumbnail_url: '' } }

  const oembedUrl = `https://rumble.com/api/Media/oEmbed.json?url=https://rumble.com/${slug}.html`

  try {
    task(`Fetching oEmbed data for Rumble slug '${slug}'... `)
    const response = await axios.get(oembedUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })
    const data = response.data
    // #1 data is serialized JSON
    // #2 data does not have 'html' and 'thumbnail_url' fields
    // #3 The serialized JSON contains the "error" property:
    //    "error":{"msg":"You must be signed in to perform this action"}}
    const thumbnail_url = data.thumbnail_url || ''

    // Extract videoid from the embed URL in the HTML field
    const html = data.html || ''
    const embedMatch = html.match(/rumble\.com\/embed\/([^\/]+)\//)
    const videoid = embedMatch ? embedMatch[1] : ''

    task_end('Done ✔️')
    return { videoid, thumbnail_url }
  } catch (e) {
    task_end('Failed ❌')
    const error = to_error_object(e)
    errr(`Failed to fetch oEmbed data for slug ${slug}: ${error.message}`)
    log_err(`fetching Rumble oEmbed`, error)
    return { videoid: '', thumbnail_url: '' }
  }
}