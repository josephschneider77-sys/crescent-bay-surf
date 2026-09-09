import { LOCATION } from './config'
import type { WeatherCurrent, WeatherDay, WeatherHour } from './types'

type OpenMeteoForecast = {
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
    wind_direction_10m: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: (number | null)[]
    weather_code: number[]
    wind_speed_10m: number[]
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: (number | null)[]
    sunrise: string[]
    sunset: string[]
  }
}

export async function fetchWeather(): Promise<{
  current: WeatherCurrent
  hourly: WeatherHour[]
  daily: WeatherDay[]
}> {
  const params = new URLSearchParams({
    latitude: String(LOCATION.lat),
    longitude: String(LOCATION.lon),
    timezone: LOCATION.timezone,
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    precipitation_unit: 'inch',
    forecast_days: '7',
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'weather_code',
      'wind_speed_10m',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
    ].join(','),
  })

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  if (!res.ok) throw new Error(`Weather API ${res.status}`)
  const data = (await res.json()) as OpenMeteoForecast

  const current: WeatherCurrent = {
    time: data.current.time,
    tempF: data.current.temperature_2m,
    feelsLikeF: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    precipIn: data.current.precipitation,
    weatherCode: data.current.weather_code,
    windMph: data.current.wind_speed_10m,
    windDir: data.current.wind_direction_10m,
  }

  // Today's remaining hours (from current hour through end of day) + a bit of next
  const nowIso = data.current.time.slice(0, 13) // YYYY-MM-DDTHH
  const startIdx = Math.max(
    0,
    data.hourly.time.findIndex((t) => t.startsWith(nowIso) || t >= data.current.time),
  )
  const hourly: WeatherHour[] = data.hourly.time
    .slice(startIdx, startIdx + 24)
    .map((time, i) => {
      const idx = startIdx + i
      return {
        time,
        tempF: data.hourly.temperature_2m[idx],
        precipProb: data.hourly.precipitation_probability[idx] ?? 0,
        weatherCode: data.hourly.weather_code[idx],
        windMph: data.hourly.wind_speed_10m[idx],
      }
    })

  const daily: WeatherDay[] = data.daily.time.map((date, i) => ({
    date,
    weatherCode: data.daily.weather_code[i],
    tempMaxF: data.daily.temperature_2m_max[i],
    tempMinF: data.daily.temperature_2m_min[i],
    precipProbMax: data.daily.precipitation_probability_max[i] ?? 0,
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
  }))

  return { current, hourly, daily }
}
