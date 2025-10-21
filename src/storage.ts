import type { Context } from './context'

import { getRandomString } from './utils/getRandomString'

// Ctrl+Shift+P > Fold All Block Comments

/**
 * Available storage variants for context persistence.
 *
 * @public
 */
type StorageVariants = 'memory' | 'localStorage'
/**
 * Internal interface defining the contract for storage implementations.
 * Provides methods for getting and setting context values within specific scopes.
 *
 * @internal
 */
interface _Storage {
  /**
   * Retrieves a context value from storage for the specified scope.
   *
   * @param name - The context instance to get the value for
   * @param scope - The scope identifier
   * @returns The stored value for the context in the specified scope
   */
  get<T>(name: Context<T, any>, scope: string): T
  /**
   * Stores a context value in storage for the specified scope.
   *
   * @param name - The context instance to set the value for
   * @param scope - The scope identifier
   * @param value - The value to store
   */
  set<T>(name: Context<T, any>, scope: string, value: T): void
}

class MemoryStorage implements _Storage {
  storage: Record<string, unknown> = {}
  get<T>(context: Context<T, ['storage:memory']>, scope: string): T {
    let value = this.storage[`${context.name}/${scope}`] as T | undefined
    if (!value) {
      value = context.getInitialValue()
      this.set(context, scope, value)
    }
    return value
  }
  set<T>(
    context: Context<T, ['storage:memory']>,
    scope: string,
    value: T,
  ): void {
    this.storage[`${context.name}/${scope}`] = value
  }
}

class LocalStorage implements _Storage {
  get<T>(context: Context<T, ['storage:localStorage']>, scope: string): T {
    const name = encodeURIComponent(context.name)
    const scopeKey = encodeURIComponent(scope)
    const valueStr = import.meta.env.SSR
      ? undefined
      : (localStorage.getItem(`astro-context/${name}/${scopeKey}`) ?? undefined)
    if (!valueStr) {
      const value = context.getInitialValue()
      this.set(context, scope, value)
    }
    return context.getInitialValue(valueStr)
  }
  set<T>(
    context: Context<T, ['storage:localStorage']>,
    scope: string,
    value: T,
  ): void {
    if (import.meta.env.SSR) return
    const name = encodeURIComponent(context.name)
    const scopeKey = encodeURIComponent(scope)
    localStorage.setItem(
      `astro-context/${name}/${scopeKey}`,
      context.config.stringify(value),
    )
  }
}

const STORAGES: Record<StorageVariants, _Storage> = {
  memory: new MemoryStorage(),
  localStorage: new LocalStorage(),
}

/**
 * Internal storage service that delegates to the appropriate storage implementation.
 *
 * Acts as a facade over different storage types (memory, localStorage) based on configuration.
 *
 * @internal
 */
class _StorageService implements _Storage {
  private storage: _Storage
  /**
   * Delegates to the underlying storage implementation's get method.
   */
  get: _Storage['get']
  /**
   * Delegates to the underlying storage implementation's set method.
   */
  set: _Storage['set']
  /**
   * Creates a new _StorageService instance for the specified storage type.
   *
   * @param storage - The storage variant to use ('memory' or 'localStorage')
   */
  constructor(storage: StorageVariants) {
    this.storage = STORAGES[storage]
    this.get = this.storage.get.bind(this.storage)
    this.set = this.storage.set.bind(this.storage)
  }
}

class Stores {
  private map: Record<string, Store> = {}
  get(scope: string, stable?: boolean): Store {
    this.map[scope] ??= new Store(scope, stable ? scope : undefined)
    return this.map[scope]
  }
  /** @internal */
  set(scope: string, store: Store): void {
    this.map[scope] = store
  }
}

const stores = new Stores()

/**
 * A store manages context values within a specific scope and provides subscription capabilities.
 *
 * Stores can be scoped to different contexts and provide reactive updates when values change.
 *
 * @public
 */
