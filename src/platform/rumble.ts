import axios from 'axios';
import { PLATFORM_URL } from '.';
import { log, write as print } from '../business.logic/logging';

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
  ];

  for (let i = 0; i < strategies.length; i++) {
    try {
      print(`[DEBUG] [Strategy ${i + 1}] fetch for ${url} ... `);
      const response = await axios.get(url, strategies[i]);

      // If we got a redirect response, try to follow it manually
      if (response.status === 301 || response.status === 302) {
        log('Redirected.')
        const redirectUrl = response.headers.location;
        if (redirectUrl && i === 1) { // Only try manual redirect on second strategy
          log('[DEBUG]', `Manual redirect to: ${redirectUrl}`);
          const redirectResponse = await axios.get(redirectUrl, {
            ...strategies[0],
            maxRedirects: 2
          });
          return redirectResponse.data;
        }
        continue; // Skip this strategy if redirect handling failed
      }
      
      if (response.status === 200) {
        log(`Success.`);
        return response.data;
      }
      
      log(`Failed. [Strategy ${i + 1}] returned status: ${response.status}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      log(`Failed. [Strategy ${i + 1}] returned error: ${errorMessage}`);
      
      // If this is the last strategy, log as error
      if (i === strategies.length - 1) {
        log('[ERROR] All strategies failed.');
      }
    }
    
    // Wait between attempts
    if (i < strategies.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return '';
}

export async function rumble_fetch_html_page(url?: string): Promise<string> {
  if (!url) { return ''; }
  return await robust_rumble_get(url);
}

/**
 * Makes a request to the Rumble video page to obtain the thumbnail URL.
 *
 * @param slug The slug of the Rumble video URL.
 * @returns `Promise<string>`
 */
export async function rumble_fetch_thumbnail_url(slug?: string): Promise<string> {
  if (!slug) { return ''; }
  const urlObj = new URL(`${PLATFORM_URL['rumble']}${slug}.html`);

  // Had to get rid of query string because it was causing errors.
  const compliantUrl = `${urlObj.origin}${urlObj.pathname}`;
  
  try {
    const htmlText = await robust_rumble_get(compliantUrl);
    if (!htmlText) { return ''; }
    
    const matches = htmlText.match(
      /<meta property=og:image content=(.+?)>/
    ) ?? [];
    const [ m2, thumbnail_url ] = matches;
    if (m2 && thumbnail_url) {
      return thumbnail_url;
    }
    return '';
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log('[ERROR]', `Failed to fetch thumbnail for slug ${slug}:`, errorMessage);
    return '';
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
  ) ?? [];
  const [ m2, thumbnail_url ] = matches;
  if (m2 && thumbnail_url) {
    return thumbnail_url;
  }
  return '';
}

/**
 * Makes a request to the Rumble video page to obtain the video ID.
 *
 * @param slug The slug of the Rumble video URL.
 * @returns `Promise<string>`
 */
export async function rumble_fetch_videoid(slug: string): Promise<string> {
  const urlObj = new URL(`${PLATFORM_URL['rumble']}${slug}.html`);

  // Had to get rid of query string because it was causing errors.
  const compliantUrl = `${urlObj.origin}${urlObj.pathname}`;

  try {
    const htmlText = await robust_rumble_get(compliantUrl);
    if (!htmlText) { return ''; }
    
    const matches = htmlText.match(
      /"video":"(.*?)"/
    ) ?? [];
    const [ m2, videoid ] = matches;
    if (m2 && videoid) {
      return videoid;
    }
    return '';
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log('[ERROR]', `Failed to fetch videoid for slug ${slug}:`, errorMessage);
    return '';
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
  ) ?? [];
  const [ m2, videoid ] = matches;
  if (m2 && videoid) {
    return videoid;
  }
  return '';
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
  const urlObj = new URL(`${PLATFORM_URL['rumble']}${slug}.html`);

  // Had to get rid of query string because it was causing errors.
  const compliantUrl = `${urlObj.origin}${urlObj.pathname}`;

  try {
    const htmlText = await robust_rumble_get(compliantUrl);
    if (!htmlText) { return { videoid: '', thumbnail_url: '' }; }
    
    const regexp = new RegExp(
      /"video":"(.*?)"|<meta property=og:image content=(.+?)>/,
      'g'
    );
    const iterator = htmlText.matchAll(regexp);
    const matches = [ ...iterator ];
    const videoid = matches[1]?.[1];
    const thumbnail_url = matches[0]?.[2];
    if (videoid && thumbnail_url) {
      return { videoid, thumbnail_url };
    }
    return { videoid: '', thumbnail_url: '' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log('[ERROR]', `Failed to fetch videoid and thumbnail for slug ${slug}:`, errorMessage);
    return { videoid: '', thumbnail_url: '' };
  }
}