import { LOCATION, M_TO_FT } from './config'
import type { MarineCurrent, MarineHour } from './types'

type OpenMeteoMarine = {
  current: {
    time: string
    wave_height: number
    wave_direction: number
    wave_period: number
    wind_wave_height: number | null
    swell_wave_height: number | null
    swell_wave_direction: number | null
    swell_wave_period: number | null
  }
  hourly: {
    time: string[]
    wave_height: number[]
    wave_direction: number[]
    wave_period: number[]
    swell_wave_height: (number | null)[]
  }
}

export async function fetchMarine(): Promise<{
  current: MarineCurrent
  hourly: MarineHour[]
}> {
  const params = new URLSearchParams({
    latitude: String(LOCATION.lat),
    longitude: String(LOCATION.lon),
    timezone: LOCATION.timezone,
    forecast_days: '3',
    current: [
      'wave_height',
      'wave_direction',
      'wave_period',
      'wind_wave_height',
      'swell_wave_height',
      'swell_wave_direction',
      'swell_wave_period',
    ].join(','),
    hourly: [
      'wave_height',
      'wave_direction',
      'wave_period',
      'swell_wave_height',
    ].join(','),
  })

  const res = await fetch(
    `https://marine-api.open-meteo.com/v1/marine?${params}`,
  )
  if (!res.ok) throw new Error(`Marine API ${res.status}`)
  const data = (await res.json()) as OpenMeteoMarine

  const current: MarineCurrent = {
    time: data.current.time,
    waveHeightFt: data.current.wave_height * M_TO_FT,
    waveDir: data.current.wave_direction,
    wavePeriod: data.current.wave_period,
    windWaveHeightFt: (data.current.wind_wave_height ?? 0) * M_TO_FT,
    swellHeightFt: (data.current.swell_wave_height ?? 0) * M_TO_FT,
    swellDir: data.current.swell_wave_direction ?? data.current.wave_direction,
    swellPeriod: data.current.swell_wave_period ?? data.current.wave_period,
  }

  const nowIso = data.current.time.slice(0, 13)
  const startIdx = Math.max(
    0,
    data.hourly.time.findIndex((t) => t.startsWith(nowIso) || t >= data.current.time),
  )

  const hourly: MarineHour[] = data.hourly.time
    .slice(startIdx, startIdx + 24)
    .map((time, i) => {
      const idx = startIdx + i
      return {
        time,
        waveHeightFt: data.hourly.wave_height[idx] * M_TO_FT,
        waveDir: data.hourly.wave_direction[idx],
        wavePeriod: data.hourly.wave_period[idx],
        swellHeightFt: (data.hourly.swell_wave_height[idx] ?? 0) * M_TO_FT,
      }
    })

  return { current, hourly }
}
