import type { SupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { PlanFeatures } from '@gps-saas/types'

type UsageRow = {
  features?: PlanFeatures & Record<string, unknown>
  at_user_limit?: boolean
  at_vehicle_limit?: boolean
}

export async function getCompanyUsage(
  supabase: SupabaseClient,
  companyId: string,
): Promise<UsageRow | null> {
  const { data, error } = await supabase.rpc('get_company_usage', {
    p_company_id: companyId,
  })
  if (error || !data) return null
  return data as UsageRow
}

export async function assertPlanFeature(
  supabase: SupabaseClient,
  companyId: string | null,
  role: string,
  feature: keyof PlanFeatures | string,
): Promise<NextResponse | null> {
  if (role === 'super_admin' || !companyId) return null

  const usage = await getCompanyUsage(supabase, companyId)
  const val = usage?.features?.[feature as keyof PlanFeatures]
  const enabled = val === true || (typeof val === 'number' && val > 0)

  if (!enabled) {
    return NextResponse.json(
      { error: 'Función no incluida en tu plan. Actualiza en Facturación.' },
      { status: 403 },
    )
  }
  return null
}

export async function assertUserLimit(
  supabase: SupabaseClient,
  companyId: string,
  role: string,
): Promise<NextResponse | null> {
  if (role === 'super_admin') return null

  const usage = await getCompanyUsage(supabase, companyId)
  if (usage?.at_user_limit) {
    return NextResponse.json(
      { error: 'Alcanzaste el límite de usuarios de tu plan.' },
      { status: 402 },
    )
  }
  return null
}
