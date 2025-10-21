/**
 * Custom HTML element that provides context scope for child components.
 * This element acts as a boundary for context scoping and is automatically styled as display: contents.
 *
 * @internal
 */
class ContextProvider extends HTMLElement {
  /**
   * Creates a new ContextProvider element and sets its display style to contents.
   */
  constructor() {
    super()
    this.style.display = 'contents'
  }
}

if (!customElements.get('context-provider')) {
  customElements.define('context-provider', ContextProvider)
}

export { ContextProvider }
