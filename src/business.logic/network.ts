import axios from 'axios';
import Config from '../config';
import { request } from 'urllib';
import { log, log_err } from '../utility/logging';

interface IIndexInfo { name: string; }

// TODO All network related functions go here

/**
 * Check if collection search index exist for Mongodb Atlas.
 * @param indexName Name of the index to check.
 * @param collectionName Name of the collection to check.
 * @returns `true` if index exist.
 */
export async function find_index_by_name(indexName: string, collectionName: string): Promise<boolean> {
  try {
    const allIndexesResponse = await request(
      `${Config.DB_ATLAS_SEARCH_INDEX_API_URL}/${Config.DB_NAME}/${collectionName}`,
      {
        dataType: 'json',
        contentType: 'application/json',
        method: 'GET',
        digestAuth: Config.DB_ATLAS_DIGEST_AUTH
      }
    );
    const data = allIndexesResponse.data;
    if (!Array.isArray(data)) {
      console.log('[ERROR] Unexpected response format from Atlas Search Index API');
      return false;
    }
    const result = (data as IIndexInfo[]).find(i => i.name === indexName);
    return result !== undefined;
  } catch (e) {
    log(`[ERROR] ${(e as Error).message}`);
    log_err(`${(e as Error).message}`, e);
    return false;
  }
}

/**
 * Fetch HTML page.
 * @param url URL of the page to fetch.
 * @returns HTML source as string.
 */
export async function fetch_html_page(url?: string): Promise<string> {
  if (!url) { return '' };
  const response = await axios.get(url);
  const htmlText = response.data;
  return htmlText;
}