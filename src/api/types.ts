export type TideEvent = {
  time: string
  heightFt: number
  type: 'H' | 'L'
}

export type TideCurvePoint = {
  time: string
  heightFt: number
}

export type WeatherCurrent = {
  time: string
  tempF: number
  feelsLikeF: number
  humidity: number
  precipIn: number
  weatherCode: number
  windMph: number
  windDir: number
}

export type WeatherHour = {
  time: string
  tempF: number
  precipProb: number
  weatherCode: number
  windMph: number
}

export type WeatherDay = {
  date: string
  weatherCode: number
  tempMaxF: number
  tempMinF: number
  precipProbMax: number
  sunrise: string
  sunset: string
}

export type MarineCurrent = {
  time: string
  waveHeightFt: number
  waveDir: number
  wavePeriod: number
  windWaveHeightFt: number
  swellHeightFt: number
  swellDir: number
  swellPeriod: number
}

export type MarineHour = {
  time: string
  waveHeightFt: number
  waveDir: number
  wavePeriod: number
  swellHeightFt: number
}

export type WaterTempDay = {
  date: string
  minF: number
  maxF: number
}

export type WaterTemp = {
  time: string
  tempF: number
  days: WaterTempDay[]
}

export type SurfBundle = {
  weather: {
    current: WeatherCurrent
    hourly: WeatherHour[]
    daily: WeatherDay[]
  }
  marine: {
    current: MarineCurrent
    hourly: MarineHour[]
  }
  tides: {
    events: TideEvent[]
    curve: TideCurvePoint[]
    station: string
    stationNote: string
  }
  /** null when the sea-surface-temperature source is unavailable */
  waterTemp: WaterTemp | null
  fetchedAt: Date
}
