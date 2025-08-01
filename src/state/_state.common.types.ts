import { TThemeMode } from '../common.types';
import { TCipheredUser } from '../schema/users';

export interface IStateContext {
  usr?: TCipheredUser;
  token?: string;
  theme?: TThemeMode;
}

/** Dedicated to managing requested states from server. */
export type TBootstrapState<T> = Record<string, T | ((context: IStateContext) => T)>;