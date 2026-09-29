import type { SurfBundle } from '../api'
import {
  compassFromDeg,
  formatFt,
  formatMph,
  formatPeriod,
  formatRelativeCountdown,
  formatTemp,
  formatWeekday,
  parseLocal,
} from '../utils/format'
import { weatherEmoji, weatherLabel } from '../utils/weatherCodes'

type Props = { data: SurfBundle }

export function NowSummary({ data }: Props) {
  const { weather, marine, tides, waterTemp } = data
  const now = new Date()
  const nextTide = tides.events
    .map((e) => ({ ...e, at: parseLocal(e.time) }))
    .find((e) => e.at.getTime() > now.getTime())

  return (
    <section className="card hero-card" aria-labelledby="now-heading">
      <div className="hero-top">
        <div>
          <p className="eyebrow">Right now</p>
          <h2 id="now-heading" className="hero-temp">
            <span className="emoji" aria-hidden>
              {weatherEmoji(weather.current.weatherCode)}
            </span>
            {formatTemp(weather.current.tempF)}
          </h2>
          <p className="hero-sub">
            {weatherLabel(weather.current.weatherCode)} · Feels{' '}
            {formatTemp(weather.current.feelsLikeF)}
          </p>
        </div>
        <div className="hero-wave">
          <p className="metric-label">Waves</p>
          <p className="metric-value">{formatFt(marine.current.waveHeightFt)}</p>
          <p className="metric-sub">
            {formatPeriod(marine.current.wavePeriod)} ·{' '}
            {compassFromDeg(marine.current.waveDir)}
          </p>
        </div>
      </div>

      <div className="hero-water" aria-label="Ocean water temperature">
        <div className="hero-water-now">
          <p className="metric-label">
            <span aria-hidden>🌊</span> Water temp
          </p>
          <p className="metric-value water-value">
            {waterTemp ? `${Math.round(waterTemp.tempF)}°F` : '—'}
          </p>
        </div>
        {waterTemp && waterTemp.days.length > 0 && (
          <ul className="water-trend" aria-label="Water temperature trend">
            {waterTemp.days.slice(0, 3).map((d, i) => (
              <li key={d.date}>
                <span className="water-day">
                  {i === 0 ? 'Today' : formatWeekday(d.date)}
                </span>
                <span className="water-range">
                  {Math.round(d.minF) === Math.round(d.maxF)
                    ? `${Math.round(d.maxF)}°`
                    : `${Math.round(d.minF)}–${Math.round(d.maxF)}°`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="hero-grid">
        <div>
          <p className="metric-label">Wind</p>
          <p className="metric-value sm">
            {formatMph(weather.current.windMph)}
          </p>
          <p className="metric-sub">{compassFromDeg(weather.current.windDir)}</p>
        </div>
        <div>
          <p className="metric-label">Swell</p>
          <p className="metric-value sm">
            {formatFt(marine.current.swellHeightFt)}
          </p>
          <p className="metric-sub">
            {formatPeriod(marine.current.swellPeriod)} ·{' '}
            {compassFromDeg(marine.current.swellDir)}
          </p>
        </div>
        <div>
          <p className="metric-label">Next tide</p>
          {nextTide ? (
            <>
              <p className="metric-value sm">
                {nextTide.type === 'H' ? 'High' : 'Low'}
              </p>
              <p className="metric-sub">
                {formatFt(nextTide.heightFt)} ·{' '}
                {formatRelativeCountdown(nextTide.at, now)}
              </p>
            </>
          ) : (
            <p className="metric-sub">—</p>
          )}
        </div>
      </div>
    </section>
  )
}
