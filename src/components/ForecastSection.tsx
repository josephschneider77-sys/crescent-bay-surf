import type { SurfBundle } from '../api'
import {
  formatTemp,
  formatTime,
  formatWeekday,
  formatHour,
} from '../utils/format'
import { weatherEmoji, weatherLabel } from '../utils/weatherCodes'

type Props = { data: SurfBundle }

export function ForecastSection({ data }: Props) {
  const { hourly, daily, current } = data.weather

  return (
    <section className="card" aria-labelledby="forecast-heading">
      <div className="section-head">
        <h2 id="forecast-heading">Forecast</h2>
      </div>

      <p className="subhead">Hourly</p>
      <div className="scroll-row" role="list">
        {hourly.slice(0, 16).map((h) => (
          <div className="chip" role="listitem" key={h.time}>
            <span className="chip-time">{formatHour(h.time)}</span>
            <span className="chip-emoji" aria-hidden>
              {weatherEmoji(h.weatherCode)}
            </span>
            <span className="chip-main">{formatTemp(h.tempF)}</span>
            <span className="chip-sub">{h.precipProb}% rain</span>
          </div>
        ))}
      </div>

      <p className="subhead">7-day</p>
      <ul className="day-list">
        {daily.map((d, i) => (
          <li key={d.date}>
            <span className="day-name">
              {i === 0 ? 'Today' : formatWeekday(`${d.date}T12:00`)}
            </span>
            <span className="day-cond" aria-label={weatherLabel(d.weatherCode)}>
              <span aria-hidden>{weatherEmoji(d.weatherCode)}</span>
              <span className="day-label">{weatherLabel(d.weatherCode)}</span>
            </span>
            <span className="day-temps">
              <strong>{formatTemp(d.tempMaxF)}</strong>
              <span>{formatTemp(d.tempMinF)}</span>
            </span>
            <span className="day-rain">{d.precipProbMax}%</span>
          </li>
        ))}
      </ul>

      <p className="fine-print">
        Sunrise {formatTime(daily[0]?.sunrise ?? current.time)} · Sunset{' '}
        {formatTime(daily[0]?.sunset ?? current.time)} · Open-Meteo
      </p>
    </section>
  )
}
