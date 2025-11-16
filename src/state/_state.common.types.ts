import { TThemeMode } from '../common.types'
import { TCipheredUser } from '../schema/users'

/** Values tied to the request which customize the returned state. */
export interface IStateContext {
  usr?: TCipheredUser
  token?: string
  theme?: TThemeMode
}

/** Dedicated to managing requested states in the bootstrap phase. */
export type TBootstrapState<T> = Record<string, T | ((context: IStateContext) => T)>

/** Use when returning both the `light` and the `dark` version of a state. */
export type IBootstrapThemed<T = unknown> = {
  [K in TThemeMode]: T
}