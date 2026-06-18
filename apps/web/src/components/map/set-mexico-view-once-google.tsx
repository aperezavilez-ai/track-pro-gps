'use client'

import { useEffect, useRef } from 'react'
import { useMap } from '@vis.gl/react-google-maps'
import { MEXICO_DASHBOARD_VIEW, MEXICO_BOUNDS } from '@/lib/map/map-viewport'

/** Vista fija en México al cargar — mismo encuadre que el dashboard */
export function SetMexicoViewOnceGoogle() {
  const map = useMap()
  const doneRef = useRef(false)

  useEffect(() => {
    if (!map || doneRef.current) return

    map.setCenter(MEXICO_DASHBOARD_VIEW.center)
    map.setZoom(MEXICO_DASHBOARD_VIEW.zoom)
    map.setOptions({
      restriction: {
        latLngBounds: {
          north: MEXICO_BOUNDS.north + 1,
          south: MEXICO_BOUNDS.south - 2,
          west: MEXICO_BOUNDS.west - 2,
          east: MEXICO_BOUNDS.east + 2,
        },
        strictBounds: false,
      },
    })
    doneRef.current = true
  }, [map])

  return null
}

/** Reaplica la vista México (p. ej. al quitar selección de vehículo) */
export function resetGoogleMapToMexico(map: google.maps.Map) {
  map.setCenter(MEXICO_DASHBOARD_VIEW.center)
  map.setZoom(MEXICO_DASHBOARD_VIEW.zoom)
}
