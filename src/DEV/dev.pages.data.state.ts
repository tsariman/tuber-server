import { get_state_key as key } from '../business.logic';
import { get_documents_count } from '.';
import devInstallFormState from './form/dev.install.form.state';
import { $46_STATE_KEY, $58_STATE_KEY } from '../constants.server';
import Config from '../config';
import { TObj } from '../common.types';

export default async function dev_get_pages_data_state(): Promise<TObj> {
  const pagesData: TObj = {};
  const counts = await get_documents_count();
  pagesData[key(devInstallFormState)] = counts;
  pagesData[$46_STATE_KEY] = {
    thumbnailUrl: `${Config.IMAGE_FOLDER}dev-thumbnail-test-placeholder.jpg`
  };
  pagesData[$58_STATE_KEY] = {
    thumbnailUrl: `${Config.IMAGE_FOLDER}dev-thumbnail-test-placeholder.jpg`
  };
  return pagesData;
}
