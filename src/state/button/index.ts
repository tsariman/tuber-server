import { TStateFormItem } from '../../common.types'

export const dialogDefaultCloseButtonJson: TStateFormItem = {
  'type': 'state_button',
  'props': { 'color': 'secondary' },
  'has': {
    'text': 'Cancel',
    'onclickHandle': 'tuberCallbacks.defaultClose'
  }
}