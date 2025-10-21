import { createContext } from 'astro-context'

export const LocalContext = createContext('local', false)

export const SessionContext = createContext('session', false, {
  storage: 'localStorage',
})
