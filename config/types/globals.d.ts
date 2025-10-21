//? Smarter types for Object iteration methods (https://github.com/microsoft/TypeScript/issues/35101)
interface ObjectConstructor {
  keys<T>(o: T): (keyof T)[]
  values<T>(o: T): T extends ArrayLike<infer U> ? U[] : T[keyof T][]
  entries<T>(
    o: T,
  ): T extends ArrayLike<infer U>
    ? [string, U][]
    : { [K in keyof T]: [K, T[K]] }[keyof T][]
}
