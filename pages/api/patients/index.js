import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Lista todos os pacientes
    const { data, error } = await db
      .from('patients')
      .select('id, username, full_name, phone, email, notes, is_active, created_at, updated_at')
      .order('updated_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    // Cria novo paciente
    const { username, password, full_name, phone, email, notes, is_active } = req.body

    if (!username || !password || !full_name) {
      return res.status(400).json({ error: 'Nome, login e senha são obrigatórios.' })
    }

    // Verifica se username já existe
    const { data: existing } = await db
      .from('patients')
      .select('id')
      .eq('username', username)
      .single()

    if (existing) {
      return res.status(409).json({ error: 'Este login já está em uso.' })
    }

    const password_hash = await bcrypt.hash(password, 10)

    const { data, error } = await db
      .from('patients')
      .insert({ username, password_hash, full_name, phone, email, notes, is_active: is_active ?? true })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  res.status(405).end()
}
