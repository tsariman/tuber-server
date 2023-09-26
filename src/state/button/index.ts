import IStateFormItem from '../../../../tuber-client/src/controllers/interfaces/IStateFormItem'


export const dialogDefaultCloseButtonJson: IStateFormItem = {
  'type': 'json_button',
  'props': { 'color': 'secondary' },
  'has': {
    'text': 'Cancel',
    'onclickHandle': 'tuberCallbacks.defaultClose'
  }
}