import type { Component, JSX } from 'solid-js'

import { useContext } from 'astro-context/solid'

import { LocalContext, SessionContext } from './model'

interface Props {
  variant?: 'global' | 'session' | 'local'
}

const SolidComponent: Component<Props> = ({ variant = 'local' }) => {
  let element!: HTMLDivElement
  const [context, setContext] = useContext(
    variant === 'session' ? SessionContext : LocalContext,
    element,
  )

  const onChange: JSX.ChangeEventHandler<HTMLInputElement, InputEvent> = (
    e,
  ) => {
    setContext()(e.currentTarget.checked)
  }

  return (
    <div
      class={['tile', variant === 'session' && 'context_session']
        .filter(Boolean)
        .join(' ')}
      ref={element}
    >
      <div class="tile__header">
        <div class="tile__icon">
          <span class="material-symbols-outlined">code_blocks</span>
        </div>
        <div
          class={['badge', variant === 'session' && 'badge_alt']
            .filter(Boolean)
            .join(' ')}
        ></div>
      </div>
      <div class="tile__title">SolidJS</div>
      <div class="tile__controls">
        <label>
          <input type="checkbox" checked={context()} onChange={onChange} />
          Activate
        </label>
      </div>
    </div>
  )
}

export default SolidComponent
