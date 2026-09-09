import { BEACHES, type Beach } from '../api'

type Props = {
  beach: Beach
  onChange: (beach: Beach) => void
  disabled?: boolean
}

export function BeachPicker({ beach, onChange, disabled }: Props) {
  return (
    <div className="beach-picker">
      <label className="beach-picker-label" htmlFor="beach-select">
        Beach
      </label>
      <div className="beach-select-wrap">
        <select
          id="beach-select"
          className="beach-select"
          value={beach.id}
          disabled={disabled}
          onChange={(e) => {
            const next = BEACHES.find((b) => b.id === e.target.value)
            if (next) onChange(next)
          }}
          aria-label="Select Laguna Beach spot"
        >
          {BEACHES.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
              {b.area ? ` · ${b.area}` : ''}
            </option>
          ))}
        </select>
        <span className="beach-select-chevron" aria-hidden>
          ▾
        </span>
      </div>

      <div className="beach-chips" role="listbox" aria-label="Quick beach pick">
        {BEACHES.map((b) => {
          const active = b.id === beach.id
          return (
            <button
              key={b.id}
              type="button"
              role="option"
              aria-selected={active}
              className={`beach-chip${active ? ' active' : ''}`}
              disabled={disabled}
              onClick={() => onChange(b)}
            >
              {b.shortName}
            </button>
          )
        })}
      </div>
    </div>
  )
}
