import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { patient_id, exercicio_id, plano_id, nivel_dor, nivel_esforco, observacoes } = req.body

  if (!patient_id || !exercicio_id || !plano_id) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' })
  }

  const { error } = await db.from('logs_exercicios').insert({
    patient_id,
    exercicio_id,
    plano_id,
    concluido: true,
    nivel_dor:    typeof nivel_dor === 'number' ? nivel_dor : null,
    nivel_esforco: nivel_esforco || null,
    observacoes:  observacoes?.trim() || null,
  })

  if (error) return res.status(500).json({ error: error.message })
  return res.status(201).json({ ok: true })
}
