import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('weekly_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data || null)
  }

  if (req.method === 'POST') {
    const { message, title } = req.body
    if (!message) return res.status(400).json({ error: 'Mensagem obrigatória' })

    // Desativar todas as anteriores
    await supabase.from('weekly_messages').update({ is_active: false }).eq('is_active', true)

    const { data, error } = await supabase
      .from('weekly_messages')
      .insert({ message, title: title || 'Mensagem desta semana', is_active: true })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  res.status(405).json({ error: 'Method not allowed' })
}
