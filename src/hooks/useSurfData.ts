import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchSurfBundle,
  getBeachById,
  loadSavedBeachId,
  saveBeachId,
  type Beach,
  type SurfBundle,
} from '../api'

type Status = 'idle' | 'loading' | 'success' | 'error' | 'offline'

export function useSurfData() {
  const [beach, setBeachState] = useState<Beach>(() => getBeachById(loadSavedBeachId()))
  const [data, setData] = useState<SurfBundle | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const mounted = useRef(true)
  const hasData = useRef(false)
  const beachRef = useRef(beach)
  beachRef.current = beach

  const load = useCallback(async (isRefresh = false, forBeach?: Beach) => {
    const target = forBeach ?? beachRef.current
    if (!navigator.onLine) {
      setStatus('offline')
      setError('You’re offline. Showing the last cached view if available.')
      return
    }
    if (isRefresh) setIsRefreshing(true)
    else setStatus('loading')
    setError(null)
    try {
      const bundle = await fetchSurfBundle(target)
      if (!mounted.current) return
      // Ignore stale responses if the user switched beaches mid-fetch
      if (beachRef.current.id !== target.id) return
      setData(bundle)
      hasData.current = true
      setStatus('success')
    } catch (err) {
      if (!mounted.current) return
      if (beachRef.current.id !== target.id) return
      setError(err instanceof Error ? err.message : 'Failed to load conditions')
      setStatus(hasData.current ? 'success' : 'error')
    } finally {
      if (mounted.current) setIsRefreshing(false)
    }
  }, [])

  const setBeach = useCallback(
    (next: Beach) => {
      if (next.id === beachRef.current.id) return
      saveBeachId(next.id)
      setBeachState(next)
      hasData.current = false
      setData(null)
      void load(false, next)
    },
    [load],
  )

  useEffect(() => {
    mounted.current = true
    void load(false)
    const onOnline = () => void load(true)
    const onOffline = () => setStatus('offline')
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    const id = window.setInterval(() => void load(true), 10 * 60 * 1000)
    return () => {
      mounted.current = false
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      window.clearInterval(id)
    }
  }, [load])

  return {
    beach,
    setBeach,
    data,
    status,
    error,
    isRefreshing,
    refresh: () => load(true),
  }
}
