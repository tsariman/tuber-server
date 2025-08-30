import { FastifyRequest } from 'fastify';
import NodeCache from 'node-cache';
import { parse_cookie } from '../utility';
import { log } from '../utility/logging';

export const USER_CACHE = new NodeCache({ stdTTL: Number(process.env.STDTTL) || 900 });
export const SLUG_CACHE = new NodeCache();
export const READABLE_CACHE = new Map<string, Map<string, string>>();

// Initialize with default languages (do this once at startup)
export function initialize_readable_cache() {

  // TODO - Add your supported languages
  const supportedLanguages = ['en', 'fr', 'es', 'de'];

  supportedLanguages.forEach(lang => {
    if (!READABLE_CACHE.has(lang)) {
      READABLE_CACHE.set(lang, new Map<string, string>());
    }
  });
}

/**
 * Get language from request (cookie first, then Accept-Language header)
 */
export function get_request_language(req: FastifyRequest): string {
  // Check cookie first
  const cookieString = req.headers.cookie;
  if (cookieString) {
    const cookies = parse_cookie(cookieString);
    if (cookies.lang) {
      return cookies.lang;
    }
  }
  
  // Check Accept-Language header
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage) {
    const primaryLang = acceptLanguage.split(',')[0].split('-')[0];
    return primaryLang;
  }
  
  // Default language
  return 'en';
}

/**
 * Middleware to set the language key for the current request
 * This should be called early in the request lifecycle
 */
export function set_request_language_middleware(req: FastifyRequest): void {
  const lang = get_request_language(req);
  
  // Ensure the language cache exists
  if (!READABLE_CACHE.has(lang)) {
    // Fallback to 'en' if language not supported
    const fallbackLang = READABLE_CACHE.has('en') ? 'en' : 
                         READABLE_CACHE.keys().next().value || 'en';
    (req as FastifyRequest & { lang_key: string }).lang_key = fallbackLang;
  } else {
    (req as  FastifyRequest & { lang_key: string }).lang_key = lang;
  }
}

/**
 * Get the current request's language key
 * This should be called within a request context
 */
export function get_current_language_key(): string {
  // In a real implementation, you'd want to get this from async context
  // or pass it through the request object. For now, we'll use a global fallback
  return 'en'; // This will be overridden in the enhanced version below
}

/**
 * Populate readable cache for a specific language
 * This should be called once at startup for each language
 */
export async function populate_language_cache(lang: string, data: Record<string, string>): Promise<void> {
  if (!READABLE_CACHE.has(lang)) {
    READABLE_CACHE.set(lang, new Map<string, string>());
  }
  
  const languageCache = READABLE_CACHE.get(lang)!;
  Object.entries(data).forEach(([key, value]) => {
    languageCache.set(key, value);
  });
  
  log(`Populated readable cache for language: ${lang} with ${Object.keys(data).length} entries`);
}