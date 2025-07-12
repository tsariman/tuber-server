import { TCipheredUser } from '../schema/users';
import dev_get_pages_data_state from '../DEV/dev.pages.data.state';

/** @deprecated */
export default async function bootstrap_pages_data_state (usr?: TCipheredUser) {
  const pagesData = {
    ...(usr ? await dev_get_pages_data_state() : {})
  };

  return pagesData;
}
