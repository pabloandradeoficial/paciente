import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { plan_id, title, type, file_url, external_url } = req.body
    if (!plan_id || !title || !type)
      return res.status(400).json({ error: 'plan_id, title e type obrigatórios.' })

    const { data, error } = await db
      .from('materials')
      .insert({ plan_id, title, type, file_url, external_url })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }
  res.status(405).end()
}
