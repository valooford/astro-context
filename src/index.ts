/**
 * This package provides a way to use DOM hierarchy to manage context state.
 *
 * It's framework-agnostic and not limited to Astro.
 *
 * ## Installation
 *
 * ```bash
 * npm install -d astro-context
 * ```
 *
 * ## Basic Usage
 *
 * 1. **Create a context** - Define your shared state:
 *
 * ```ts
 * // src/contexts/counter.ts
 * import { createContext } from 'astro-context'
 *
 * export const CounterContext = createContext('counter', 0)
 * ```
 *
 * 2. **Wrap components with ContextProvider** - Provide scope for your components:
 *
 * ```astro
 * ---
 * //src/pages/index.astro
 *
 * import { ContextProvider } from 'astro-context'
 * import CounterContext from '../contexts/counter'
 * import ReactCounter from '../components/ReactCounter'
 * import VueCounter from '../components/VueCounter'
 * ---
 *
 * <ContextProvider context={CounterContext}>
 *   <ReactCounter client:load />
 *   <VueCounter client:load />
 * </ContextProvider>
 * ```
 *
 * 3. **Use context in components** - Access and modify state in your framework components:
 *
 * ```tsx
 * // React component
 *
 * import { useContext } from 'astro-context/react'
 * import { CounterContext } from '../contexts/counter'
 *
 * export default function ReactCounter() {
 *   const ref = useRef<HTMLDivElement>(null)
 *   const [count, setCount] = useContext(CounterContext, ref)
 *
 *   return (
 *     <div ref={ref}>
 *       <p>Count: {count}</p>
 *       <button onClick={() => setCount(count + 1)}>Increment</button>
 *     </div>
 *   )
 * }
 * ```
 *
 * ```vue
 * <!-- Vue component -->
 *
 * <script setup>
 *   import { useContext } from 'astro-context/vue'
 *   import { CounterContext } from '../contexts/counter'
 *
 *   const [count, setCount] = useContext(CounterContext)
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Count: {{ count }}</p>
 *     <button @click="setCount(count + 1)">Increment</button>
 *   </div>
 * </template>
 * ```
 *
 * ## Key Features
 *
 * - **Framework Agnostic**: Works with React, Preact, SolidJS, Vue, Svelte, and vanilla JS (Alpine.js included)
 * - **Scoped State**: Create isolated state scopes using `ContextProvider`
 * - **Persistence**: Scopes data can be persisted to localStorage
 * - **Type Safe**: Full TypeScript support with proper type inference
 * - **Astro Optimized**: Designed specifically for Astro's island architecture (yet the Context mechanism can be useful in any web application)
 *
 * @packageDocumentation
 */

/** */

export { ContextConfig } from './config'
export {
  /**
   * Astro component that provides context scope for child components.
   * This component wraps children in a context-provider custom element with the appropriate data attributes.
   *
   * @public
   */
  default as ContextProvider,
} from './ContextProvider.astro'
export { createContext } from './createContext'
export { createStore, getDefaultStore } from './storage'
export { useContext } from './useContext'

export type { Context, _GetInitialValueFn } from './context'
export type { CreateContextFn } from './createContext'
export type {
  Store,
  StorageVariants,
  _StorageService,
  _Storage,
} from './storage'
export type { ScopedContext } from './useContext'
