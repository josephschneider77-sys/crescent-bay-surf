import type { SurfBundle } from '../api'
import {
  compassFromDeg,
  formatFt,
  formatHour,
  formatPeriod,
} from '../utils/format'

type Props = { data: SurfBundle }

export function WaveSection({ data }: Props) {
  const { marine, weather } = data
  const c = marine.current

  return (
    <section className="card" aria-labelledby="waves-heading">
      <div className="section-head">
        <h2 id="waves-heading">Waves & wind</h2>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <p className="metric-label">Significant height</p>
          <p className="metric-value">{formatFt(c.waveHeightFt)}</p>
        </div>
        <div className="stat">
          <p className="metric-label">Period</p>
          <p className="metric-value">{formatPeriod(c.wavePeriod)}</p>
        </div>
        <div className="stat">
          <p className="metric-label">Direction</p>
          <p className="metric-value">
            {compassFromDeg(c.waveDir)}
            <span className="unit"> {Math.round(c.waveDir)}°</span>
          </p>
        </div>
        <div className="stat">
          <p className="metric-label">Wind</p>
          <p className="metric-value">
            {Math.round(weather.current.windMph)}
            <span className="unit"> mph</span>
          </p>
          <p className="metric-sub">{compassFromDeg(weather.current.windDir)}</p>
        </div>
        <div className="stat">
          <p className="metric-label">Swell</p>
          <p className="metric-value sm">{formatFt(c.swellHeightFt)}</p>
          <p className="metric-sub">
            {formatPeriod(c.swellPeriod)} · {compassFromDeg(c.swellDir)}
          </p>
        </div>
        <div className="stat">
          <p className="metric-label">Wind waves</p>
          <p className="metric-value sm">{formatFt(c.windWaveHeightFt)}</p>
        </div>
      </div>

      <p className="subhead">Next hours</p>
      <div className="scroll-row" role="list">
        {marine.hourly.slice(0, 12).map((h) => (
          <div className="chip" role="listitem" key={h.time}>
            <span className="chip-time">{formatHour(h.time)}</span>
            <span className="chip-main">{formatFt(h.waveHeightFt)}</span>
            <span className="chip-sub">
              {formatPeriod(h.wavePeriod)} {compassFromDeg(h.waveDir)}
            </span>
          </div>
        ))}
      </div>
      <p className="fine-print">
        Marine forecast from Open-Meteo near Crescent Bay ({data.marine.current.time}).
      </p>
    </section>
  )
}
