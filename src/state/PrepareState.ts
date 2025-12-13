import { TContextualUser } from '../schema/user';
import { TBootstrapState, IStateContext } from './_state.common.types';
import { TThemeMode } from '../common.types';
import { ensure_context } from './_state.common.logic';
import { ler as err } from '../utility/logging';

export class PrepareState<T> {

  private _state: T;
  private _context: IStateContext;

  constructor(context?: IStateContext) {
    this._context = ensure_context(context);
    this._state = {} as T;
  }

  setUser(usr: TContextualUser) {
    this._context.usr = usr;

    return this;
  }

  setTheme(theme: TThemeMode) {
    this._context.theme = theme;

    return this;
  }

  /**
   * Executes functions that may return a customized version of the
   * state based on current user's role and other factors.
   *
   * @param stateDictionary Can contain both raw states and functions returning processed states.
   * @returns 
   */
  process(stateDictionary: TBootstrapState<T>, selectedKey?: string) {
    if (!selectedKey) {
      const firstKey = Object.keys(stateDictionary)[0];
      if (firstKey) {
        const firstState = stateDictionary[firstKey];
        this._setState(firstState);
      }
    } else if (selectedKey && stateDictionary[selectedKey]) {
      const selectedState = stateDictionary[selectedKey];
      this._setState(selectedState);
    } else if (selectedKey) {
      err(`[ERROR] Invalid key (${selectedKey}) for state selection.`);
    }
    return this;
  }

  /**
   * Executes async functions that may return a customized version of the
   * state based on current user's role and other factors.
   *
   * @param stateDictionary Can contain both raw states and async functions
   *                        returning processed states.
   * @returns
   */
  async processAsync(stateDictionary: TBootstrapState<T>, selectedKey?: string): Promise<this> {
    if (!selectedKey) {
      const firstKey = Object.keys(stateDictionary)[0];
      if (firstKey) {
        const firstState = stateDictionary[firstKey];
        await this._setStateAsync(firstState);
      }
    } else if (selectedKey && stateDictionary[selectedKey]) {
      const selectedState = stateDictionary[selectedKey];
      await this._setStateAsync(selectedState);
    } else if (selectedKey) {
      err(`[ERROR] Invalid key (${selectedKey}) for state selection.`);
    }
    return this;
  }

  private _setState(state: T | ((c: IStateContext) => T)): void {
    if (typeof state === 'function') {
      this._state = (state as (c: IStateContext) => T)(this._context);
    } else {
      this._state = state as T;
    }
  }

  private async _setStateAsync(state: T | ((c: IStateContext) => T | Promise<T>)): Promise<void> {
    if (typeof state === 'function') {
      const result = (state as (c: IStateContext) => T | Promise<T>)(this._context);
      if (result instanceof Promise) {
        this._state = await result;
      } else {
        this._state = result;
      }
    } else {
      this._state = state as T;
    }
  }

  get() {
    return this._state;
  }

  cleanup() {
    this._state = {} as T;

    return this;
  }
}