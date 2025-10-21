import type { Context } from '../index'
import type { Ref, ShallowRef } from 'vue'

import { onWatcherCleanup, ref, watchEffect } from 'vue'

import { useContext } from '../index'

const useContextHook = <T>(
  context: Context<T, any>,
  nodeRef?: ShallowRef<HTMLElement | null>,
): [ReturnType<typeof ref<T>>, Ref<(value: T) => void>] => {
  const value = ref(context.get())
  const valueSetter = ref<(value: T) => void>(context.set.bind(context))
  watchEffect(() => {
    const scopedContext = useContext(context, nodeRef?.value ?? undefined)
    const unsubscribe = scopedContext.listen((v) => {
      value.value = v
    })
    valueSetter.value = (v: T) => {
      scopedContext.value = v
    }
    onWatcherCleanup(unsubscribe)
  })
  return [value, valueSetter] as ReturnType<typeof useContextHook<T>>
}

export { useContextHook as useContext }
