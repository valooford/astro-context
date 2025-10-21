import type { Context } from '../index'
import type { RefObject } from 'preact'

import { useEffect, useState } from 'preact/hooks'

import { useContext } from '../index'

const useContextHook = <T>(
  context: Context<T, any>,
  nodeRef?: RefObject<HTMLElement | undefined>,
) => {
  const [value, setValue] = useState<T>(context.get())
  const [valueSetter, setValueSetter] = useState<(value: T) => void>(() =>
    context.set.bind(context),
  )
  useEffect(() => {
    const scopedContext = useContext(context, nodeRef?.current ?? undefined)
    const unsubscribe = scopedContext.listen(setValue)
    setValueSetter(() => (v: T) => {
      scopedContext.value = v
    })
    return unsubscribe
  }, [context])
  return [value, valueSetter] as const
}

// interface ContextProviderProps {
//   context: Context<any, any>
//   store?: Store
//   children: ComponentChildren
// }

// const ContextProvider: FunctionComponent<ContextProviderProps> = ({
//   context,
//   store,
//   children,
// }) => h('context-provider', context.providerTraits(store), children)

export { useContextHook as useContext }
