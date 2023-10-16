import { IAnnotation } from '../../../schema/annotations'

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
  ]
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

const gen_random_annotations = (number = 100) => {
  const annotations: IAnnotation[] = []
  for (let i = 0; i < number; i++) {
    const videoid = gen_random_videoid(11)
    annotations.push({
      videoid: videoid,
      platform: rnd_platform(),
      start_seconds: Math.floor(Math.random() * 300),
      title: `[${i}] ${videoid}`,
      note: videoid,
      restrictions: [],
      rules: []
    })
  }
  return annotations
}

export default gen_random_annotations