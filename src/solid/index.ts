import type { Context } from '../index'

import { createEffect, createSignal } from 'solid-js'

import { useContext } from '../index'

const useContextHook = <T>(
  context: Context<T, any>,
  node?: HTMLElement | null,
) => {
  const [value, setValue] = createSignal<T>(context.get())
  const [valueSetter, setValueSetter] = createSignal<(value: T) => void>(
    context.set.bind(context),
  )
  createEffect(() => {
    const scopedContext = useContext(context, node ?? undefined)
    const unsubscribe = scopedContext.listen((v) => {
      setValue(() => v)
    })
    setValueSetter(() => (v: T) => {
      scopedContext.value = v
    })
    return unsubscribe
  })
  return [value, valueSetter] as const
}

export { useContextHook as useContext }
