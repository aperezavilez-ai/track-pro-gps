/** Escapa caracteres especiales de filtros PostgREST ilike */
export function sanitizeIlikeSearch(raw: string, maxLen = 80): string {
  return raw
    .trim()
    .slice(0, maxLen)
    .replace(/[%_\\]/g, '\\$&')
}

export function buildIlikeOr(fields: string[], search: string): string {
  const safe = sanitizeIlikeSearch(search)
  if (!safe) return ''
  return fields.map(f => `${f}.ilike.%${safe}%`).join(',')
}
