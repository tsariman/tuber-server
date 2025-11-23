import { TCipheredUser } from '../schema/user';
import dev_get_pages_data_state from '../dev/dev.pages.data.state';

/** @deprecated */
export default async function bootstrap_pages_data_state (usr?: TCipheredUser) {
  const pagesData = {
    ...(usr ? await dev_get_pages_data_state() : {})
  };

  return pagesData;
}
