import { IBookmark } from '../schema/bookmarks';
import { ler as err, log_err } from '../utility/logging';
import { TPlatform } from '../common.types';
import axios from 'axios';

/**
 * For the sake of organization, all platform URLs are located in one place.
 */
export const PLATFORM_URL: {[key in TPlatform]: string} = {
  _blank: '',
  youtube: 'https://www.youtube.com/',
  rumble: 'https://rumble.com/',
  odysee: 'https://odysee.com/',
  vimeo: 'https://vimeo.com/',
  dailymotion: 'https://www.dailymotion.com/',
  facebook: 'https://www.facebook.com/',
  bitchute: 'https://www.bitchute.com/',
  twitch: 'https://www.twitch.tv/',
  unknown: ''
};

export async function rumble_fix_missing_data(bookmark: IBookmark): Promise<IBookmark|false> {
  // Get rumble video id
  if (bookmark.slug) {
    const url = new URL(`${PLATFORM_URL['rumble']}${bookmark.slug}.html`);

    // Had to get rid of query string because it was causing errors.
    const compliantUrl = url.origin + url.pathname;

    try {
      const response = await axios.get(compliantUrl, {
        maxRedirects: 5,
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        validateStatus: (status) => status >= 200 && status < 400
      });
      
      const htmlText = await response.data;
      const videoIdMatches = htmlText.match(/"video":"(.*?)"/) ?? [];
      const thumbnailUrlMatches = htmlText.match(
        /<meta property=og:image content=(.+?)>/
      ) ?? [];
      const [ m2, thumbnail_url ] = thumbnailUrlMatches;
      const [ m1, videoid ] = videoIdMatches;
      if (m1 && m2 && videoid && thumbnail_url) {
        return {
          ...bookmark,
          videoid,
          thumbnail_url
        }
      } else {
        err(`failed to parse video ID from rumble url`, videoIdMatches);
      }
    } catch (e) {
      log_err(`Failed to fetch data for rumble bookmark with slug '${bookmark.slug}'`, e);
      return false;
    }
  }
  return false;
}