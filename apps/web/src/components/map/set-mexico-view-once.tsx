'use client'

import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { MEXICO_DASHBOARD_VIEW, MEXICO_LEAFLET_BOUNDS } from '@/lib/map/map-viewport'

/** Vista fija en México al cargar — sin fitBounds global */
export function SetMexicoViewOnce() {
  const map = useMap()
  const doneRef = useRef(false)

  useEffect(() => {
    if (doneRef.current) return
    map.setView(
      [MEXICO_DASHBOARD_VIEW.center.lat, MEXICO_DASHBOARD_VIEW.center.lng],
      MEXICO_DASHBOARD_VIEW.zoom,
    )
    map.setMaxBounds(L.latLngBounds(MEXICO_LEAFLET_BOUNDS).pad(0.02))
    doneRef.current = true
  }, [map])

  return null
}
