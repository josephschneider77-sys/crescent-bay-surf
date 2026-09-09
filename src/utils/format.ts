const TZ = 'America/Los_Angeles'

export function formatTemp(f: number): string {
  return `${Math.round(f)}°`
}

export function formatFt(metersOrFt: number, fromMeters = false): string {
  const ft = fromMeters ? metersOrFt * 3.28084 : metersOrFt
  return `${ft.toFixed(1)} ft`
}

export function formatMph(v: number): string {
  return `${Math.round(v)} mph`
}

export function formatPeriod(s: number): string {
  return `${s.toFixed(0)}s`
}

export function compassFromDeg(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const i = Math.round(((deg % 360) + 360) % 360 / 22.5) % 16
  return dirs[i]
}

export function formatTime(isoOrLocal: string): string {
  // NOAA: "2026-09-09 14:40" or Open-Meteo ISO
  const d = parseLocal(isoOrLocal)
  return d.toLocaleTimeString('en-US', {
    timeZone: TZ,
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatHour(iso: string): string {
  const d = parseLocal(iso)
  return d.toLocaleTimeString('en-US', {
    timeZone: TZ,
    hour: 'numeric',
  })
}

export function formatWeekday(iso: string): string {
  const d = parseLocal(iso)
  return d.toLocaleDateString('en-US', {
    timeZone: TZ,
    weekday: 'short',
  })
}

export function formatDateLong(d = new Date()): string {
  return d.toLocaleDateString('en-US', {
    timeZone: TZ,
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

export function formatRelativeCountdown(target: Date, now = new Date()): string {
  const ms = target.getTime() - now.getTime()
  if (ms <= 0) return 'now'
  const mins = Math.round(ms / 60000)
  if (mins < 60) return `in ${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `in ${h}h` : `in ${h}h ${m}m`
}

export function parseLocal(s: string): Date {
  // Treat NOAA "YYYY-MM-DD HH:mm" as Pacific wall time by appending offset guess via Date parsing of ISO-like
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(s)) {
    // Interpret as local PT by constructing ISO with explicit no-Z and letting browser... 
    // Safer: append America/Los_Angeles via temporal-like approach — use Date with T and assume PT offset.
    // For countdown accuracy, attach -07:00/-08:00 based on DST. Sept is PDT (-07:00).
    const iso = s.replace(' ', 'T')
    const offset = pacificOffsetFor(iso)
    return new Date(`${iso}:00${offset}`)
  }
  // Open-Meteo returns local times without Z when timezone param set — treat similarly
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s) && !/[zZ]|[+-]\d{2}:\d{2}$/.test(s)) {
    const offset = pacificOffsetFor(s)
    const base = s.length === 16 ? `${s}:00` : s
    return new Date(`${base}${offset}`)
  }
  return new Date(s)
}

function pacificOffsetFor(isoLocal: string): string {
  // Rough DST: 2nd Sun Mar – 1st Sun Nov → -07:00, else -08:00
  const y = Number(isoLocal.slice(0, 4))
  const m = Number(isoLocal.slice(5, 7))
  const d = Number(isoLocal.slice(8, 10))
  if (m > 3 && m < 11) return '-07:00'
  if (m < 3 || m > 11) return '-08:00'
  if (m === 3) {
    const secondSunday = nthWeekdayOfMonth(y, 2, 0, 2) // March Sunday #2
    return d >= secondSunday ? '-07:00' : '-08:00'
  }
  // November
  const firstSunday = nthWeekdayOfMonth(y, 10, 0, 1)
  return d < firstSunday ? '-07:00' : '-08:00'
}

function nthWeekdayOfMonth(year: number, monthIndex: number, weekday: number, n: number): number {
  let count = 0
  for (let day = 1; day <= 31; day++) {
    const dt = new Date(Date.UTC(year, monthIndex, day))
    if (dt.getUTCMonth() !== monthIndex) break
    if (dt.getUTCDay() === weekday) {
      count++
      if (count === n) return day
    }
  }
  return 1
}

export { TZ }
