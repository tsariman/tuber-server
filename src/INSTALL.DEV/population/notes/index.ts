import { INote } from "src/schema/notes"

export const rnd_platform = () => {
  const platforms = ['youtube', 'vimeo', 'twitch', 'facebook', 'dailymotion']
  return platforms[platforms.length * Math.random() << 0]
}

/**
 * Generates a random character sequence including letters, numbers, and special
 * characters.
 */
const gen_random_videoid = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const gen_random_notes = (number = 100) => {
  const notes: INote[] = []
  for (let i = 0; i < number; i++) {
    const videoid = gen_random_videoid(11)
    notes.push({
      videoid,
      platform: rnd_platform(),
      startSeconds: Math.floor(Math.random() * 300),
      title: videoid,
      detail: videoid,
      restrictions: [],
      rules: []
    })
  }
  return notes
}

export default gen_random_notes