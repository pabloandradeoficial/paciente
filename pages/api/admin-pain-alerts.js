import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  // Fetch all logs ordered newest-first; deduplicate by patient_id in JS
  // keeping only the most recent entry per patient.
  const { data, error } = await db
    .from('logs_exercicios')
    .select('patient_id, nivel_dor, nivel_esforco, registrado_em')
    .order('registrado_em', { ascending: false })
    .limit(500)

  if (error) return res.status(500).json({ error: error.message })

  const lastPerPatient = {}
  for (const row of data || []) {
    if (!lastPerPatient[row.patient_id]) {
      lastPerPatient[row.patient_id] = {
        nivel_dor:    row.nivel_dor,
        nivel_esforco: row.nivel_esforco,
        registrado_em: row.registrado_em,
      }
    }
  }

  return res.status(200).json(lastPerPatient)
}
