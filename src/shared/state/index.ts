
export type TCallback = (e: unknown) => void;

export interface IRedux {
  store: unknown;
  actions: unknown;
  route?: string;
}

export type TReduxHandle = (redux: IRedux) => TCallback;
