import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const DevicePatchSchema = z.object({
  model:        z.string().max(50).optional(),
  firmware_ver: z.string().max(20).nullable().optional(),
  sim_iccid:    z.string().max(30).nullable().optional(),
  phone_num:    z.string().max(20).nullable().optional(),
  responsible_contact: z.object({
    name: z.string().min(1).max(120),
    phone: z.string().min(7).max(30),
    email: z.string().email().max(160).nullable().optional(),
  }).optional(),
  emergency_contacts: z.array(z.object({
    name: z.string().min(1).max(120),
    phone: z.string().min(7).max(30),
    email: z.string().email().max(160).nullable().optional(),
    relationship: z.string().max(60).nullable().optional(),
    priority: z.number().int().min(1).max(5).optional(),
  })).max(5).optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('gps_devices')
    .select(`
      *,
      company:companies(id, name),
      vehicle:vehicles(
        id, economic_num, plates, brand, model, status, max_speed,
        driver:drivers(id, full_name, phone, email),
        position:vehicle_positions(lat, lng, speed, heading, ignition, odometer, gsm_signal, battery_lvl, satellites, recorded_at)
      )
    `)
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body   = await request.json()
  const parsed = DevicePatchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation error' }, { status: 422 })

  const { responsible_contact, emergency_contacts, ...deviceFields } = parsed.data
  const updatePayload: Record<string, unknown> = {
    ...deviceFields,
    updated_at: new Date().toISOString(),
  }

  if (responsible_contact || emergency_contacts) {
    const { data: current, error: currentError } = await supabase
      .from('gps_devices')
      .select('source_type, mobile_metadata, protocol_metadata')
      .eq('id', params.id)
      .single()

    if (currentError || !current) {
      return NextResponse.json({ error: currentError?.message ?? 'Device not found' }, { status: 404 })
    }

    const metadataKey = current.source_type === 'mobile' ? 'mobile_metadata' : 'protocol_metadata'
    const existingMetadata = current.source_type === 'mobile'
      ? current.mobile_metadata
      : current.protocol_metadata
    const metadata = existingMetadata && typeof existingMetadata === 'object' && !Array.isArray(existingMetadata)
      ? existingMetadata as Record<string, unknown>
      : {}

    updatePayload[metadataKey] = {
      ...metadata,
      ...(responsible_contact ? { responsible_contact } : {}),
      ...(emergency_contacts ? { emergency_contacts } : {}),
    }
  }

  const { data, error } = await supabase
    .from('gps_devices')
    .update(updatePayload)
    .eq('id', params.id)
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Unassign from vehicle first
  await supabase.from('vehicles').update({ device_id: null }).eq('device_id', params.id)

  const { error } = await supabase.from('gps_devices').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
