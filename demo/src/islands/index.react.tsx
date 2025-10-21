import type { ChangeEvent, FC } from 'react'

import { useContext } from 'astro-context/react'
import { useRef } from 'react'

import { LocalContext, SessionContext } from './model'

interface Props {
  variant?: 'global' | 'session' | 'local'
}

const Component: FC<Props> = ({ variant = 'local' }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [context, setContext] = useContext(
    variant === 'session' ? SessionContext : LocalContext,
    ref,
  )

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContext(e.target.checked)
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
          className={['badge', variant === 'session' && 'badge_alt']
            .filter(Boolean)
            .join(' ')}
        ></div>
      </div>
      <div className="tile__title">React</div>
      <div className="tile__controls">
        <label>
          <input type="checkbox" checked={context} onChange={onChange} />
          Activate
        </label>
      </div>
    </div>
  )
}

export default Component