class Store {
  private subscriptions: Record<string, Set<(value: any) => void>> = {}
  /**
   * The unique scope identifier for this store.
   */
  readonly scope: string
  /**
   * Optional stable name for the scope, used for persistent scopes.
   */
  readonly scopeName: string | undefined
  /**
   * Creates a new Store instance with an optional scope and scope name.
   *
   * @param scope - Unique scope identifier (defaults to random string)
   * @param scopeName - Optional stable name for the scope (crucial for persistent scopes)
   *
   * @example
   *
   * ```ts
   * const store = new Store(undefined, 'stable-name')
   * ```
   */
  constructor(scope = getRandomString(), scopeName?: string) {
    this.scope = scope
    this.scopeName = scopeName
    stores.set(this.scope, this)
  }
  /**
   * Retrieves the current value of a context from this store's scope.
   *
   * @param context - The context to get the value from
   * @returns The current value of the context
   *
   * @example
   *
   * ```ts
   * const value = store.get(LocalContext)
   * ```
   */
  get<T>(context: Context<T, any>): T {
    const scope =
      this.scopeName ??
      (context.config.storage === 'memory' ? this.scope : 'global')
    return context.storage.get(context, scope)
  }
  /**
   * Sets the value of a context in this store's scope and notifies subscribers.
   *
   * @param context - The context to set the value for
   * @param value - The new value to set
   *
   * @example
   *
   * ```ts
   * store.set(LocalContext, true)
   * ```
   */
  set<T>(context: Context<T, any>, value: T): void {
    const scope =
      this.scopeName ??
      (context.config.storage === 'memory' ? this.scope : 'global')
    context.storage.set(context, scope, value)
    this.subscriptions[context.name]?.forEach((callback) => {
      callback(value)
    })
  }
  /**
   * Subscribes to changes in a context value without immediately calling the callback.
   *
   * @param context - The context to listen to
   * @param callback - Function to call when the value changes
   * @returns Unsubscribe function
   *
   * @example
   *
   * ```ts
   * const unsubscribe = store.listen(LocalContext, (value) => {
   *   console.log('Value changed:', value)
   * })
   * unsubscribe() // Stop listening
   * ```
   */
  listen<T>(
    context: Context<T, any>,
    callback: (value: T) => void,
  ): () => void {
    let subscriptionsSet = this.subscriptions[context.name]
    if (!subscriptionsSet) {
      subscriptionsSet = new Set()
      this.subscriptions[context.name] = subscriptionsSet
    }
    subscriptionsSet.add(callback)
    return () => {
      subscriptionsSet.delete(callback)
    }
  }
  /**
   * Subscribes to changes in a context value and immediately calls the callback with the current value.
   *
   * @param context - The context to subscribe to
   * @param callback - Function to call when the value changes
   * @returns Unsubscribe function
   *
   * @example
   *
   * ```ts
   * const unsubscribe = store.subscribe(LocalContext, (value) => {
   *   console.log('Current value:', value)
   * })
   * unsubscribe() // Stop listening
   * ```
   */
  subscribe<T>(
    context: Context<T, any>,
    callback: (value: T) => void,
  ): () => void {
    callback(this.get(context))
    return this.listen(context, callback)
  }
}

/**
 * Creates a new Store with a stable scope name.
 *
 * Useful if you want multiple subtrees to share the same context scope.
 *
 * It also allows you to create persistent scope (to sync via localStorage for example).
 *
 * @param name - Stable name for the store scope
 * @returns A new Store instance
 *
 * @example
 *
 * ```ts
 * const context = createContext('local', false, { storage: 'localStorage' })
 * const sharedStore = createStore('local_1')
 * // . . .
 * <ContextProvider context={LocalContext} store={sharedStore}>...</ContextProvider>
 * // . . .
 * <ContextProvider context={LocalContext} store={sharedStore}>...</ContextProvider>
 * ```
 *
 * @public
 */
const createStore = (name: string) => new Store(undefined, name)
/**
 * Gets the default global store instance.
 *
 * Useful if you want to create a global-scoped subtree under another scope.
 *
 * @returns The default global store
 *
 * @example
 *
 * ```ts
 * const globalStore = getDefaultStore()
 * // . . .
 * <ContextProvider context={LocalContext}>
 *   <ContextProvider context={LocalContext} store={globalStore}>...</ContextProvider>
 * </ContextProvider>
 * ```
 *
 * @public
 */
const getDefaultStore = () => stores.get('global')

export { Store, _StorageService, stores, createStore, getDefaultStore }
export type { StorageVariants, _Storage }
