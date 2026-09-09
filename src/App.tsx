import { BeachPicker } from './components/BeachPicker'
import { ForecastSection } from './components/ForecastSection'
import { InstallTip } from './components/InstallTip'
import { NowSummary } from './components/NowSummary'
import { TideSection } from './components/TideSection'
import { WaveSection } from './components/WaveSection'
import { APP_PLACE } from './api'
import { useSurfData } from './hooks/useSurfData'
import { formatDateLong } from './utils/format'

function App() {
  const { beach, setBeach, data, status, error, isRefreshing, refresh } = useSurfData()

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="brand">Laguna Beach Surf</p>
          <h1>
            {beach.name}
            <span className="place"> · {APP_PLACE}</span>
          </h1>
          <p className="date-line">{formatDateLong()}</p>
        </div>
        <button
          type="button"
          className="refresh"
          onClick={() => void refresh()}
          disabled={isRefreshing || status === 'loading'}
          aria-label="Refresh conditions"
        >
          <span className={isRefreshing ? 'spin' : ''} aria-hidden>
            ↻
          </span>
        </button>
      </header>

      <BeachPicker
        beach={beach}
        onChange={setBeach}
        disabled={isRefreshing}
      />

      <InstallTip />

      {status === 'offline' && (
        <div className="banner warn" role="status">
          Offline — {error ?? 'reconnect to refresh live data.'}
        </div>
      )}
      {error && status !== 'offline' && data && (
        <div className="banner warn" role="status">
          Refresh failed: {error}
        </div>
      )}

      {status === 'loading' && !data && (
        <div className="card skeleton-card" aria-busy="true" aria-live="polite">
          <div className="skel skel-lg" />
          <div className="skel" />
          <div className="skel" />
          <p className="loading-copy">Pulling tides, waves & weather…</p>
        </div>
      )}

      {status === 'error' && !data && (
        <div className="card error-card" role="alert">
          <h2>Couldn’t load conditions</h2>
          <p>{error}</p>
          <button type="button" className="primary" onClick={() => void refresh()}>
            Try again
          </button>
        </div>
      )}

      {data && (
        <main className="stack">
          <NowSummary data={data} />
          <TideSection data={data} />
          <WaveSection data={data} />
          <ForecastSection data={data} />
          <footer className="footer">
            <p>
              Updated{' '}
              {data.fetchedAt.toLocaleTimeString('en-US', {
                timeZone: 'America/Los_Angeles',
                hour: 'numeric',
                minute: '2-digit',
              })}{' '}
              PT · {beach.name}
            </p>
            <p>
              Weather & marine: Open-Meteo @ {beach.lat.toFixed(4)}°N,{' '}
              {Math.abs(beach.lon).toFixed(4)}°W · Tides: NOAA CO-OPS (Laguna-wide)
            </p>
            <p className="fine-print">
              Add to Home screen for a phone-ready app. No ads, no login. Covers major
              Laguna Beach spots — pick any beach above.
            </p>
          </footer>
        </main>
      )}
    </div>
  )
}

export default App
