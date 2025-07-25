import axios from 'axios';
import Config from '../config';
import { request } from 'urllib';

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
    return (allIndexesResponse.data as any[]).find(i => i.name === indexName);
  } catch (e: unknown) {
    console.log(`[ERROR] ${(e as Error).message}`);
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