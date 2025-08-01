import { IBookmark, TBookmarkFrag } from '../schema/bookmarks';
import { TPlatform } from '../common.types';
import {
  rumble_parse_videoid,
  rumble_fetch_html_page,
  rumble_parse_thumbnail_url,
  rumble_fetch_thumbnail_url
} from './rumble';
import { twitch_fetch_thumbnail_url } from './twitch';
import { vimeo_fetch_thumbnail_url } from './vimeo';
import { odysee_fetch_thumbnail_url } from './odysee';
import { unknown_fetch_thumbnail_url } from './unknown';
import { PLATFORM_URL } from '.';
import get_bookmark_by_slug from '../model/bookmark/get.bookmark.by.slug';
import get_bookmark_by_videoid from '../model/bookmark/get.bookmark.by.videoid';
import { log, write as print } from '../business.logic/logging';
import { TCipheredUser } from '../schema/users';

/**
 * Fill-in missing data for a bookmark.
 * @param attributes The bookmark object.
 * @returns `Promise<IBookmark|null>`
 */
export default async function fix_missing_bookmark_data (
  attributes?: IBookmark,
  usr?: TCipheredUser
): Promise<IBookmark|null> {
  if (!attributes) { return null; }
  const map: Record<TPlatform, () => Promise<IBookmark|null>> = {
    _blank: async () => null,
    youtube: async () => _youtube_data(attributes, usr),
    rumble: async () => _rumble_data(attributes, usr),
    odysee: async () => _odysee_data(attributes, usr),
    vimeo: async () => _vimeo_data(attributes, usr),
    dailymotion: async () => _dailymotion_data(attributes, usr),
    facebook: async () => _facebook_data(attributes, usr),
    bitchute: async () => null, // TODO BitChute not supported yet.
    twitch: async () => _twitch_data(attributes, usr),
    unknown: async () => _unknown_data(attributes, usr),
  };
  return map[attributes.platform as TPlatform]();
}

/**
 * Get thumbnail url for a video of supported platform.
 * @param body The bookmark object.
 * @returns `Promise<string>`
 */
export function get_video_thumbnail_url (body: TBookmarkFrag) {
  const map: Record<TPlatform, () => Promise<string>> = {
    _blank: async () => '',
    youtube: async () => body.thumbnail_url
      ?? `https://img.youtube.com/vi/${body.videoid}/0.jpg`,
    rumble: async () => await rumble_fetch_thumbnail_url(body.slug),
    odysee: async () => await odysee_fetch_thumbnail_url(body.slug),
    vimeo: async () => await vimeo_fetch_thumbnail_url(body.videoid),
    dailymotion: async () => body.thumbnail_url
      ?? `https://www.dailymotion.com/thumbnail/video/${body.videoid}`,
    facebook: async () => body.thumbnail_url ?? '',
    bitchute: async () => body.thumbnail_url ?? '',
    twitch: async () => await twitch_fetch_thumbnail_url(body.videoid),
    unknown: async () => await unknown_fetch_thumbnail_url(body.url)
  };
  return map[body.platform as TPlatform]();
}

async function _youtube_data(
  attr: IBookmark,
  usr?: TCipheredUser
): Promise<IBookmark|null> {
  if (attr.user_id) { return attr; }
  const { videoid } = attr;
  if (!videoid || !usr || !usr._id) { return null; }
  const fixedBookmark = { ...attr, user_id: usr?._id } as IBookmark;
  return fixedBookmark;
}

async function _dailymotion_data(
  attr: IBookmark,
  usr?: TCipheredUser
): Promise<IBookmark|null> {
  if (attr.user_id) { return attr; }
  const { videoid } = attr;
  if (!videoid || !usr || !usr._id) { return null; }
  const fixedBookmark = { ...attr, user_id: usr?._id } as IBookmark;
  return fixedBookmark;
}

async function _rumble_data(
  attr: IBookmark,
  usr?: TCipheredUser
): Promise<IBookmark|null> {
  const { slug } = attr;
  if (!slug || !usr || !usr._id) { return null; }
  
  try {
    const urlObj = new URL(`${PLATFORM_URL['rumble']}${slug}.html`);
    const fixedBookmark = { ...attr, user_id: usr._id } as IBookmark;

    if (!fixedBookmark.thumbnail_url) {
      // Search database for a bookmark with the same slug then get the videoid and
      // thumbnail_url from it.
      const existingBookmark = await get_bookmark_by_slug(slug);
      if (existingBookmark
        && existingBookmark.videoid
        && existingBookmark.thumbnail_url
      ) {
        fixedBookmark.videoid = existingBookmark.videoid;
        fixedBookmark.thumbnail_url = existingBookmark.thumbnail_url;
      }
      // If the bookmark is not in the database, then fetch the videoid and
      // thumbnail_url from the web page.
      else {
        // Had to get rid of query string because it was causing errors.
        const compliantUrl = `${urlObj.origin}${urlObj.pathname}`;
        const html = await rumble_fetch_html_page(compliantUrl);
        if (!html) { 
          log(`[ERROR] Failed to fetch HTML for Rumble URL: ${compliantUrl}`);
          return null; 
        }
        
        const parsedVideoid = rumble_parse_videoid(html);
        const parsedThumbnail = rumble_parse_thumbnail_url(html);
        
        if (parsedVideoid) {
          fixedBookmark.videoid = parsedVideoid;
        }
        if (parsedThumbnail) {
          fixedBookmark.thumbnail_url = parsedThumbnail;
        }
      }
    }

    // Return bookmark if we have at least a thumbnail_url (consistent with other platforms)
    if (fixedBookmark.thumbnail_url) {
      return fixedBookmark;
    }
    
    log(`[WARNING] Could not fetch required data for Rumble bookmark with slug: ${slug}`);
    return null;
  } catch (error) {
    log(`[ERROR] Error processing Rumble bookmark with slug '${slug}':`, error);
    return null;
  }
}

