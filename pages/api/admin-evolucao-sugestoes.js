import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  // Fetch the last 3 logs per patient ordered newest-first.
  // We retrieve more rows than needed and deduplicate in JS, since
  // PostgREST doesn't support DISTINCT ON via the JS client easily.
  const { data, error } = await db
    .from('logs_exercicios')
    .select('patient_id, nivel_dor, registrado_em')
    .order('registrado_em', { ascending: false })
    .limit(1000)

  if (error) {
    console.error('[admin-evolucao-sugestoes] Supabase error:', error.message)
    return res.status(500).json({ error: error.message })
  }

  // Group last 3 logs per patient
  const grouped = {}
  for (const row of data || []) {
    if (!grouped[row.patient_id]) grouped[row.patient_id] = []
    if (grouped[row.patient_id].length < 3) {
      grouped[row.patient_id].push(row)
    }
  }

  // A patient is "ready to evolve" when ALL of the following are true:
  //   1. They have exactly 3 logs
  //   2. All 3 have nivel_dor <= 2 (and not null)
  //   3. The 3 logs are on different calendar days
  const readyIds = []

  for (const [patientId, logs] of Object.entries(grouped)) {
    if (logs.length < 3) continue

    const allLowPain = logs.every(
      l => l.nivel_dor != null && l.nivel_dor <= 2
    )
    if (!allLowPain) continue

    const uniqueDays = new Set(
      logs.map(l => new Date(l.registrado_em).toISOString().slice(0, 10))
    )
    if (uniqueDays.size < 3) continue

    readyIds.push(patientId)
  }

  return res.status(200).json(readyIds)
}
