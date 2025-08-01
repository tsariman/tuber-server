import { r } from 'src/business.logic';
import { TStateFormItem } from '../../common.types';

export const dialogDefaultCloseButtonJson: TStateFormItem = {
  'type': 'state_button',
  'props': { 'color': 'secondary' },
  'has': {
    'text': r('8', 'Cancel'),
    'onclickHandle': 'tuberCallbacks.defaultClose'
  }
};