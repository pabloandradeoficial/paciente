import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { patient_id } = req.query
  if (!patient_id) return res.status(400).json({ error: 'patient_id obrigatório.' })

  const { data, error } = await db
    .from('logs_exercicios')
    .select('registrado_em, nivel_dor, nivel_esforco')
    .eq('patient_id', patient_id)
    .eq('concluido', true)
    .order('registrado_em', { ascending: true })
    .limit(60)

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(data || [])
}
