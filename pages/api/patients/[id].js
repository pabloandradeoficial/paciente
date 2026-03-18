import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    // Busca paciente com plano ativo, exercícios, orientações, materiais e notas
    const { data: patient, error } = await db
      .from('patients')
      .select(`
        id, username, full_name, phone, email, notes, is_active, created_at, updated_at,
        plans ( id, title, description, welcome_message, is_active, updated_at,
          exercises ( id, title, description, sets, reps, frequency, observations, video_url, image_url, sort_order ),
          guidelines ( id, category, content, sort_order ),
          materials ( id, title, type, file_url, external_url )
        ),
        admin_notes ( id, note, created_at )
      `)
      .eq('id', id)
      .single()

    if (error) return res.status(404).json({ error: 'Paciente não encontrado.' })
    return res.status(200).json(patient)
  }

  if (req.method === 'PATCH') {
    const { full_name, phone, email, notes, is_active, password } = req.body
    const updates = {}

    if (full_name  !== undefined) updates.full_name  = full_name
    if (phone      !== undefined) updates.phone      = phone
    if (email      !== undefined) updates.email      = email
    if (notes      !== undefined) updates.notes      = notes
    if (is_active  !== undefined) updates.is_active  = is_active

    // Redefinição de senha
    if (password) {
      updates.password_hash = await bcrypt.hash(password, 10)
    }

    const { data, error } = await db
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await db.from('patients').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  res.status(405).end()
}
