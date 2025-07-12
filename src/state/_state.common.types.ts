import { TThemeMode } from 'src/common.types';
import { TCipheredUser } from 'src/schema/users';

export interface IStateContext {
  usr?: TCipheredUser;
  token?: string;
  theme?: TThemeMode;
}

/** Dedicated to managing requested states from server. */
export type TBootstrapState<T> = Record<string, T | ((context: IStateContext) => T)>;