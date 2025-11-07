import { t } from 'src/business.logic';
import { TStateFormItem } from '@tuber/shared';

export const dialogDefaultCloseButtonJson: TStateFormItem = {
  'type': 'state_button',
  'props': { 'color': 'secondary' },
  'has': {
    get 'text'() { return t('8', 'Cancel'); },
    'onclickHandle': 'tuberCallbacks.defaultClose'
  }
};