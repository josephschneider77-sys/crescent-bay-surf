import { NOAA_STATION } from './config'
import type { TideCurvePoint, TideEvent } from './types'

type NoaaPrediction = { t: string; v: string; type?: string }

function todayYmdPacific(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date()) // YYYY-MM-DD
}

function buildNoaaUrl(interval: 'hilo' | '15'): string {
  const begin = todayYmdPacific().replace(/-/g, '')
  const params = new URLSearchParams({
    product: 'predictions',
    application: 'crescent-bay-surf',
    begin_date: begin,
    range: interval === 'hilo' ? '48' : '36',
    datum: 'MLLW',
    station: NOAA_STATION.id,
    time_zone: 'lst_ldt',
    units: 'english',
    interval,
    format: 'json',
  })
  return params.toString()
}

async function fetchNoaaJson(query: string): Promise<{ predictions?: NoaaPrediction[] }> {
  // Dev: Vite proxy avoids CORS. Prod: try NOAA direct, then CORS-friendly mirrors.
  const candidates = import.meta.env.DEV
    ? [`/api/noaa?${query}`]
    : [
        `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${query}`,
        `https://corsproxy.io/?${encodeURIComponent(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${query}`)}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${query}`)}`,
      ]

  let lastError: unknown
  for (const url of candidates) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`NOAA ${res.status}`)
      const data = (await res.json()) as { predictions?: NoaaPrediction[]; error?: unknown }
      if (!data.predictions) throw new Error('NOAA response missing predictions')
      return data
    } catch (err) {
      lastError = err
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Tide fetch failed')
}

export async function fetchTides(): Promise<{
  events: TideEvent[]
  curve: TideCurvePoint[]
  station: string
  stationNote: string
}> {
  const [hilo, curveRaw] = await Promise.all([
    fetchNoaaJson(buildNoaaUrl('hilo')),
    fetchNoaaJson(buildNoaaUrl('15')),
  ])

  const events: TideEvent[] = (hilo.predictions ?? [])
    .filter((p) => p.type === 'H' || p.type === 'L')
    .map((p) => ({
      time: p.t,
      heightFt: Number(p.v),
      type: p.type as 'H' | 'L',
    }))

  const curve: TideCurvePoint[] = (curveRaw.predictions ?? []).map((p) => ({
    time: p.t,
    heightFt: Number(p.v),
  }))

  return {
    events,
    curve,
    station: `${NOAA_STATION.id} · ${NOAA_STATION.label}`,
    stationNote: NOAA_STATION.note,
  }
}
