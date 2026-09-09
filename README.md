# Laguna Beach Surf Conditions

Mobile-first Progressive Web App for **live tides, waves, and weather** across major Laguna Beach, CA beaches — styled as a clean **City of Laguna Beach** civic / municipal conditions tool.

> **Unofficial community conditions app — not an official City publication.**

## Live URL

https://josephschneider77-sys.github.io/crescent-bay-surf-web/

Built static site is mirrored to the public companion repo [`crescent-bay-surf-web`](https://github.com/josephschneider77-sys/crescent-bay-surf-web).

## Features

- **Civic branding** — City teal header, coastal accents from [lagunabeachcity.net](https://www.lagunabeachcity.net/), and the City seal in the header + PWA icons
- **Multi-beach** — Main Beach (default), Crescent Bay, Diver’s Cove, Shaw’s Cove, Picnic/Heisler, Thalia, Woods Cove, Victoria, Treasure Island, Aliso, Thousand Steps
- **Beach picker** — dropdown + horizontal chips; last choice saved in `localStorage`
- **Right now** — temperature, waves, wind, next-tide countdown
- **Tides** — today’s highs/lows + curve (NOAA CO-OPS station **9410580**)
- **Waves / marine** — significant height, period, direction, swell, wind waves (per-beach lat/lon via Open-Meteo)
- **Forecast** — hourly today + 7-day (Open-Meteo)
- **PWA** — `display: standalone`, crest icons, apple-touch-icon, theme-color `#034A46`
- In-app **Install on Android / iPhone** help
- Loading / error / offline states and a refresh control

## Branding & seal

Colors pulled from the City site design theme (via archived CSS when the live CDN blocked automated fetches):

| Token | Hex | Use |
|-------|-----|-----|
| Header teal | `#034A46` | Civic banner / theme-color |
| Footer teal | `#023E3B` | Disclaimer band |
| Deep teal | `#012D2B` | Headings |
| Ocean | `#1977A2` | Links / accents |
| Coastal | `#A1D7E6` | Soft highlights |
| Sand | `#FFAC6F` | Warm accents |
| Page bg | `#F5F8F8` | Municipal light canvas |

**City seal:** Official circular seal PNG from [Wikimedia Commons — Seal of Laguna Beach, California](https://commons.wikimedia.org/wiki/File:Seal_of_Laguna_Beach,_California.png), originally copied from the City website. Listed there as a California public record (PD under CA Public Records Act). Files live in `public/brand/` and are composited onto teal squares for PWA icons.

**Caveat:** Using a municipal seal does **not** make this an official City app. Trademark / insignia rules can still restrict commercial or misleading official use. The in-app footer states clearly that this is unofficial.

Reference captures of the City’s 2023 wordmark logo (archive.org) are stored under `docs/brand/` for design reference only and are **not** shipped in the PWA.

## Install on Android / iPhone

There is **no** App Store or Play Store listing. This is a Progressive Web App you install from the browser. True store submissions need Joe’s Apple / Google developer accounts.

### Android (Chrome)

1. Open https://josephschneider77-sys.github.io/crescent-bay-surf-web/ in **Chrome**
2. Tap **⋮** (menu, top-right)
3. Tap **Install app** or **Add to Home screen**
4. Confirm — the City seal icon appears on your home screen
5. Open it for a standalone (full-screen) app experience

### iPhone / iPad (Safari)

1. Open the same URL in **Safari** (not an in-app browser)
2. Tap **Share** (square with ↑)
3. Scroll and tap **Add to Home Screen**
4. Tap **Add**
5. Launch from the home screen for the standalone experience

The app also shows a dismissible tip plus a “How to install” section with the same steps.

## Native Android (Capacitor) — optional

Scaffolded under `android/` for a future debug/release APK. **iOS binaries are skipped** (needs a Mac + Apple Developer account).

```bash
npm install
npm run build
npx cap sync android
# With Android Studio / SDK installed:
npx cap open android
# or: cd android && ./gradlew assembleDebug
```

APK output (when built on a machine with the Android SDK):

`android/app/build/outputs/apk/debug/app-debug.apk`

This Linux workspace has **no Android SDK**, so no APK artifact was produced here. Use Android Studio locally to build.

## Location

| | |
|---|---|
| Region | Laguna Beach, CA |
| Default spot | **Main Beach** |
| Timezone | America/Los_Angeles |
| Tide station | **9410580** Newport Beach / Newport Bay Entrance |

Per-beach coordinates drive Open-Meteo weather + marine. Tide heights are **nearby Newport Beach predictions**, labeled in the UI (same station for all Laguna spots).

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

`npm run dev` binds `--host` so other devices on your Wi‑Fi can connect.

### Build

```bash
npm run build
npm run preview
```

Static output is in `dist/`.

## Stack

- Vite + React + TypeScript
- `vite-plugin-pwa` (manifest + service worker)
- Optional `@capacitor/android` wrapper
- No login, no ads, no API keys

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server with LAN host + NOAA proxy |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Serve `dist/` on LAN |
| `npm run lint` | Oxlint |
| `npx cap sync android` | Copy web build into Capacitor Android project |
