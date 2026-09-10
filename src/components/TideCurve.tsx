import type { TideCurvePoint, TideEvent } from '../api/types'
import { parseLocal } from '../utils/format'

type Props = {
  curve: TideCurvePoint[]
  events: TideEvent[]
}

type Point = { time: string; heightFt: number; ts: number }

/** Interpolate tide height (ft) at timestamp from nearby curve points. */
function heightAt(pts: Point[], ts: number): number {
  if (pts.length === 0) return 0
  if (ts <= pts[0].ts) return pts[0].heightFt
  if (ts >= pts[pts.length - 1].ts) return pts[pts.length - 1].heightFt
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    if (a.ts <= ts && ts <= b.ts) {
      const span = Math.max(1, b.ts - a.ts)
      const t = (ts - a.ts) / span
      return a.heightFt + t * (b.heightFt - a.heightFt)
    }
  }
  return pts[pts.length - 1].heightFt
}

export function TideCurve({ curve, events }: Props) {
  if (curve.length < 2) return null

  const now = Date.now()
  // Fixed ~18h viewport with now at horizontal center (±9h)
  const halfWindowMs = 9 * 60 * 60 * 1000
  const domainStart = now - halfWindowMs
  const domainEnd = now + halfWindowMs

  const all: Point[] = curve.map((p) => ({
    ...p,
    ts: parseLocal(p.time).getTime(),
  }))

  let pts = all.filter((p) => p.ts >= domainStart && p.ts <= domainEnd)

  if (pts.length < 2) {
    // Fallback: nearest stretch of available curve data
    pts = all.slice(0, Math.min(all.length, 72))
    if (pts.length < 2) return null
  }

  return (
    <CurveSvg
      pts={pts}
      events={events}
      now={now}
      domainStart={domainStart}
      domainEnd={domainEnd}
    />
  )
}

function CurveSvg({
  pts,
  events,
  now,
  domainStart,
  domainEnd,
}: {
  pts: Point[]
  events: TideEvent[]
  now: number
  domainStart: number
  domainEnd: number
}) {
  const w = 320
  const h = 120
  const padX = 8
  const padY = 16
  const minH = Math.min(...pts.map((p) => p.heightFt))
  const maxH = Math.max(...pts.map((p) => p.heightFt))
  const range = Math.max(0.5, maxH - minH)
  // Domain is fixed around now so current time stays at chart center
  const tSpan = Math.max(1, domainEnd - domainStart)

  const xOf = (ts: number) => padX + ((ts - domainStart) / tSpan) * (w - padX * 2)
  const yOf = (ft: number) =>
    h - padY - ((ft - minH) / range) * (h - padY * 2)

  const d = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.ts).toFixed(1)} ${yOf(p.heightFt).toFixed(1)}`)
    .join(' ')

  const area =
    d +
    ` L ${xOf(pts[pts.length - 1].ts).toFixed(1)} ${h - 4}` +
    ` L ${xOf(pts[0].ts).toFixed(1)} ${h - 4} Z`

  const nowX = now >= domainStart && now <= domainEnd ? xOf(now) : null
  const nowY = nowX !== null ? yOf(heightAt(pts, now)) : null

  const marks = events
    .map((e) => ({ ...e, ts: parseLocal(e.time).getTime() }))
    .filter((e) => e.ts >= domainStart && e.ts <= domainEnd)

  return (
    <svg
      className="tide-curve"
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Tide curve centered on the current time"
    >
      <defs>
        <linearGradient id="tideFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(25, 119, 162, 0.35)" />
          <stop offset="100%" stopColor="rgba(25, 119, 162, 0.02)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#tideFill)" />
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      {nowX !== null && (
        <>
          <line
            x1={nowX}
            x2={nowX}
            y1={padY / 2}
            y2={h - 4}
            stroke="rgba(2, 62, 59, 0.35)"
            strokeDasharray="3 3"
          />
          {nowY !== null && (
            <circle
              cx={nowX}
              cy={nowY}
              r={5}
              fill="var(--accent)"
              stroke="#ffffff"
              strokeWidth="2"
            />
          )}
        </>
      )}
      {marks.map((m) => (
        <circle
          key={m.time}
          cx={xOf(m.ts)}
          cy={yOf(m.heightFt)}
          r={4}
          fill={m.type === 'H' ? 'var(--accent-warm)' : 'var(--accent)'}
          stroke="#ffffff"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  )
}
