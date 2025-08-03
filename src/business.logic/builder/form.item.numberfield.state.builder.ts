import { TStateFormItem } from '../../shared';
import FormItemTextfieldStateBuilder from './form.item.textfield.state.builder';

export default class FormItemNumberfieldStateBuilder extends FormItemTextfieldStateBuilder {
  constructor(state: TStateFormItem = {}) {
    super(state);
    this.$state.type = 'number';
  }
}