import { r } from 'src/business.logic';
import { TStateFormItem } from '../../common.types';

export const dialogDefaultCloseButtonJson: TStateFormItem = {
  'type': 'state_button',
  'props': { 'color': 'secondary' },
  'has': {
    'text': r('8', 'Cancel'), // $8_READABLE
    'onclickHandle': 'tuberCallbacks.defaultClose'
  }
};