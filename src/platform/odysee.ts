import axios from 'axios';
import { PLATFORM_URL } from '.';

export async function odysee_fetch_thumbnail_url(slug?: string): Promise<string> {
  if (!slug) { return ''; }
  const response = await axios.get(`https://odysee.com/$/oembed?url=${PLATFORM_URL['odysee']}/${slug}`);
  const json = await response.data;
  const thumbnailUrl = json.thumbnail_url;
  return thumbnailUrl;
}
