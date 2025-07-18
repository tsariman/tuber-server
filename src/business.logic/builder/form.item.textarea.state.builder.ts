import { TStateFormItem } from 'src/common.types';
import FormItemTextfieldStateBuilder from './form.item.textfield.state.builder';

export default class FormItemTextareaStateBuilder extends FormItemTextfieldStateBuilder {
  constructor(state: TStateFormItem = {}) {
    super(state);
    this.$state.type = 'textarea';
  }
}