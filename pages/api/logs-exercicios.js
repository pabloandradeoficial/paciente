import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const {
    patient_id,
    exercicio_id,
    plano_id,
    nivel_dor,
    nivel_esforco,
    observacoes,
  } = req.body ?? {}

  // Log every incoming call so server logs show exactly what arrived
  console.log('[logs-exercicios] payload recebido:', {
    patient_id,
    exercicio_id,
    plano_id,
    nivel_dor,
    nivel_esforco,
    observacoes,
  })

  // Only patient_id and exercicio_id are hard-required
  if (!patient_id || !exercicio_id) {
    console.error('[logs-exercicios] campos obrigatórios ausentes')
    return res.status(400).json({ error: 'patient_id e exercicio_id são obrigatórios.' })
  }

  const row = {
    patient_id,
    exercicio_id,
    concluido:     true,
    nivel_dor:     typeof nivel_dor === 'number' ? nivel_dor : null,
    nivel_esforco: nivel_esforco || null,
    observacoes:   observacoes?.trim() || null,
  }

  // plano_id is NOT NULL in the schema — include it only when provided
  if (plano_id) row.plano_id = plano_id

  const { data, error } = await db
    .from('logs_exercicios')
    .insert(row)
    .select('id')
    .single()

  if (error) {
    console.error('[logs-exercicios] erro Supabase:', error.message, error.details, error.hint)
    return res.status(500).json({
      error:   error.message,
      details: error.details ?? null,
      hint:    error.hint ?? null,
    })
  }

  console.log('[logs-exercicios] salvo com id:', data?.id)
  return res.status(201).json({ ok: true, id: data?.id })
}
