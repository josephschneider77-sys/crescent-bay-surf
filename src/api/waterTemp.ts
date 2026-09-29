import { TIMEZONE, type Beach } from './beaches'
import type { WaterTemp } from './types'

type OpenMeteoSst = {
  current?: { time: string; sea_surface_temperature: number | null }
  daily?: {
    time: string[]
    sea_surface_temperature_max: (number | null)[]
    sea_surface_temperature_min: (number | null)[]
  }
}

/**
 * Ocean water (sea surface) temperature in °F from the free, keyless,
 * CORS-enabled Open-Meteo Marine API. Never throws — returns null on any
 * failure so the rest of the conditions still render.
 */
export async function fetchWaterTemp(beach: Beach): Promise<WaterTemp | null> {
  try {
    const params = new URLSearchParams({
      latitude: String(beach.lat),
      longitude: String(beach.lon),
      timezone: TIMEZONE,
      forecast_days: '3',
      temperature_unit: 'fahrenheit',
      current: 'sea_surface_temperature',
      daily: 'sea_surface_temperature_max,sea_surface_temperature_min',
    })
    const res = await fetch(`https://marine-api.open-meteo.com/v1/marine?${params}`)
    if (!res.ok) return null
    const data = (await res.json()) as OpenMeteoSst
    const tempF = data.current?.sea_surface_temperature
    if (typeof tempF !== 'number' || !Number.isFinite(tempF)) return null
    const days = (data.daily?.time ?? [])
      .map((date, i) => ({
        date,
        maxF: data.daily?.sea_surface_temperature_max[i] ?? null,
        minF: data.daily?.sea_surface_temperature_min[i] ?? null,
      }))
      .filter(
        (d): d is { date: string; maxF: number; minF: number } =>
          typeof d.maxF === 'number' && typeof d.minF === 'number',
      )
    return { time: data.current!.time, tempF, days }
  } catch {
    return null
  }
}