async function _twitch_data(
  attr: IBookmark,
  usr?: TCipheredUser
): Promise<IBookmark|null> {
  const { videoid } = attr;
  if (!videoid || !usr || !usr._id) { return null; }
  const fixedBookmark = { ...attr, user_id: usr._id } as IBookmark;

  if (!fixedBookmark.thumbnail_url) {
    const existingBookmark = await get_bookmark_by_videoid(videoid);
    if (existingBookmark && existingBookmark.thumbnail_url) {
      fixedBookmark.thumbnail_url = existingBookmark.thumbnail_url;
    } else {
      print(`[DEBUG] Fetching Twitch thumbnail URL for video with ID '${videoid}'... `);
      fixedBookmark.thumbnail_url = await twitch_fetch_thumbnail_url(videoid);
    }
  }

  if (fixedBookmark.thumbnail_url) {
    return fixedBookmark;
  }
  return null;
}

async function _vimeo_data(
  attr: IBookmark,
  usr?: TCipheredUser
): Promise<IBookmark|null> {
  const { videoid } = attr;
  if (!videoid || !usr || !usr._id) { return null; }
  const fixedBookmark = { ...attr, user_id: usr._id } as IBookmark;

  if (!fixedBookmark.thumbnail_url) {
    const existingBookmark = await get_bookmark_by_videoid(videoid);
    if (existingBookmark && existingBookmark.thumbnail_url) {
      fixedBookmark.thumbnail_url = existingBookmark.thumbnail_url;
    } else {
      print(`[DEBUG] Fetching vimeo thumbnail url for '${videoid}' video ID... `);
      fixedBookmark.thumbnail_url = await vimeo_fetch_thumbnail_url(videoid);
    }
  }

  if (fixedBookmark.thumbnail_url) {
    return fixedBookmark;
  }
  return null;
}

async function _odysee_data(
  attr: IBookmark,
  usr?: TCipheredUser
): Promise<IBookmark|null> {
  const { slug } = attr;
  if (!slug || !usr || !usr._id) { return null; }
  const fixedBookmark = { ...attr, user_id: usr._id } as IBookmark;

  if (!fixedBookmark.thumbnail_url) {
    const existingBookmark = await get_bookmark_by_slug(slug);
    if (existingBookmark && existingBookmark.thumbnail_url) {
      fixedBookmark.thumbnail_url = existingBookmark.thumbnail_url;
    } else {
      print(`[DEBUG] Fetching Odysee thumbnail url for '${slug}' slug... `);
      fixedBookmark.thumbnail_url = await odysee_fetch_thumbnail_url(slug);
    }
  }

  if (fixedBookmark.thumbnail_url) {
    return fixedBookmark;
  }
  return null;
}

async function _unknown_data(
  attr: IBookmark,
  usr?: TCipheredUser
): Promise<IBookmark|null> {
  const { url } = attr;
  if (!url || !usr || !usr._id) { return null; }
  const fixedBookmark = {
    ...attr,
    user_id: usr._id,
    is_published: undefined // Enforces the policy that unknown bookmarks cannot be published.
  } as IBookmark;
  if (!fixedBookmark.thumbnail_url) {
    print(`[DEBUG] Fetching thumbnail url for '${url}' URL... `);
    fixedBookmark.thumbnail_url = await unknown_fetch_thumbnail_url(url);
  }
  return fixedBookmark;
}

async function _facebook_data(
  attr: IBookmark,
  usr?: TCipheredUser
): Promise<IBookmark|null> {
  const { url } = attr;
  if (!url || !usr || !usr._id) { return null; }
  const fixedBookmark = { ...attr, user_id: usr._id } as IBookmark;
  if (!fixedBookmark.thumbnail_url) {
    print(`[DEBUG] Fetching thumbnail url for '${url}' URL... `);
    fixedBookmark.thumbnail_url = await unknown_fetch_thumbnail_url(url);
    if (fixedBookmark.thumbnail_url) {
      log(`Done. Got '${fixedBookmark.thumbnail_url}'.`);
    } else {
      log(`Failed.`);
    }
  }
  return fixedBookmark;
}
