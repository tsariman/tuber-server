import NodeCache from 'node-cache';

export const USER_CACHE = new NodeCache({ stdTTL: Number(process.env.STDTTL) || 900 });
export const SLUG_CACHE = new NodeCache();
export const READABLE_CACHE = new NodeCache();