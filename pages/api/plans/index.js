import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { patient_id, title, description, welcome_message } = req.body
    if (!patient_id || !title) return res.status(400).json({ error: 'patient_id e title obrigatórios.' })

    // Desativa planos anteriores do paciente
    await db.from('plans').update({ is_active: false }).eq('patient_id', patient_id)

    const { data, error } = await db
      .from('plans')
      .insert({ patient_id, title, description, welcome_message, is_active: true })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  res.status(405).end()
}
