import type { Beach } from './beaches'
import { fetchMarine } from './marine'
import { fetchTides } from './tides'
import type { SurfBundle } from './types'
import { fetchWeather } from './weather'

export async function fetchSurfBundle(beach: Beach): Promise<SurfBundle> {
  const [weather, marine, tides] = await Promise.all([
    fetchWeather(beach),
    fetchMarine(beach),
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
export type { Beach } from './beaches'
export {
  APP_PLACE,
  BEACHES,
  DEFAULT_BEACH_ID,
  NOAA_STATION,
  getBeachById,
  loadSavedBeachId,
  saveBeachId,
} from './beaches'
