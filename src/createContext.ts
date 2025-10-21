import type { StorageVariants } from './storage'

import { ContextConfig } from './config'
import { Context } from './context'

//* Ctrl+Shift+P > Fold All Block Comments

/**
 * Function interface for creating Context instances with type-safe configuration.
 *
 * @public
 */
interface CreateContextFn {
  /**
   * Creates a new Context instance with the specified name, initial value, and configuration.
   *
   * @param name - Unique identifier for the context
   * @param initialValue - Initial value or function that returns the initial value
   * @param config - Optional configuration for storage and serialization
   * @returns A new Context instance
   */
  // eslint-disable-next-line @typescript-eslint/prefer-function-type
  <
    T,
    S extends StorageVariants = ContextConfig.inferStorage<ContextConfig<any>>,
  >(
    name: string,
    initialValue:
      | ((
          persistedValue?: S extends 'localStorage'
            ? string | undefined
            : undefined,
        ) => T)
      | T,
    config?: Partial<ContextConfig<T, S>>,
  ): Context<T, [`storage:${S}`]>
}

// TODO: `createContext` should be treated as a function in API Reference

/**
 * Creates a new Context instance with the specified name, initial value, and configuration.
 *
 * This is the primary way to create context instances for state management.
 *
 * @param name - Unique identifier for the context
 * @param initialValue - Initial value or function that returns the initial value
 * @param config - Optional configuration for storage and serialization
 * @returns A new Context instance
 *
 * @example
 *
 * ```ts
 * const LocalContext = createContext('local', false)
 * const SessionContext = createContext('session', false, {
 *   storage: 'localStorage',
 * })
 * ```
 *
 * @public
 */
const createContext: CreateContextFn = <
  T,
  S extends StorageVariants = ContextConfig.inferStorage<ContextConfig<any>>,
>(
  name: string,
  initialValue:
    | ((
        persistedValue?: S extends 'localStorage'
          ? string | undefined
          : undefined,
      ) => T)
    | T,
  config?: Partial<ContextConfig<T, S>>,
) => {
  return new Context(
    name,
    initialValue as ((persistedValue?: string) => T) | T,
    config,
  )
}

export { createContext }
export type { CreateContextFn }
