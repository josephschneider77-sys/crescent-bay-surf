import { useEffect, useState } from 'react'

const DISMISS_KEY = 'laguna-surf:hide-install-tip'

function isStandalone(): boolean {
  if (typeof window === 'undefined') return true
  const mq = window.matchMedia('(display-mode: standalone)').matches
  const ios = 'standalone' in navigator && (navigator as Navigator & { standalone?: boolean }).standalone
  return mq || Boolean(ios)
}

function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent)
}

export function InstallTip() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') return
    } catch {
      /* ignore */
    }
    if (isStandalone()) return
    // Tip is especially for Android (Smizz); also show on desktop Chrome-ish for testing
    if (isAndroid() || /Chrome|Edg|CriOS/i.test(navigator.userAgent)) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="banner tip" role="status">
      <div className="tip-body">
        <strong>Add to Home screen</strong>
        <p>
          Android: tap <strong>⋮</strong> (browser menu) → <strong>Add to Home screen</strong> /
          Install app. No separate download button.
        </p>
      </div>
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
  )
}
