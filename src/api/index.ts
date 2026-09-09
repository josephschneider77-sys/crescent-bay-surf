import { fetchMarine } from './marine'
import { fetchTides } from './tides'
import type { SurfBundle } from './types'
import { fetchWeather } from './weather'

export async function fetchSurfBundle(): Promise<SurfBundle> {
  const [weather, marine, tides] = await Promise.all([
    fetchWeather(),
    fetchMarine(),
    fetchTides(),
  ])
  return {
    weather,
    marine,
    tides,
    fetchedAt: new Date(),
  }
}

export type { SurfBundle } from './types'
