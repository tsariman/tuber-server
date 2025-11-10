import { TStateFormItem } from '@tuber/shared';

const devFormTestClipboardState: TStateFormItem = {
  'type': 'stack',
  'props': {
    'direction': 'row',
    'spacing': 1
  },
  'items': [
    {
      'type': 'textfield',
      'name': 'clipboard-test',
      'label': 'Clipboard Test',
      'has': {
        
      },
      'props': {
        'variant': 'filled',
        'fullWidth': true
      }
    },
    {
      'type': 'state_button',
      'has': {
        'text': 'Test Clipboard',
        'onclickHandle': 'tuberCallbacks.devClipboardTest'
      },
      'props': {
        'variant': 'contained',
        'size': 'small',
        'disableElevation': true
      }
    }
  ]
};

export default devFormTestClipboardState;