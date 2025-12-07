import { TBootstrapState } from '../../state/_state.common.types'
import {
  TStateForm,
   $62_STATE_KEY,
  THEME_LIGHT_PAPER_COLOR,
  THEME_DARK_PAPER_COLOR
} from '@tuber/shared'
import { register } from '../../business.logic/registry'
import { clone_or_default, clone_with_descriptors } from '../../business.logic'

register('state', '62', $62_STATE_KEY)
/** @id 62 */
const devSaveConfigValueFormState: TStateForm = {
  '_id': '62',
  '_key': $62_STATE_KEY,
  '_type': 'stack',
  'props': {
    'sx': { 'p': 2, 'width': 476 },
    'spacing': 2,
  },
  'paperBackground': true,
  'paperProps': {
    'elevation': 0,
    'sx': {
      'backgroundColor': THEME_LIGHT_PAPER_COLOR
    }
  },
  'items': [
    {
      'type': 'text',
      'name': 'key',
      'label': 'Key',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      },
      'has': {
        'required': true,
        'requiredMessage': 'Key is required',
      }
    },
    {
      'type': 'text',
      'name': 'value',
      'label': 'Value',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      },
      'has': {
        'required': true,
        'requiredMessage': 'Value is required',
      }
    },
    {
      'type': 'state_button',
      'props': {
        'variant': 'contained',
        'color': 'primary',
      },
      'has': {
        'label': 'Save',
        'onclickHandler': 'tuberCallbacks.$62_C_1',
      }
    },
  ]
}

export default devSaveConfigValueFormState

export const $62DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(devSaveConfigValueFormState)
  const paperProps = clone_or_default(base.paperProps, {})
  paperProps.sx = { 'backgroundColor': THEME_DARK_PAPER_COLOR }
  base.paperProps = paperProps
  return base
})()

export const dev_save_config_value_form_state = {

  [$62_STATE_KEY]: devSaveConfigValueFormState,

  // TODO - Instert more form states here.

} as TBootstrapState<TStateForm>

export const dev_save_config_value_form_state_dark = {

  [$62_STATE_KEY]: $62DarkThemeMode,

  // TODO - Insert more form states (dark themed) here.

} as TBootstrapState<TStateForm>