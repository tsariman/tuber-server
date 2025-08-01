import { IStateContext } from './_state.common.types';

export const ensure_context = (context?: IStateContext): IStateContext => {
  return context || {};
}
