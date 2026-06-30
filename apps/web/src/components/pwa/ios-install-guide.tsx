'use client'

import { Home, PlusSquare, Share } from 'lucide-react'

export function IosInstallGuide({ inAppBrowser }: { inAppBrowser: boolean }) {
  return (
    <div className="space-y-3">
      {inAppBrowser && (
        <div className="rounded-xl bg-amber-500/15 border border-amber-400/30 px-3 py-2.5 text-xs text-amber-100">
          Abre esta pagina en Safari para instalar TrackPro.
        </div>
      )}

      <p className="text-xs text-white/50 uppercase tracking-wide font-medium">iPhone / Safari</p>

      <ol className="space-y-2.5 text-sm text-white/85">
        <li className="flex gap-3 items-start">
          <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold flex items-center justify-center shrink-0">1</span>
          <span>
            Toca <Share className="w-4 h-4 inline -mt-0.5 text-orange-400" /> <strong>Compartir</strong>
          </span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold flex items-center justify-center shrink-0">2</span>
          <span>
            Elige <PlusSquare className="w-4 h-4 inline -mt-0.5" /> <strong>Anadir a inicio</strong>
          </span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold flex items-center justify-center shrink-0">3</span>
          <span>
            Abre <Home className="w-4 h-4 inline -mt-0.5 text-orange-400" /> <strong>TrackPro</strong>
          </span>
        </li>
      </ol>
    </div>
  )
}
