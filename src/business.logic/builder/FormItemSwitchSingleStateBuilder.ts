import {
  FormControlProps,
  FormHelperTextProps
} from '@mui/material'
import FormItemBaseStateBuilder from './FormItemBaseStateBuilder'
import { TFormControlLabelProps, TStateFormItem } from '@tuber/shared'

export default class FormItemSwitchSingleStateBuilder
  extends FormItemBaseStateBuilder
{
  constructor(state: TStateFormItem = {}) {
    super(state)
    this.$state.type = 'switch_single'
  }
  /** Not needed for a switch instance. @returns this. */
  withType(): this { return this.die('Method not implemented.', this) }
  withLabel(label: string): this {
    this.$state.label = label
    return this
  }
  /**
   * Set switch component props.
   * @param props
   * @returns this.
   */
  withProps<T extends Record<string, unknown>>(props: T): this {
    this.$state.props = props
    return this
  }
  /**
   * Set the switch form control component props.
   * @param props 
   * @returns this.
   */
  hasFormControlProps(props: FormControlProps): this {
    this.$state.has ??= {}
    this.$state.has.formControlProps = props
    return this
  }
  /**
   * Set the switch form control label component props.
   * @param props 
   * @returns this.
   */
  hasFormControlLabelProps(props: TFormControlLabelProps): this {
    this.$state.has ??= {}
    this.$state.has.formControlLabelProps = props
    return this
  }
  /**
   * Set the switch form helper text component props.
   * @param props 
   * @returns this.
   */
  hasFormHelperTextProps(props: FormHelperTextProps): this {
    this.$state.has ??= {}
    this.$state.has.formHelperTextProps = props
    return this
  }
  /**
   * Set the helper text for the switch.
   * @param text 
   * @returns this.
   */
  hasHelperText(text: string): this {
    this.$state.has ??= {}
    this.$state.has.helperText = text
    return this
  }
}