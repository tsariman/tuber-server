import { IBookmark, TBookmarkFrag } from '../schema/bookmark'
import { TPlatform } from '../common.types'
import {
  rumble_parse_videoid,
  rumble_fetch_html_page,
  rumble_parse_thumbnail_url,
  rumble_fetch_thumbnail_url
} from './rumble'
import { twitch_fetch_thumbnail_url } from './twitch'
import { vimeo_fetch_thumbnail_url } from './vimeo'
import { odysee_fetch_thumbnail_url } from './odysee'
import { unknown_fetch_thumbnail_url } from './unknown'
import get_bookmark_by_slug from '../model/bookmark/get.bookmark.by.slug'
import get_bookmark_by_videoid from '../model/bookmark/get.bookmark.by.videoid'
import { errr, log_err, task, task_end, warn } from '../utility/logging'
import { TContextualUser } from '../schema/user'
import { PLATFORM_URL } from '.'

/**
 * Fill-in missing data for a bookmark.
 * @param attributes The bookmark object.
 * @returns `Promise<IBookmark|null>`
 */
export default async function fix_missing_bookmark_data (
  attributes?: IBookmark,
  usr?: TContextualUser
): Promise<IBookmark|null> {
  if (!attributes) { return null }
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
  }
  return map[attributes.platform]()
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
  }
  if (body.platform) {
    return map[body.platform]()
  }
  throw new Error('get_video_thumbnail_url(): Undefined bookmark platform')
}

async function _youtube_data(
  attributes: IBookmark,
  usr?: TContextualUser
): Promise<IBookmark|null> {
  if (!attributes.videoid || !usr || !usr._id) { return null }
  if (attributes.user_id) { return attributes }
  const fixedBookmark = { ...attributes, user_id: usr._id } as IBookmark
  return fixedBookmark
}

async function _dailymotion_data(
  attributes: IBookmark,
  usr?: TContextualUser
): Promise<IBookmark|null> {
  if (!attributes.videoid || !usr || !usr._id) { return null }
  if (attributes.user_id) { return attributes }
  const fixedBookmark = { ...attributes, user_id: usr._id } as IBookmark
  return fixedBookmark
}

async function _rumble_data(
  attributes: IBookmark,
  usr?: TContextualUser
): Promise<IBookmark|null> {
  const { platform, slug } = attributes
  if (!slug || !usr || !usr._id) { return null }

  try {
    const urlObj = new URL(`${PLATFORM_URL['rumble']}/${slug}.html`)
    const fixedBookmark = { ...attributes, user_id: usr._id } as IBookmark
    if (!fixedBookmark.thumbnail_url) {
      // Search database for a bookmark with the same slug then get the videoid and
      // thumbnail_url from it.
      const existingBookmark = await get_bookmark_by_slug(slug)
      if (existingBookmark
        && existingBookmark.videoid
        && existingBookmark.thumbnail_url
      ) {
        fixedBookmark.videoid = existingBookmark.videoid
        fixedBookmark.thumbnail_url = existingBookmark.thumbnail_url
      }
      // If the bookmark is not in the database, then fetch the videoid and
      // thumbnail_url from the web page.
      else {
        // Had to get rid of query string because it was causing errors.
        const compliantUrl = `${urlObj.origin}${urlObj.pathname}`
        const html = await rumble_fetch_html_page(compliantUrl)
        if (!html) { 
          errr(`Failed to fetch HTML for Rumble URL: ${compliantUrl}`)
          return null 
        }
        
        const parsedVideoid = rumble_parse_videoid(html)
        const parsedThumbnail = rumble_parse_thumbnail_url(html)
        
        if (parsedVideoid) {
          fixedBookmark.videoid = parsedVideoid
        }
        if (parsedThumbnail) {
          fixedBookmark.thumbnail_url = parsedThumbnail
        }
      }
    }

    // Return bookmark if we have at least a thumbnail_url (consistent with other platforms)
    if (fixedBookmark.thumbnail_url) {
      return fixedBookmark
    }
    
    warn(`Could not fetch required data for [${platform}] bookmark with slug: ${slug}`)
  } catch (e) {
    errr(`Processing [${platform}] bookmark with slug '${slug}'`)
    log_err(`Processing [${platform}] bookmark`, e)
  }
  return null
}

