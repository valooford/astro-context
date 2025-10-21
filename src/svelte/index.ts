import type { Context } from '../index'

import { readable } from 'svelte/store'

import { useContext } from '../index'

const useContextHook = <T>(
  context: Context<T, any>,
  node?: HTMLElement | null,
) => {
  let valueSetter: (value: T) => void = context.set.bind(context)
  const value = readable<T>(context.get(), (set) => {
    const scopedContext = useContext(context, node ?? undefined)
    const unsubscribe = scopedContext.listen((v) => {
      set(v)
    })
    valueSetter = (v: T) => {
      scopedContext.value = v
    }
    return unsubscribe
  })
  return [
    value,
    (v: T) => {
      valueSetter(v)
    },
  ] as const
}

export { useContextHook as useContext }
