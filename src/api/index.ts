import type { Beach } from './beaches'
import { fetchMarine } from './marine'
import { fetchTides } from './tides'
import { fetchWaterTemp } from './waterTemp'
import type { SurfBundle } from './types'
import { fetchWeather } from './weather'

export async function fetchSurfBundle(beach: Beach): Promise<SurfBundle> {
  const [weather, marine, tides, waterTemp] = await Promise.all([
    fetchWeather(beach),
    fetchMarine(beach),
    fetchTides(),
    fetchWaterTemp(beach),
  ])
  return {
    weather,
    marine,
    tides,
    waterTemp,
    fetchedAt: new Date(),
  }
}

export { fetchWaterTemp } from './waterTemp'
export type { SurfBundle, WaterTemp } from './types'
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
