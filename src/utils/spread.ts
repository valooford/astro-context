/**
 * Safely spread properties from a source object to a target object.
 */
export const spread = <T>(target: T, src: Partial<T>) => {
  for (const key in src) {
    if (
      src[key] !== undefined &&
      Object.prototype.hasOwnProperty.call(src, key)
    ) {
      target[key as keyof T] = src[key] as T[keyof T]
    }
  }
  return target
}
