import { TContextualUser } from '../schema/user'

export default abstract class AbstractState<T = Record<string, unknown>> {
  protected usr?: TContextualUser
  constructor(usr?: TContextualUser) { this.usr = usr }
  // abstract withContext(usr?: TContextualUser): unknown
  abstract get light(): T
  abstract get dark(): T
}
