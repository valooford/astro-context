import type { FunctionComponent } from 'preact'
import type { FormEventHandler } from 'preact/compat'

import { useContext } from 'astro-context/preact'
import { useRef } from 'preact/hooks'

import { LocalContext, SessionContext } from './model'

interface Props {
  variant?: 'global' | 'session' | 'local'
}

const Component: FunctionComponent<Props> = ({ variant = 'local' }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [context, setContext] = useContext(
    variant === 'session' ? SessionContext : LocalContext,
    ref,
  )

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const onInput: FormEventHandler<HTMLInputElement> = (e) => {
    setContext(e.currentTarget.checked)
  }

  return (
    <div
      className={['tile', variant === 'session' && 'context_session']
        .filter(Boolean)
        .join(' ')}
      ref={ref}
    >
      <div className="tile__header">
        <div className="tile__icon">
          <span className="material-symbols-outlined">code_blocks</span>
        </div>
        <div
          class={['badge', variant === 'session' && 'badge_alt']
            .filter(Boolean)
            .join(' ')}
        ></div>
      </div>
      <div className="tile__title">Preact</div>
      <div className="tile__controls">
        <label>
          <input type="checkbox" checked={context} onInput={onInput} />
          Activate
        </label>
      </div>
    </div>
  )
}

export default Component
