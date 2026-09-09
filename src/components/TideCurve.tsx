import type { TideCurvePoint, TideEvent } from '../api/types'
import { parseLocal } from '../utils/format'

type Props = {
  curve: TideCurvePoint[]
  events: TideEvent[]
}

export function TideCurve({ curve, events }: Props) {
  if (curve.length < 2) return null

  const now = Date.now()
  // Show ~18 hours centered on now when possible
  const windowMs = 18 * 60 * 60 * 1000
  const start = now - 2 * 60 * 60 * 1000
  const end = start + windowMs

  const pts = curve
    .map((p) => ({ ...p, ts: parseLocal(p.time).getTime() }))
    .filter((p) => p.ts >= start && p.ts <= end)

  if (pts.length < 2) {
    // fallback: first 18h of curve
    const fallback = curve.slice(0, Math.min(curve.length, 72)).map((p) => ({
      ...p,
      ts: parseLocal(p.time).getTime(),
    }))
    return <CurveSvg pts={fallback} events={events} now={now} />
  }

  return <CurveSvg pts={pts} events={events} now={now} />
}

function CurveSvg({
  pts,
  events,
  now,
}: {
  pts: { time: string; heightFt: number; ts: number }[]
  events: TideEvent[]
  now: number
}) {
  const w = 320
  const h = 120
  const padX = 8
  const padY = 16
  const minH = Math.min(...pts.map((p) => p.heightFt))
  const maxH = Math.max(...pts.map((p) => p.heightFt))
  const range = Math.max(0.5, maxH - minH)
  const t0 = pts[0].ts
  const t1 = pts[pts.length - 1].ts
  const tSpan = Math.max(1, t1 - t0)

  const xOf = (ts: number) => padX + ((ts - t0) / tSpan) * (w - padX * 2)
  const yOf = (ft: number) =>
    h - padY - ((ft - minH) / range) * (h - padY * 2)

  const d = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.ts).toFixed(1)} ${yOf(p.heightFt).toFixed(1)}`)
    .join(' ')

  const area =
    d +
    ` L ${xOf(pts[pts.length - 1].ts).toFixed(1)} ${h - 4}` +
    ` L ${xOf(pts[0].ts).toFixed(1)} ${h - 4} Z`

  const nowX = now >= t0 && now <= t1 ? xOf(now) : null

  const marks = events
    .map((e) => ({ ...e, ts: parseLocal(e.time).getTime() }))
    .filter((e) => e.ts >= t0 && e.ts <= t1)

  return (
    <svg
      className="tide-curve"
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Tide curve for the next hours"
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
        <line
          x1={nowX}
          x2={nowX}
          y1={padY / 2}
          y2={h - 4}
          stroke="rgba(2, 62, 59, 0.35)"
          strokeDasharray="3 3"
        />
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
