import type { Context } from './context'
import type { Store } from './storage'

import { stores } from './storage'

// Ctrl+Shift+P > Fold All Block Comments

/**
 * A scoped context provides a convenient interface for interacting with a context within a specific store scope.
 *
 * It wraps the store's methods and provides reactive value access through getter/setter properties.
 *
 * @public
 */
class ScopedContext<T> {
  private store: Store
  private get: () => T
  private set: (value: T) => void
  /**
   * Subscribes to changes in the context value without immediately calling the callback.
   */
  public listen: (callback: (value: T) => void) => () => void
  /**
   * Subscribes to changes in the context value and immediately calls the callback with the current value.
   */
  public subscribe: (callback: (value: T) => void) => () => void
  /**
   * Creates a new ScopedContext instance bound to a specific context and store.
   *
   * @param context - The context to bind to
   * @param store - The store to use for this scoped context
   *
   * @example
   *
   * ```ts
   * const scopedContext = new ScopedContext(LocalContext, store)
   * ```
   */
  constructor(context: Context<T, any>, store: Store) {
    this.store = store
    this.get = this.store.get.bind<Store, [typeof context], [], T>(
      this.store,
      context,
    )
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    this.set = this.store.set.bind<Store, [typeof context], [T], void>(
      this.store,
      context,
    )
    this.listen = this.store.listen.bind<
      Store,
      [typeof context],
      [callback: (value: T) => void],
      () => void
    >(this.store, context)
    this.subscribe = this.store.subscribe.bind<
      Store,
      [typeof context],
      [callback: (value: T) => void],
      () => void
    >(this.store, context)
  }
  /**
   * The current value of the context.
   *
   * Can be set to update the context value.
   *
   * @example
   *
   * ```ts
   * const currentValue = scopedContext.value
   * scopedContext.value = true
   * ```
   */
  public get value() {
    return this.get()
  }
  public set value(value: T) {
    this.set(value)
  }
}

/**
 * Creates a ScopedContext instance for the given context, automatically determining the appropriate store scope.
 *
 * This function analyzes the DOM hierarchy to find the correct ContextProvider scope or falls back to global scope.
 *
 * @param context - The context to create a scoped instance for
 * @param node - Optional DOM element to analyze for context scope (defaults to global scope)
 * @returns A ScopedContext instance bound to the appropriate store
 *
 * @example
 *
 * ```ts
 * const context = useContext(LocalContext, node)
 * context.listen((value) => console.log('Changed:', value))
 * context.value = true
 * ```
 *
 * @public
 */
const useContext = <T>(
  context: Context<T, any>,
  node?: HTMLElement,
): ScopedContext<T> => {
  if (!node || import.meta.env.SSR) {
    const store = stores.get('global')
    return new ScopedContext(context, store)
  }

  let storeName: string | undefined
  let storeStable = false
  // TODO: check via `instanceof ContextProvider`
  if (node.matches(`context-provider[data-context-id="${context.name}"]`)) {
    storeStable = node.dataset.contextStable === 'true'
    if (context.config.storage === 'memory' || storeStable) {
      storeName = node.dataset.contextScope
    }
  }
  if (!storeName) {
    let parent = node.parentElement
    for (; !storeName && parent !== null; parent = parent.parentElement) {
      if (
        parent.matches(`context-provider[data-context-id="${context.name}"]`)
      ) {
        storeStable = parent.dataset.contextStable === 'true'
        if (context.config.storage === 'memory' || storeStable) {
          storeName = parent.dataset.contextScope
        }
      }
    }
  }
  storeName ??= 'global'

  const store = stores.get(storeName, storeStable)
  return new ScopedContext(context, store)
}

export { useContext }
export type { ScopedContext }
