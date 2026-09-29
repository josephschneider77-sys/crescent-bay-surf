import { TIMEZONE, type Beach } from './beaches'
import type { WaterTemp } from './types'

type OpenMeteoSst = {
  current?: { time: string; sea_surface_temperature: number | null }
}

/**
 * Current ocean water (sea surface) temperature in °F from the free, keyless,
 * CORS-enabled Open-Meteo Marine API. Never throws — returns null on any
 * failure so the rest of the conditions still render.
 */
export async function fetchWaterTemp(beach: Beach): Promise<WaterTemp | null> {
  try {
    const params = new URLSearchParams({
      latitude: String(beach.lat),
      longitude: String(beach.lon),
      timezone: TIMEZONE,
      temperature_unit: 'fahrenheit',
      current: 'sea_surface_temperature',
    })
    const res = await fetch(`https://marine-api.open-meteo.com/v1/marine?${params}`)
    if (!res.ok) return null
    const data = (await res.json()) as OpenMeteoSst
    const tempF = data.current?.sea_surface_temperature
    if (typeof tempF !== 'number' || !Number.isFinite(tempF)) return null
    return { time: data.current!.time, tempF }
  } catch {
    return null
  }
}
