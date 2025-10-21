import type { Context } from '../index'
import type { RefObject } from 'react'

import { useEffect, useState } from 'react'

import { useContext } from '../index'

const useContextHook = <T>(
  context: Context<T, any>,
  nodeRef?: RefObject<HTMLElement | null | undefined>,
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

// interface ContextProviderProps extends PropsWithChildren {
//   context: Context<any, any>
//   store?: Store
// }

// const ContextProvider: FC<ContextProviderProps> = ({
//   context,
//   store,
//   children,
// }) => createElement('context-provider', context.providerTraits(store), children)

export { useContextHook as useContext }
