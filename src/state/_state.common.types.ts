import { TThemeMode } from '../common.types'
import { TContextualUser } from '../schema/user'

/** Values tied to the request which customize the returned state. */
export interface IStateContext {
  usr?: TContextualUser
  token?: string
  theme?: TThemeMode
  query?: string
}

/** Dedicated to managing requested states in the bootstrap phase. */
export type TBootstrapState<T> = Record<string, T | ((context: IStateContext) => T)>

/** Use when returning both the `light` and the `dark` version of a state. */
export type IBootstrapThemed<T = unknown> = {
  [K in TThemeMode]: T
}