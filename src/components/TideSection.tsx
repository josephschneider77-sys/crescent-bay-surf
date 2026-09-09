import type { SurfBundle } from '../api'
import {
  formatFt,
  formatRelativeCountdown,
  formatTime,
  parseLocal,
} from '../utils/format'
import { TideCurve } from './TideCurve'

type Props = { data: SurfBundle }

export function TideSection({ data }: Props) {
  const { tides } = data
  const now = new Date()
  const todayKey = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
  }).format(now)

  const todayEvents = tides.events.filter((e) => e.time.slice(0, 10) === todayKey)
  const list = todayEvents.length ? todayEvents : tides.events.slice(0, 4)

  const next = tides.events
    .map((e) => ({ ...e, at: parseLocal(e.time) }))
    .find((e) => e.at.getTime() > now.getTime())

  return (
    <section className="card" aria-labelledby="tides-heading">
      <div className="section-head">
        <h2 id="tides-heading">Tides</h2>
        {next && (
          <span className="pill">
            Next {next.type === 'H' ? 'high' : 'low'}{' '}
            {formatRelativeCountdown(next.at, now)}
          </span>
        )}
      </div>

      <TideCurve curve={tides.curve} events={tides.events} />

      <ul className="tide-list">
        {list.map((e) => {
          const past = parseLocal(e.time).getTime() < now.getTime()
          return (
            <li key={e.time} className={past ? 'past' : ''}>
              <span className={`tide-badge ${e.type === 'H' ? 'high' : 'low'}`}>
                {e.type === 'H' ? 'High' : 'Low'}
              </span>
              <span className="tide-time">{formatTime(e.time)}</span>
              <span className="tide-height">{formatFt(e.heightFt)}</span>
            </li>
          )
        })}
      </ul>

      <p className="fine-print">
        Station {tides.station}. {tides.stationNote} Heights in feet MLLW.
      </p>
    </section>
  )
}
