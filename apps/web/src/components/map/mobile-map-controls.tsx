'use client'

import { useState } from 'react'
import { Compass, Crosshair, Layers, Minus, Plus } from 'lucide-react'
import type { MapStyle } from '@/lib/map/tiles'

interface Props {
  mapStyle: MapStyle
  onChangeStyle: (style: MapStyle) => void
  onCenterSelected?: () => void
  onCenterFleet: () => void
  onZoomIn: () => void
  onZoomOut: () => void
}

const STYLES: Array<{ id: MapStyle; label: string }> = [
  { id: 'hybrid', label: 'Híbrido' },
  { id: 'satellite', label: 'Satélite' },
  { id: 'streets', label: 'Calles' },
]

export function MobileMapControls({
  mapStyle,
  onChangeStyle,
  onCenterSelected,
  onCenterFleet,
  onZoomIn,
  onZoomOut,
}: Props) {
  const [showStyles, setShowStyles] = useState(false)

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-200 bg-white px-3 py-2">
      {showStyles && (
        <div className="order-last flex w-full flex-wrap justify-end gap-1.5 sm:order-first sm:w-auto">
          {STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => {
                onChangeStyle(style.id)
                setShowStyles(false)
              }}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
                mapStyle === style.id ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      )}

      <MapBtn icon={<Layers className="w-4 h-4" />} onClick={() => setShowStyles(v => !v)} title="Capas" />
      {onCenterSelected && <MapBtn icon={<Crosshair className="w-4 h-4" />} onClick={onCenterSelected} title="Centrar unidad" />}
      <MapBtn icon={<Compass className="w-4 h-4" />} onClick={onCenterFleet} title="Centrar flota" />
      <MapBtn icon={<Plus className="w-4 h-4" />} onClick={onZoomIn} title="Acercar" />
      <MapBtn icon={<Minus className="w-4 h-4" />} onClick={onZoomOut} title="Alejar" />
    </div>
  )
}

function MapBtn({
  icon,
  onClick,
  title,
}: {
  icon: React.ReactNode
  onClick: () => void
  title: string
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 active:scale-95"
    >
      {icon}
    </button>
  )
}
