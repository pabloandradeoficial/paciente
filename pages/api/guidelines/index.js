import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { plan_id, category, content } = req.body
    if (!plan_id || !category || !content)
      return res.status(400).json({ error: 'plan_id, category e content obrigatórios.' })

    const { data, error } = await db
      .from('guidelines')
      .insert({ plan_id, category, content })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }
  res.status(405).end()
}
