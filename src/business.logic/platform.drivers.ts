import fetch from 'cross-fetch'
import { IAnnotation } from '../schema/annotations'
import { TPlatform } from './common.types'
import C from '../config'

export default async function fix_missing_annotation_data (
  annotation?: IAnnotation
): Promise<IAnnotation|undefined> {
  if (!annotation) { return annotation }
  switch (annotation.platform as TPlatform) {

    case 'rumble': {
      if (annotation.url) {
        const url = new URL(annotation.url)

        // Had to get rid of query string because it was causing errors.
        const compliantUrl = url.origin + url.pathname
  
        const response = await fetch(compliantUrl)
        const htmlText = await response.text()
        const matches = htmlText.match(/"video":"(.*?)"/) ?? []
        const [ m1, videoid ] = matches
        if (m1 && videoid) {
          return {
            ...annotation,
            videoid
          }
        } else {
          C.err(`failed to parse video ID from rumble url`, matches)
        }
      }
    }

  }
  return annotation
}