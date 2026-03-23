import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { patient_id, limit = 10 } = req.query
    if (!patient_id) return res.status(400).json({ error: 'patient_id required' })
    const { data, error } = await supabase
      .from('plan_history')
      .select('*')
      .eq('patient_id', patient_id)
      .order('created_at', { ascending: false })
      .limit(Number(limit))
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data || [])
  }

  if (req.method === 'POST') {
    const { patient_id, plan_id, action, description } = req.body
    if (!patient_id || !action || !description) return res.status(400).json({ error: 'Missing fields' })
    const { data, error } = await supabase
      .from('plan_history')
      .insert([{ patient_id, plan_id: plan_id || null, action, description }])
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end()
}
