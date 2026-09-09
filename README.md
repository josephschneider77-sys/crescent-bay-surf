# Laguna Beach Surf

Mobile-first Progressive Web App for **live tides, waves, and weather** across major Laguna Beach, CA beaches.

Designed to open on a phone: large outdoor-readable type, dark coastal palette, single-scroll layout, beach picker with last-spot memory.

## Features

- **Multi-beach** — Main Beach (default), Crescent Bay, Diver’s Cove, Shaw’s Cove, Picnic/Heisler, Thalia, Woods Cove, Victoria, Treasure Island, Aliso, Thousand Steps
- **Beach picker** — dropdown + horizontal chips; last choice saved in `localStorage`
- **Right now** — temperature, waves, wind, next-tide countdown
- **Tides** — today’s highs/lows + curve (NOAA CO-OPS station **9410580**)
- **Waves / marine** — significant height, period, direction, swell, wind waves (per-beach lat/lon via Open-Meteo)
- **Forecast** — hourly today + 7-day (Open-Meteo)
- **PWA** — installable; Android tip: ⋮ → Add to Home screen
- Loading / error / offline states and a refresh control

## Location

| | |
|---|---|
| Region | Laguna Beach, CA |
| Default spot | **Main Beach** |
| Timezone | America/Los_Angeles |
| Tide station | **9410580** Newport Beach / Newport Bay Entrance |

Per-beach coordinates drive Open-Meteo weather + marine. Tide heights are **nearby Newport Beach predictions**, labeled clearly in the UI (same station for all Laguna spots).

## Data sources

- **Weather** — [Open-Meteo Forecast API](https://open-meteo.com/) (no key)
- **Waves** — [Open-Meteo Marine API](https://open-meteo.com/en/docs/marine-weather-api) (no key)
- **Tides** — [NOAA CO-OPS Data API](https://api.tidesandcurrents.noaa.gov/api/prod/) station 9410580

Dev server proxies NOAA through Vite (`/api/noaa`) to avoid CORS. Production build tries NOAA directly, then CORS-friendly fallbacks.

## Run locally

```bash
npm install
npm run dev
```

`npm run dev` already binds `--host` so other devices on your Wi‑Fi can connect.

### Build

```bash
npm run build
npm run preview
```

Static output is in `dist/`.

## Open on your phone

**Live public URL:** https://josephschneider77-sys.github.io/crescent-bay-surf-web/

Built static site is mirrored to the public companion repo [`crescent-bay-surf-web`](https://github.com/josephschneider77-sys/crescent-bay-surf-web).

**Android install:** Chrome ⋮ → **Add to Home screen** / Install app (there is no separate store download button).

**iOS:** Safari Share → Add to Home Screen.

## Stack

- Vite + React + TypeScript
- `vite-plugin-pwa` (manifest + service worker)
- No login, no ads, no API keys

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server with LAN host + NOAA proxy |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Serve `dist/` on LAN |
| `npm run lint` | Oxlint |
