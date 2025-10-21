import { TStateFormItem } from '../../shared';
import FormItemTextfieldStateBuilder from './FormItemTextfieldStateBuilder';

export default class FormItemTextareaStateBuilder extends FormItemTextfieldStateBuilder {
  constructor(state: TStateFormItem = {}) {
    super(state);
    this.$state.type = 'textarea';
  }
}