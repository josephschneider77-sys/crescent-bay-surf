export type Beach = {
  id: string
  name: string
  shortName: string
  lat: number
  lon: number
  area?: string
}

/** Major Laguna Beach spots, roughly north → south. */
export const BEACHES: readonly Beach[] = [
  {
    id: 'shaws-cove',
    name: "Shaw's Cove",
    shortName: "Shaw's",
    lat: 33.5472,
    lon: -117.8078,
    area: 'North Laguna',
  },
  {
    id: 'crescent-bay',
    name: 'Crescent Bay',
    shortName: 'Crescent',
    lat: 33.5456,
    lon: -117.8023,
    area: 'North Laguna',
  },
  {
    id: 'divers-cove',
    name: "Diver's Cove",
    shortName: "Diver's",
    lat: 33.5450,
    lon: -117.7985,
    area: 'North Laguna',
  },
  {
    id: 'picnic-heisler',
    name: 'Picnic Beach / Heisler Park',
    shortName: 'Heisler',
    lat: 33.5442,
    lon: -117.7938,
    area: 'North Laguna',
  },
  {
    id: 'main-beach',
    name: 'Main Beach',
    shortName: 'Main',
    lat: 33.5422,
    lon: -117.7845,
    area: 'Central',
  },
  {
    id: 'thalia',
    name: 'Thalia Street Beach',
    shortName: 'Thalia',
    lat: 33.5358,
    lon: -117.7768,
    area: 'Central',
  },
  {
    id: 'woods-cove',
    name: 'Woods Cove',
    shortName: 'Woods',
    lat: 33.5268,
    lon: -117.7695,
    area: 'South Laguna',
  },
  {
    id: 'victoria',
    name: 'Victoria Beach',
    shortName: 'Victoria',
    lat: 33.5198,
    lon: -117.7642,
    area: 'South Laguna',
  },
  {
    id: 'treasure-island',
    name: 'Treasure Island Beach',
    shortName: 'Treasure Is.',
    lat: 33.5132,
    lon: -117.7588,
    area: 'South Laguna',
  },
  {
    id: 'aliso',
    name: 'Aliso Beach',
    shortName: 'Aliso',
    lat: 33.5095,
    lon: -117.7528,
    area: 'South Laguna',
  },
  {
    id: 'thousand-steps',
    name: 'Thousand Steps Beach',
    shortName: '1000 Steps',
    lat: 33.4958,
    lon: -117.7415,
    area: 'South Laguna',
  },
] as const

export const DEFAULT_BEACH_ID = 'main-beach'

export const APP_PLACE = 'Laguna Beach, CA'
export const TIMEZONE = 'America/Los_Angeles'

export const NOAA_STATION = {
  id: '9410580',
  label: 'Newport Beach / Newport Bay Entrance',
  note: 'Nearby Newport Beach predictions for all Laguna spots (~6–12 mi NW). Not a gauge on the beach itself.',
} as const

export const M_TO_FT = 3.28084

export const BEACH_STORAGE_KEY = 'laguna-surf:selected-beach'

export function getBeachById(id: string | null | undefined): Beach {
  const found = BEACHES.find((b) => b.id === id)
  return found ?? BEACHES.find((b) => b.id === DEFAULT_BEACH_ID)!
}

export function loadSavedBeachId(): string {
  try {
    const raw = localStorage.getItem(BEACH_STORAGE_KEY)
    if (raw && BEACHES.some((b) => b.id === raw)) return raw
  } catch {
    /* private mode / SSR */
  }
  return DEFAULT_BEACH_ID
}

export function saveBeachId(id: string): void {
  try {
    localStorage.setItem(BEACH_STORAGE_KEY, id)
  } catch {
    /* ignore */
  }
}
