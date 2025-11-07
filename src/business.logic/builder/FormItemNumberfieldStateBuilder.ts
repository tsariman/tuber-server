import { TStateFormItem } from '@tuber/shared';
import FormItemTextfieldStateBuilder from './FormItemTextfieldStateBuilder';

export default class FormItemNumberfieldStateBuilder extends FormItemTextfieldStateBuilder {
  constructor(state: TStateFormItem = {}) {
    super(state);
    this.$state.type = 'number';
  }
}