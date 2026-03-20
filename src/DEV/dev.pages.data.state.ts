import { get_state_key as key } from '../business.logic'
import { get_documents_count } from '.'
import devInstallFormState from './form/dev.install.form.state'
import Config from '../config'
import { TObj } from '../common.types'
import STATE_KEY from '../business.logic/state.key'

const $46 = STATE_KEY['46']
const $58 = STATE_KEY['58']

export default async function dev_get_pages_data_state(): Promise<TObj> {
  const pagesData: TObj = {}
  const counts = await get_documents_count()
  pagesData[key(devInstallFormState)] = counts
  pagesData[$46] = {
    thumbnailUrl: `${Config.IMAGE_FOLDER}dev-thumbnail-test-placeholder.jpg`
  }
  pagesData[$58] = {
    thumbnailUrl: `${Config.IMAGE_FOLDER}dev-thumbnail-test-placeholder.jpg`
  }
  return pagesData
}
