// import { connect, disconnect } from 'mongoose'
import { IAnnotation } from '../schema/annotations'
import Config from '../config'
import { AnnotationModel } from '../model/annotation'
import { UserModel } from '../model/user'

export async function get_documents_count () {
  // await connect(Config.DB_URI)
  const annotationCount = (await AnnotationModel.countDocuments()).toString()
  const userCount = (await UserModel.countDocuments()).toString()
  // await disconnect()
  Config.log('counts:', { annotationCount, userCount })
  return { annotationCount, userCount }
}

export function gen_random_annotation_votes(
  annotation?: IAnnotation
): IAnnotation | undefined {
  if (!annotation) { return }
  const level = _gen_random_votes_level()
  const ratio = _gen_random_votes_ratio()

  // generate random upvotes and downvotes
  const up = Math.floor(Math.random() * level)
  const down = Math.floor(Math.random() * level)
  
  const upvotes = up * ratio.up
  const downvotes = down * ratio.down

  return {
    ...annotation,
    upvotes,
    downvotes
  }
}

/** Random volume of votes */
function _gen_random_votes_level() {
  switch(Math.floor(Math.random() * 6)) {
    case 0: return 10
    case 1: return 100
    case 2: return 1000
    case 3: return 10000
    case 4: return 100000
    case 5: return 1000000
  }
  return 10000000
}

function _gen_random_votes_ratio(): {up:number;down:number} {
  switch (Math.floor(Math.random() * 20)) {
    case 1: return { up: 1, down: .9 }
    case 3: return { up: 1, down: .75 }
    case 5: return { up: 1, down: .5 }
    case 7: return { up: 1, down: .25 }
    case 9: return { up: 1, down: .1 }
    case 11: return { up: .9, down: 1 }
    case 13: return { up: .75, down: 1 }
    case 15: return { up: .5, down: 1 }
    case 17: return { up: .25, down: 1 }
    case 19: return { up: .1, down: 1 }
  }
  return { up: 1, down: 1 }
}