import { useEffect, useState } from 'react'

const DISMISS_KEY = 'laguna-surf:hide-install-tip'

function isStandalone(): boolean {
  if (typeof window === 'undefined') return true
  const mq = window.matchMedia('(display-mode: standalone)').matches
  const ios =
    'standalone' in navigator &&
    (navigator as Navigator & { standalone?: boolean }).standalone
  return mq || Boolean(ios)
}

function isIos(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent)
}

type Platform = 'ios' | 'android' | 'other'

function detectPlatform(): Platform {
  if (isIos()) return 'ios'
  if (isAndroid()) return 'android'
  return 'other'
}

export function InstallTip() {
  const [visible, setVisible] = useState(false)
  const [platform, setPlatform] = useState<Platform>('other')

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') {
        // still show the always-available help details below tip? tip only
      } else if (!isStandalone()) {
        setVisible(true)
      }
    } catch {
      if (!isStandalone()) setVisible(true)
    }
    setPlatform(detectPlatform())
  }, [])

  const tipCopy =
    platform === 'ios' ? (
      <>
        <strong>Install on iPhone / iPad</strong>
        <ol>
          <li>
            Tap the <strong>Share</strong> button (square with ↑) in Safari
          </li>
          <li>
            Scroll and tap <strong>Add to Home Screen</strong>
          </li>
          <li>
            Tap <strong>Add</strong> — opens like an app, no App Store needed
          </li>
        </ol>
      </>
    ) : platform === 'android' ? (
      <>
        <strong>Install on Android</strong>
        <ol>
          <li>
            Tap <strong>⋮</strong> (Chrome menu, top-right)
          </li>
          <li>
            Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>
          </li>
          <li>Confirm — icon appears on your home screen</li>
        </ol>
      </>
    ) : (
      <>
        <strong>Install this app</strong>
        <p>
          <strong>Android (Chrome):</strong> ⋮ → Add to Home screen / Install app.
          <br />
          <strong>iPhone (Safari):</strong> Share → Add to Home Screen.
        </p>
      </>
    )

  return (
    <>
      {visible && (
        <div className="banner tip" role="status">
          <div className="tip-body">{tipCopy}</div>
          <button
            type="button"
            className="tip-dismiss"
            aria-label="Dismiss install tip"
            onClick={() => {
              try {
                localStorage.setItem(DISMISS_KEY, '1')
              } catch {
                /* ignore */
              }
              setVisible(false)
            }}
          >
            ✕
          </button>
        </div>
      )}

      {!isStandalone() && (
        <details className="install-help">
          <summary>How to install on Android &amp; iPhone</summary>
          <div className="install-help-body">
            <h3>Android (Chrome)</h3>
            <ol>
              <li>Open this page in Chrome</li>
              <li>
                Tap the <strong>⋮</strong> menu (top-right)
              </li>
              <li>
                Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>
              </li>
              <li>Confirm — look for the City seal icon on your home screen</li>
            </ol>
            <h3>iPhone / iPad (Safari)</h3>
            <ol>
              <li>Open this page in Safari (not Chrome-in-app browsers)</li>
              <li>
                Tap <strong>Share</strong> (square with an up arrow)
              </li>
              <li>
                Tap <strong>Add to Home Screen</strong>, then <strong>Add</strong>
              </li>
              <li>Launch from the home screen for the full-screen app experience</li>
            </ol>
            <p>
              There is no separate App Store or Play Store listing for this community
              PWA. True store apps would require Joe’s developer accounts.
            </p>
          </div>
        </details>
      )}
    </>
  )
}
