import type { StorageVariants } from './storage'

//* Ctrl+Shift+P > Fold All Block Comments

/**
 * Configuration class for Context instances that defines storage type and serialization behavior.
 *
 * Controls how context values are stored and serialized across different storage mechanisms.
 *
 * @public
 */
class ContextConfig<T, Storage extends StorageVariants = 'memory'> {
  /**
   * The storage type to use for this context.
   */
  readonly storage: Storage
  /**
   * Function used to serialize values for storage.
   */
  readonly stringify: (value: T) => string
  /**
   * Creates a new ContextConfig instance.
   *
   * @param storage - Storage type ('memory' or 'localStorage')
   * @param stringify - Custom serialization function (defaults to JSON.stringify)
   *
   * @example
   *
   * ```ts
   * const config = new ContextConfig('localStorage', (value) => JSON.stringify(value))
   * ```
   */
  constructor(storage?: Storage, stringify?: (value: T) => string) {
    this.storage = storage ?? ('memory' as Storage)
    this.stringify = stringify ?? JSON.stringify
  }
}

/**
 * Namespace containing utility types for ContextConfig.
 *
 * @public
 */
namespace ContextConfig {
  /**
   * Infers the storage type from a ContextConfig instance.
   */
  export type inferStorage<C extends ContextConfig<any, any>> =
    C extends ContextConfig<infer Storage>
      ? Storage
      : inferStorage<ContextConfig<any>>
}

export { ContextConfig }
