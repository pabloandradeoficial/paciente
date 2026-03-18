import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/admin/AdminLayout'
import ProtectedRoute from '../../../components/shared/ProtectedRoute'
import StatusBadge from '../../../components/shared/StatusBadge'
import Toast from '../../../components/shared/Toast'
import { C } from '../../../lib/colors'

export default function PatientList() {
  const router = useRouter()
  const [patients, setPatients] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [toast, setToast]       = useState(null)

  function showToast(msg, type = 'success') { setToast({ msg, type }) }

  useEffect(() => {
    fetch('/api/patients').then(r => r.json()).then(data => { setPatients(data); setLoading(false) })
  }, [])

  const filtered = patients.filter(p => {
    const matchSearch = p.full_name.toLowerCase().includes(search.toLowerCase()) || p.username.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'active' ? p.is_active : !p.is_active)
    return matchSearch && matchFilter
  })

  async function toggleStatus(p) {
    await fetch(`/api/patients/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: !p.is_active }) })
    setPatients(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !x.is_active } : x))
    showToast(`${p.full_name} ${!p.is_active ? 'ativado' : 'inativado'}.`)
  }

  async function deletePatient(p) {
    if (!confirm(`Remover ${p.full_name}? Esta ação não pode ser desfeita.`)) return
    await fetch(`/api/patients/${p.id}`, { method: 'DELETE' })
    setPatients(prev => prev.filter(x => x.id !== p.id))
    showToast(`${p.full_name} removido.`)
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <Head><title>Pacientes — Admin</title></Head>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <AdminLayout title="Pacientes" subtitle={`${patients.length} pacientes cadastrados`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 12, flex: 1, flexWrap: 'wrap' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou login..." style={{ padding: '10px 16px', border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, minWidth: 220, flex: 1, outline: 'none' }} />
            <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '10px 16px', border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, background: C.white, cursor: 'pointer', outline: 'none' }}>
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
          <button onClick={() => router.push('/admin/pacientes/novo')} style={{ padding: '10px 24px', background: C.navy, color: C.white, border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
            + Novo Paciente
          </button>
        </div>

        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.gray200}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.gray50, borderBottom: `1px solid ${C.gray200}` }}>
                {['Paciente', 'Login', 'Telefone', 'Status', 'Atualizado', 'Ações'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: C.gray500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: C.gray400 }}>Carregando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: C.gray400 }}>Nenhum paciente encontrado.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${C.gray100}` }}
                  onMouseEnter={e => e.currentTarget.style.background = C.gray50}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                        {p.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.gray800 }}>{p.full_name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: C.gray500 }}>@{p.username}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: C.gray500 }}>{p.phone || '—'}</td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge active={p.is_active} /></td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: C.gray400 }}>{p.updated_at?.slice(0, 10) || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => router.push(`/admin/pacientes/${p.id}`)} style={{ padding: '6px 12px', background: C.navy, color: C.white, border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Ver</button>
                      <button onClick={() => toggleStatus(p)} style={{ padding: '6px 12px', background: p.is_active ? C.amberLight : C.greenLight, color: p.is_active ? '#92400e' : '#065f46', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
                        {p.is_active ? 'Inativar' : 'Ativar'}
                      </button>
                      <button onClick={() => deletePatient(p)} style={{ padding: '6px 12px', background: C.redLight, color: C.red, border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
