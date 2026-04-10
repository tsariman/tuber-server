import * as fs from 'fs/promises'
import { TPlatform } from '../../../common.types'
import { TBookmark } from '../../../schema/bookmark'
import { DEV_USER_FILENAME } from '../../dev.install.common'

/**
 * Generates a random platform from the list of supported platforms.
 */
export const rnd_platform = (): TPlatform => {
  const platforms = [
    'youtube',
    'vimeo',
    'dailymotion',
    'rumble',
    'bitchute',
    'odysee',
    'twitch',
    'facebook'
  ] as TPlatform[]
  return platforms[platforms.length * Math.random() << 0]
}

/**
 * Generates a random platform with weighted probabilities (e.g., YouTube more common).
 */
const weighted_platform = (): TPlatform => {
  const platforms: { platform: TPlatform; weight: number }[] = [
    { platform: 'youtube', weight: 0.6 },
    { platform: 'vimeo', weight: 0.15 },
    { platform: 'dailymotion', weight: 0.1 },
    { platform: 'rumble', weight: 0.05 },
    { platform: 'bitchute', weight: 0.03 },
    { platform: 'odysee', weight: 0.03 },
    { platform: 'twitch', weight: 0.02 },
    { platform: 'facebook', weight: 0.02 }
  ]
  const totalWeight = platforms.reduce((sum, p) => sum + p.weight, 0)
  let random = Math.random() * totalWeight
  for (const p of platforms) {
    random -= p.weight
    if (random <= 0) return p.platform
  }
  return 'youtube' // fallback
}

/**
 * Generates a random video ID based on platform-specific formats.
 */
const gen_random_videoid = (platform: TPlatform): string => {
  switch (platform) {
    case 'youtube':
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('').sort(() => Math.random() - 0.5).join('').substring(0, 11)
    case 'vimeo':
      return Math.floor(Math.random() * 1000000000).toString()
    case 'dailymotion':
      return 'x' + Math.floor(Math.random() * 1000000).toString()
    case 'rumble':
      return 'v' + Math.floor(Math.random() * 1000000).toString() + '-' + Math.floor(Math.random() * 1000000).toString()
    case 'bitchute':
      return Math.floor(Math.random() * 1000000).toString()
    case 'odysee':
      return '@' + Math.floor(Math.random() * 1000000).toString() + ':' + Math.floor(Math.random() * 1000000).toString()
    case 'twitch':
      return Math.floor(Math.random() * 1000000000).toString()
    case 'facebook':
      return Math.floor(Math.random() * 1000000000000).toString()
    default:
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('').sort(() => Math.random() - 0.5).join('').substring(0, 11)
  }
}

/**
 * Sample realistic video titles.
 */
const sampleTitles = [
  'How to Cook Pasta | Easy Recipe',
  'Top 10 Programming Tips for Beginners',
  'Amazing Nature Documentary',
  'Funny Cat Videos Compilation',
  'Learn Guitar in 30 Days',
  'Best Travel Destinations 2025',
  'Cooking Show: Gourmet Meals',
  'Tech Review: Latest Gadgets',
  'Fitness Workout Routine',
  'History of Ancient Civilizations',
  'Comedy Sketch: Hilarious Moments',
  'Science Explained: Quantum Physics',
  'DIY Home Improvement Projects',
  'Music Playlist: Chill Vibes',
  'Movie Trailer Reactions',
  'Gaming Tips and Tricks',
  'Art Tutorial: Painting Techniques',
  'News Update: Current Events',
  'Educational Video: Math Concepts',
  'Vlog: Daily Life Adventures'
]

/**
 * Generates a random date within the past year.
 */
const randomPastDate = (): Date => {
  const now = new Date()
  const pastYear = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
  return new Date(pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime()))
}

/**
 * Generates a random note (sometimes empty).
 */
const randomNote = (): string => {
  const notes = [
    '',
    'Great video!',
    'Must watch again.',
    'Very informative.',
    'Hilarious!',
    'Learned something new.',
    'Awesome content.',
    'Saved for later.'
  ]
  return notes[Math.floor(Math.random() * notes.length)]
}

const $get_dev_user_id = async (): Promise<string> => {
  const buffer = await fs.readFile(DEV_USER_FILENAME)
  const id = buffer.toString()
  return id
}

const gen_random_bookmarks = async (number = 100): Promise<TBookmark[] | null> => {
  try {
    const user_id = await $get_dev_user_id()
    const bookmarks: TBookmark[] = []
    let p = 0
    for (let i = 0; i < number; i++) {
      const platform = weighted_platform()
      const videoid = gen_random_videoid(platform) // rnd_videoid(11)
      const created_at = randomPastDate()
      const modified_at = new Date(created_at.getTime()
        + Math.random() * (Date.now() - created_at.getTime())
      )
      const sampleTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)]
      const note = sampleTitle + ' ' + randomNote()
      bookmarks.push({
        is_active: true,
        created_at,
        modified_at,
        user_id,
        videoid,
        platform,
        start_seconds: Math.floor(Math.random() * 300),
        title: `Page[${Math.floor(i / 25)}] Item[${p}] Bookmark[${i}]`,
        note,
      })
      p = (p + 1) % 25
    }
    return bookmarks
  } catch (e) {
    console.error('Error generating random bookmarks:', e)
  }
  return null
}

export default gen_random_bookmarks