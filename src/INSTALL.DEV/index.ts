import { connect, disconnect } from 'mongoose'
import Config from 'src/config'
import { AnnotationModel } from 'src/model/annotation'
import { UserModel } from 'src/model/user'

export async function get_documents_count () {
  await connect(Config.DB_URI)
  const annotationCount = (await AnnotationModel.countDocuments()).toString()
  const userCount = (await UserModel.countDocuments()).toString()
  await disconnect()
  Config.log('counts:', { annotationCount, userCount })
  return { annotationCount, userCount }
}
