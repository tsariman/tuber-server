import { TBookmark } from '../../../schema/bookmarks';

export const rnd_platform = () => {
  const platforms = [
    'youtube',
    'vimeo',
    'dailymotion',
    'rumble',
    'bitchute',
    'odysee',
    'twitch',
    'facebook'
  ];
  return platforms[platforms.length * Math.random() << 0];
};

/**
 * Generates a random character sequence including letters, numbers, and special
 * characters.
 */
const gen_random_videoid = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const gen_random_bookmarks = (number = 100) => {
  const bookmarks: TBookmark[] = [];
  for (let i = 0; i < number; i++) {
    const videoid = gen_random_videoid(11);
    bookmarks.push({
      is_active: true,
      created_at: new Date(),
      modified_at: new Date(),
      is_private: false,
      user_id: '',
      videoid: videoid,
      platform: rnd_platform(),
      start_seconds: Math.floor(Math.random() * 300),
      title: `[${i}] ${videoid}`,
      note: videoid,
    });
  }
  return bookmarks;
}

export default gen_random_bookmarks;