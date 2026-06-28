'use client'

import { createContext, useContext, useEffect, useRef, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type AlertListener = (alert: unknown) => void

const AlertsRealtimeContext = createContext<{
  subscribe: (listener: AlertListener) => () => void
} | null>(null)

const IS_DEMO = process.env['NEXT_PUBLIC_DEMO_MODE'] === 'true'

export function AlertsRealtimeProvider({
  companyId,
  children,
}: {
  companyId: string
  children: React.ReactNode
}) {
  const listenersRef = useRef(new Set<AlertListener>())
  const supabase = createSupabaseBrowserClient()

  const subscribe = useCallback((listener: AlertListener) => {
    listenersRef.current.add(listener)
    return () => { listenersRef.current.delete(listener) }
  }, [])

  useEffect(() => {
    if (!companyId || IS_DEMO) return

    const channel = supabase
      .channel(`alerts:${companyId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alerts',
          filter: `company_id=eq.${companyId}`,
        },
        (payload) => {
          for (const fn of listenersRef.current) fn(payload.new)
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [companyId, supabase])

  return (
    <AlertsRealtimeContext.Provider value={{ subscribe }}>
      {children}
    </AlertsRealtimeContext.Provider>
  )
}

export function useAlertsRealtime(onAlert?: AlertListener) {
  const ctx = useContext(AlertsRealtimeContext)
  const onAlertRef = useRef(onAlert)
  onAlertRef.current = onAlert

  useEffect(() => {
    if (!onAlert || !ctx) return
    return ctx.subscribe((alert) => onAlertRef.current?.(alert))
  }, [ctx, onAlert])
}
