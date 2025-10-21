declare module '*.astro' {
  type AstroComponent = (props: Record<string, unknown>) => string
  const Component: AstroComponent
  export default Component
}

interface IntrinsicElements {
  'context-provider': Pick<HTMLAttributes, 'children'> & {
    'data-context-id': string
    'data-context-scope': string
    'data-context-stable'?: 'true' | 'false'
  }
}
