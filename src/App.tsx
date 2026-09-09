import { ForecastSection } from './components/ForecastSection'
import { NowSummary } from './components/NowSummary'
import { TideSection } from './components/TideSection'
import { WaveSection } from './components/WaveSection'
import { useSurfData } from './hooks/useSurfData'
import { LOCATION } from './api/config'
import { formatDateLong } from './utils/format'

function App() {
  const { data, status, error, isRefreshing, refresh } = useSurfData()

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="brand">Crescent Bay Surf</p>
          <h1>
            {LOCATION.name}
            <span className="place"> · {LOCATION.place}</span>
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
              PT
            </p>
            <p>
              Weather & marine: Open-Meteo · Tides: NOAA CO-OPS {LOCATION.lat}°N,{' '}
              {Math.abs(LOCATION.lon)}°W
            </p>
            <p className="fine-print">
              Install to home screen for a phone-ready app experience. No ads, no
              login.
            </p>
          </footer>
        </main>
      )}
    </div>
  )
}

export default App
