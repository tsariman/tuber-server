import axios from 'axios';
import { match_regex_array } from '../business.logic';
import { THUMBNAIL_URLS_REGEXP } from '../constants';

export async function unknown_fetch_thumbnail_url(url?: string): Promise<string> {
  if (!url) { return ''; }
  const response = await axios.get(url);
  const htmlText = await response.data;
  const match = match_regex_array(
    htmlText,
    THUMBNAIL_URLS_REGEXP
  );
  if (!match) { return ''; }
  const [ m2, thumbnail_url ] = match;
  if (m2 && thumbnail_url) {
    return thumbnail_url;
  }
  return '';
}