async function _twitch_data(
  attributes: IBookmark,
  usr?: TContextualUser
): Promise<IBookmark|null> {
  const { platform, videoid } = attributes
  if (!videoid || !usr || !usr._id) { return null }

  try {
    const fixedBookmark = { ...attributes, user_id: usr._id } as IBookmark
    if (!fixedBookmark.thumbnail_url) {
      const existingBookmark = await get_bookmark_by_videoid(videoid)
      if (existingBookmark && existingBookmark.thumbnail_url) {
        fixedBookmark.thumbnail_url = existingBookmark.thumbnail_url
      } else {
        task(`Fetching [${platform}] thumbnail URL for video with ID '${videoid}'... `)
        fixedBookmark.thumbnail_url = await twitch_fetch_thumbnail_url(videoid)
        task_end('Done.')
      }
    }
    if (fixedBookmark.thumbnail_url) {
      return fixedBookmark
    }
  } catch (e) {
    errr(`Processing [${platform}] bookmark with videoid '${videoid}'`)
    log_err(`Processing [${platform}] bookmark`, e)
  }
  return null
}

async function _vimeo_data(
  attributes: IBookmark,
  usr?: TContextualUser
): Promise<IBookmark|null> {
  const { platform, videoid } = attributes
  if (!videoid || !usr || !usr._id) { return null }
  try {
    const fixedBookmark = { ...attributes, user_id: usr._id } as IBookmark
    if (!fixedBookmark.thumbnail_url) {
      const existingBookmark = await get_bookmark_by_videoid(videoid)
      if (existingBookmark && existingBookmark.thumbnail_url) {
        fixedBookmark.thumbnail_url = existingBookmark.thumbnail_url
      } else {
        task(`Fetching [${platform}] thumbnail url for '${videoid}' video ID... `)
        fixedBookmark.thumbnail_url = await vimeo_fetch_thumbnail_url(videoid)
      }
    }
    if (fixedBookmark.thumbnail_url) {
      return fixedBookmark
    }
  } catch (e) {
    errr(`Processing [${platform}] bookmark with videoid '${videoid}'`)
    log_err(`Processing [${platform}] bookmark`, e)
  }
  return null
}

async function _odysee_data(
  attributes: IBookmark,
  usr?: TContextualUser
): Promise<IBookmark|null> {
  const { platform, slug } = attributes
  if (!slug || !usr || !usr._id) { return null }
  const fixedBookmark = { ...attributes, user_id: usr._id } as IBookmark
  try {
    if (!fixedBookmark.thumbnail_url) {
      const existingBookmark = await get_bookmark_by_slug(slug)
      if (existingBookmark && existingBookmark.thumbnail_url) {
        fixedBookmark.thumbnail_url = existingBookmark.thumbnail_url
      } else {
        task(`Fetching Odysee thumbnail url for '${slug}' slug... `)
        fixedBookmark.thumbnail_url = await odysee_fetch_thumbnail_url(slug)
      }
    }
    if (fixedBookmark.thumbnail_url) {
      return fixedBookmark
    }
  } catch (e) {
    errr(`Processing [${platform}] bookmark with slug '${slug}'`)
    log_err(`Processing [${platform}] bookmark`, e)
  }
  return null
}

async function _unknown_data(
  attributes: IBookmark,
  usr?: TContextualUser
): Promise<IBookmark|null> {
  const { platform, url } = attributes
  if (!url || !usr || !usr._id) { return null }
  try {
    const fixedBookmark = {
      ...attributes,
      user_id: usr._id,
      is_published: undefined // Enforces the policy that unknown bookmarks cannot be published.
    } as IBookmark
    if (!fixedBookmark.thumbnail_url) {
      task(`Fetching thumbnail url for '${url}' URL... `)
      fixedBookmark.thumbnail_url = await unknown_fetch_thumbnail_url(url)
    }
    return fixedBookmark
  } catch (e) {
    errr(`Processing [${platform}] bookmark with URL '${url}'`)
    log_err(`Processing [${platform}] bookmark`, e)
  }
  return null
}

async function _facebook_data(
  attributes: IBookmark,
  usr?: TContextualUser
): Promise<IBookmark|null> {
  const { platform, url } = attributes
  if (!url || !usr || !usr._id) { return null }
  try {
    const fixedBookmark = { ...attributes, user_id: usr._id } as IBookmark
    if (!fixedBookmark.thumbnail_url) {
      task(`Fetching thumbnail url for '${url}' URL... `)
      fixedBookmark.thumbnail_url = await unknown_fetch_thumbnail_url(url)
      if (fixedBookmark.thumbnail_url) {
        task_end(`Done ✔️.\nGot '${fixedBookmark.thumbnail_url}'.`)
      } else {
        task_end(`Failed ❌`)
      }
    }
    return fixedBookmark
  } catch (e) {
    errr(`Processing [${platform}] bookmark with URL '${url}'`)
    log_err(`Processing [${platform}] bookmark`, e)
  }
  return null
}
