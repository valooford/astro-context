import type { StorageVariants } from './storage'

import { ContextConfig } from './config'
import { _StorageService, Store } from './storage'
import { spread } from './utils/spread'

//* Ctrl+Shift+P > Fold All Block Comments

/**
 * Function type for initializing context values, optionally using persisted data.
 *
 * @param persistedValue - Optional persisted value from storage (string for localStorage, undefined for memory)
 * @returns The initial value for the context
 *
 * @public
 */
type _GetInitialValueFn<T> = (persistedValue?: string) => T

/**
 * A context object that manages state across different scopes and storage types.
 *
 * Provides methods to get, set, and manage context values with support for memory and localStorage persistence.
 *
 * @public
 */
class Context<T, _Info extends [`storage:${StorageVariants}`]> {
  /**
   * The unique name identifier for this context.
   */
  public readonly name: string
  /**
   * Function used to initialize context values, optionally using persisted data from storage.
   *
   * @internal
   */
  getInitialValue: _GetInitialValueFn<T>
  /**
   * Configuration object that defines storage type and serialization behavior for this context.
   *
   * @internal
   */
  config = new ContextConfig<T, StorageVariants>()
  /**
   * Storage service instance that handles the actual storage operations for this context.
   *
   * @internal
   */
  storage: _StorageService
  /**
   * Creates a new Context instance with the specified name, initial value, and configuration.
   *
   * @param name - Unique identifier for the context
   * @param initialValue - Initial value or function that returns the initial value
   * @param config - Optional configuration for storage and serialization
   *
   * @example
   *
   * ```ts
   * const LocalContext = createContext('local', false)
   * const SessionContext = createContext('session', false, {
   *   storage: 'localStorage',
   * })
   * ```
   */
  constructor(
    name: string,
    initialValue: _GetInitialValueFn<T> | T,
    config?: Partial<ContextConfig<T, any>>,
  ) {
    this.getInitialValue =
      typeof initialValue === 'function'
        ? (initialValue as typeof this.getInitialValue)
        : (persistedValue) =>
            persistedValue ? (JSON.parse(persistedValue) as T) : initialValue
    this.name = name
    if (config) spread(this.config, config)
    this.storage = new _StorageService(this.config.storage)
  }

  /**
   * Retrieves the current value of the context for the specified scope.
   *
   * @param scope - Optional scope identifier. If undefined, returns the global value
   * @returns The context value for the specified scope
   *
   * @example
   *
   * ```ts
   * const value = LocalContext.get()
   * const scopedValue = LocalContext.get('my-scope')
   * ```
   */
  public get<S extends string | undefined = undefined>(
    scope?: S,
  ): S extends undefined ? T : T | undefined {
    scope ??= 'global' as NonNullable<S>
    return this.storage.get(this, scope) as ReturnType<typeof this.get<S>>
  }
  /**
   * Sets the value of the context for the specified scope.
   *
   * @param value - The new value to set
   * @param scope - Optional scope identifier. Defaults to 'global'
   *
   * @example
   *
   * ```ts
   * LocalContext.set(true)
   * LocalContext.set(false, 'my-scope')
   * ```
   */
  public set(
    value: T,
    scope?: Context.inferStorage<Context<any, _Info>> extends 'memory'
      ? string
      : 'global',
  ) {
    scope ??= 'global'
    this.storage.set(this, scope, value)
  }
  /**
   * Generates provider traits for use in ContextProvider components.
   *
   * @param store - Optional store instance to generate traits for
   * @returns Object containing data attributes for the provider
   *
   * @example
   *
   * ```tsx
   * const traits = LocalContext.providerTraits()
   * // . . .
   * <context-provider {...traits}>
   * ```
   */
  public providerTraits(store = new Store()) {
    return {
      'data-context-id': this.name,
      'data-context-scope': store.scopeName ?? store.scope,
      'data-context-stable': store.scopeName ? true : undefined,
    }
  }
}

/**
 * Namespace containing utility types for Context.
 *
 * @public
 */
namespace Context {
  /**
   * Infers the info type from a Context instance.
   */
  export type inferInfo<C extends Context<any, any>> =
    C extends Context<any, infer Info> ? Info : never
  /**
   * Infers the storage type from a Context instance.
   */
  export type inferStorage<C extends Context<any, any>> =
    C extends Context<any, infer Storage>
      ? Storage extends [`storage:${infer S}`]
        ? S
        : never
      : never
}

export { Context }
export type { _GetInitialValueFn }
