import { IBookmark, TBookmarkFrag } from '../schema/bookmarks'
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
import { PLATFORM_URL } from '.'

/**
 * Fill-in missing data for a bookmark.
 * @param attributes The bookmark object.
 * @returns `Promise<IBookmark|null>`
 */
export default async function fix_missing_bookmark_data (
  attributes?: IBookmark
): Promise<IBookmark|null> {
  if (!attributes) { return null }
  const map: {[key in TPlatform]: () => Promise<IBookmark|null>} = {
    _blank: async () => null,
    youtube: async () => attributes,
    rumble: async () => _rumble_data(attributes),
    odysee: async () => _odysee_data(attributes),
    vimeo: async () => _vimeo_data(attributes),
    dailymotion: async () => attributes,
    facebook: async () => _facebook_data(attributes),
    bitchute: async () => null,
    twitch: async () => _twitch_data(attributes),
    unknown: async () => _unknown_data(attributes)
  }
  return map[attributes.platform as TPlatform]()
}

/**
 * Get thumbnail url for a video of supported platform.
 * @param body The bookmark object.
 * @returns `Promise<string>`
 */
export function get_video_thumbnail_url (body: TBookmarkFrag) {
  const map: {[key in TPlatform]: () => Promise<string>} = {
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
  return map[body.platform as TPlatform]()
}

async function _rumble_data(attr: IBookmark): Promise<IBookmark|null> {
  const { slug } = attr
  if (!slug) { return null }
  const urlObj = new URL(`${PLATFORM_URL['rumble']}${slug}.html`)
  // Had to get rid of query string because it was causing errors.
  const compliantUrl = `${urlObj.origin}${urlObj.pathname}`
  const html = await rumble_fetch_html_page(compliantUrl)
  const videoid = rumble_parse_videoid(html)
  const thumbnail_url = rumble_parse_thumbnail_url(html)
  const fixedBookmark = { ...attr } as IBookmark
  if (videoid && thumbnail_url) {
    fixedBookmark.videoid = videoid
    fixedBookmark.thumbnail_url = thumbnail_url
    return fixedBookmark
  }
  return attr
}

async function _twitch_data(attr: IBookmark): Promise<IBookmark|null> {
  const { videoid } = attr
  if (!videoid) { return null }
  const fixedBookmark = { ...attr } as IBookmark
  if (!fixedBookmark.thumbnail_url) {
    fixedBookmark.thumbnail_url = await twitch_fetch_thumbnail_url(videoid)
  }
  return fixedBookmark
}

async function _vimeo_data(attr: IBookmark): Promise<IBookmark|null> {
  const { videoid } = attr
  if (!videoid) { return null }
  const fixedBookmark = { ...attr } as IBookmark
  if (!fixedBookmark.thumbnail_url) {
    fixedBookmark.thumbnail_url = await vimeo_fetch_thumbnail_url(videoid)
  }
  return fixedBookmark
}

async function _odysee_data(attr: IBookmark): Promise<IBookmark|null> {
  const { slug } = attr
  if (!slug) { return null }
  const fixedBookmark = { ...attr } as IBookmark
  if (!fixedBookmark.thumbnail_url) {
    fixedBookmark.thumbnail_url = await odysee_fetch_thumbnail_url(slug)
  }
  return fixedBookmark
}

async function _unknown_data(attr: IBookmark): Promise<IBookmark|null> {
  const { url } = attr
  if (!url) { return null }
  const fixedBookmark = { ...attr } as IBookmark
  if (!fixedBookmark.thumbnail_url) {
    fixedBookmark.thumbnail_url = await unknown_fetch_thumbnail_url(url)
  }
  return fixedBookmark
}

async function _facebook_data(attr: IBookmark) {
  const { url } = attr
  if (!url) { return null }
  const fixedBookmark = { ...attr } as IBookmark
  if (!fixedBookmark.thumbnail_url) {
    fixedBookmark.thumbnail_url = await unknown_fetch_thumbnail_url(url)
  }
  return attr
}

