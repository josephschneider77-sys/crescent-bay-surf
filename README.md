# Crescent Bay Surf

Mobile-first Progressive Web App for **live tides, waves, and weather** at Crescent Bay, Laguna Beach, CA.

Designed to open on a phone: large outdoor-readable type, dark coastal palette, single-scroll layout.

## Features

- **Right now** — temperature, waves, wind, next-tide countdown
- **Tides** — today’s highs/lows + curve (NOAA CO-OPS station **9410580**)
- **Waves / marine** — significant height, period, direction, swell, wind waves
- **Forecast** — hourly today + 7-day (Open-Meteo)
- **PWA** — installable, offline shell + cached recent API responses
- Loading / error / offline states and a refresh control

## Location

| | |
|---|---|
| Spot | Crescent Bay, Laguna Beach, CA |
| Coordinates | ~33.5456°N, 117.8023°W |
| Timezone | America/Los_Angeles |
| Tide station | **9410580** Newport Beach / Newport Bay Entrance |

Tide heights are **nearby Newport Beach predictions**, not a gauge on Crescent Bay itself (~6 mi NW). Labeled clearly in the UI.

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

Then open the printed Network URL on your phone (same Wi‑Fi), e.g. `http://192.168.x.x:5173`.

### Build

```bash
npm run build
npm run preview
```

Static output is in `dist/`.

## Open on your phone today

**Option A — same Wi‑Fi (fastest)**

1. On this machine: `npm install && npm run dev`
2. Note the **Network** URL Vite prints (`http://<lan-ip>:5173`)
3. On your phone (same Wi‑Fi), open that URL
4. Optional: Share → Add to Home Screen for the PWA icon

**Option B — public tunnel** (phone off your LAN)

```bash
npm run build && npm run preview -- --host --port 4173
# in another terminal, if you have cloudflared:
cloudflared tunnel --url http://localhost:4173
# or: npx --yes localtunnel --port 4173
```

**Option C — GitHub Pages**

This repo is **private**. GitHub Pages for private repos needs GitHub Pro (or make the repo public). To add Pages later: add a GitHub Actions workflow that builds with `npm ci && npm run build` and deploys `dist/` (needs a token with the `workflow` scope), then Settings → Pages → Source: GitHub Actions.

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
