import AbstractStateBuilder from './abstract.state.builder';
import { TStateDialog } from '../../common.types';
import FormItemButtonStateBuilder from './form.item.button.state.builder';

type TType = TStateDialog['_type'];
type TProps = TStateDialog['props'];
type TTitleProps = TStateDialog['titleProps'];
type TContentProps = TStateDialog['contentProps'];
type TContentTextProps = TStateDialog['contentTextProps'];
type TActionsProps = TStateDialog['actionsProps'];

export default class DialogStateBuilder extends AbstractStateBuilder {
  constructor(private _state: TStateDialog = {}, type: TType = 'alert') {
    super()
    this._state._type = type;
  }
  build(): TStateDialog {
    return this._state;
  }
  /**
   * **DO NOT USE.** Not implemented.
   * @returns this.
   */
  add(instance: FormItemButtonStateBuilder): this {
    this._state.actions = this._state.actions ?? [];
    this._state.actions.push(instance.build());
    return this;
  }
  /**
   * Add a new action button to the dialog.
   * @param instance 
   * @returns this.
   */
  withActionButton(instance: FormItemButtonStateBuilder): this {
    return this.add(instance);
  }
  with_Id(_id: string): this {
    this._state._id = _id;
    return this;
  }
  with_Key(_key: string): this {
    this._state._key = _key;
    return this;
  }
  with_Type(_type: TType): this {
    this._state._type = _type;
    return this;
  }
  withProps(props: TProps): this {
    this._state.props = props;
    return this;
  }
  withTitleProps(props: TTitleProps): this {
    this._state.titleProps = props;
    return this;
  }
  withTitle(title: string): this {
    this._state.title = title;
    return this;
  }
  withContentProps(props: TContentProps): this {
    this._state.contentProps = props;
    return this;
  }
  withContentText(text: string): this {
    this._state.contentText = text;
    return this;
  }
  withContentTextProps(props: TContentTextProps): this {
    this._state.contentTextProps = props;
    return this;
  }
  withContent<T>(content: T): this {
    this._state.content = content;
    return this;
  }
  withActionProps(props: TActionsProps): this {
    this._state.actionsProps = props;
    return this;
  }
}