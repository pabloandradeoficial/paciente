import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/admin/AdminLayout'
import ProtectedRoute from '../../../components/shared/ProtectedRoute'
import Toast from '../../../components/shared/Toast'
import { C } from '../../../lib/colors'

export default function NewPatient() {
  const router = useRouter()
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', username: '', password: '', notes: '', is_active: true })
  const [loading, setLoading] = useState(false)
  const [toast, setToast]     = useState(null)

  function field(label, key, type = 'text', required = false) {
    return (
      <div key={key}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}{required && ' *'}
        </label>
        <input
          type={type} value={form[key]}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
          style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
        />
      </div>
    )
  }

  async function handleSave() {
    if (!form.full_name || !form.username || !form.password) {
      setToast({ msg: 'Nome, login e senha são obrigatórios.', type: 'error' }); return
    }
    setLoading(true)
    const res = await fetch('/api/patients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setToast({ msg: data.error, type: 'error' }); return }
    router.push(`/admin/pacientes/${data.id}`)
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <Head><title>Novo Paciente — Admin</title></Head>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <AdminLayout title="Novo Paciente" subtitle="Cadastrar novo paciente no sistema">
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: C.navy, fontSize: 14, cursor: 'pointer', marginBottom: 24 }}>← Voltar</button>
        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.gray200}`, padding: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {field('Nome Completo', 'full_name', 'text', true)}
            {field('Telefone', 'phone')}
            {field('E-mail', 'email', 'email')}
            {field('Login (username)', 'username', 'text', true)}
            {field('Senha', 'password', 'password', true)}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Observações Clínicas</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3}
              style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', resize: 'vertical', outline: 'none' }} />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: C.gray700 }}>
              <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} style={{ width: 16, height: 16 }} />
              Paciente ativo (pode fazer login)
            </label>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleSave} disabled={loading} style={{ padding: '12px 32px', background: C.navy, color: C.white, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15, fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Cadastrando...' : 'Cadastrar Paciente'}
            </button>
            <button onClick={() => router.back()} style={{ padding: '12px 24px', background: C.gray100, color: C.gray600, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15 }}>Cancelar</button>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
