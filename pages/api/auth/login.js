import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

// Client com service_role (server-side only — nunca exponha no frontend)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha obrigatórios.' })
  }

  // ── Verifica se é o admin ──────────────────────────────────────────
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.status(200).json({
      role: 'admin',
      name: process.env.ADMIN_NAME || 'Dr. Pablo Andrade',
    })
  }

  // ── Verifica se é paciente ─────────────────────────────────────────
  const { data: patient, error } = await supabaseAdmin
    .from('patients')
    .select('id, username, password_hash, full_name, is_active')
    .eq('username', username)
    .single()

  if (error || !patient) {
    return res.status(401).json({ error: 'Usuário ou senha incorretos.' })
  }

  if (!patient.is_active) {
    return res.status(403).json({ error: 'Acesso inativo. Entre em contato com o fisioterapeuta.' })
  }

  const valid = await bcrypt.compare(password, patient.password_hash)
  if (!valid) {
    return res.status(401).json({ error: 'Usuário ou senha incorretos.' })
  }

  return res.status(200).json({
    role: 'patient',
    id: patient.id,
    username: patient.username,
    full_name: patient.full_name,
  })
}
