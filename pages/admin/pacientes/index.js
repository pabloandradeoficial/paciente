import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/admin/AdminLayout'
import ProtectedRoute from '../../../components/shared/ProtectedRoute'
import Toast from '../../../components/shared/Toast'

const T = {
  sans: "'Montserrat', system-ui, sans-serif",
  navy: '#1a2744', gold: '#c9a84c', white: '#ffffff',
  gray50: '#f9fafb', gray100: '#f3f4f6', gray200: '#e5e7eb',
  gray400: '#9ca3af', gray500: '#6b7280', gray600: '#4b5563', gray700: '#374151', gray800: '#1f2937',
  green: '#059669', greenLight: '#d1fae5', greenDark: '#065f46',
  amber: '#d97706', amberLight: '#fef3c7', amberDark: '#78350f',
  red: '#ef4444', redLight: '#fee2e2',
}

function initials(name) { return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() }

function StatusBadge({ active }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 700, fontFamily: T.sans, background: active ? T.greenLight : T.gray100, color: active ? T.greenDark : T.gray500 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: active ? T.green : T.gray400 }} />
      {active ? 'Ativo' : 'Inativo'}
    </span>
  )
}

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
        <style>{`
          .patient-table { display: block; }
          .patient-cards { display: none; }
          @media (max-width: 768px) {
            .patient-table { display: none !important; }
            .patient-cards { display: flex !important; }
          }
        `}</style>

        {/* ── Toolbar ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 10, flex: 1, flexWrap: 'wrap' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou login..."
              style={{ padding: '10px 14px', border: `1px solid ${T.gray200}`, borderRadius: 9, fontSize: 14, minWidth: 0, flex: 1, outline: 'none', fontFamily: T.sans, color: T.gray800, minHeight: 48 }}
              onFocus={e => e.target.style.borderColor = T.gold}
              onBlur={e => e.target.style.borderColor = T.gray200} />
            <select value={filter} onChange={e => setFilter(e.target.value)}
              style={{ padding: '10px 14px', border: `1px solid ${T.gray200}`, borderRadius: 9, fontSize: 14, background: T.white, cursor: 'pointer', outline: 'none', fontFamily: T.sans, color: T.gray700, minHeight: 48 }}>
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
          <button onClick={() => router.push('/admin/pacientes/novo')}
            style={{ padding: '10px 20px', background: T.navy, color: T.white, border: 'none', borderRadius: 9, fontSize: 14, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap', fontFamily: T.sans, minHeight: 48 }}>
            + Novo
          </button>
        </div>

        {/* ── Desktop table ── */}
        <div className="patient-table" style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.gray200}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: T.gray50, borderBottom: `1px solid ${T.gray200}` }}>
                {['Paciente', 'Login', 'Telefone', 'Status', 'Atualizado', 'Ações'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: T.gray500, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: T.sans }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: T.gray400, fontFamily: T.sans }}>Carregando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: T.gray400, fontFamily: T.sans }}>Nenhum paciente encontrado.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${T.gray100}`, cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: T.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.gold, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{initials(p.full_name)}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.gray800, fontFamily: T.sans }}>{p.full_name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 16px', fontSize: 13, color: T.gray500, fontFamily: T.sans }}>@{p.username}</td>
                  <td style={{ padding: '16px 16px', fontSize: 13, color: T.gray500, fontFamily: T.sans }}>{p.phone || '—'}</td>
                  <td style={{ padding: '16px 16px' }}><StatusBadge active={p.is_active} /></td>
                  <td style={{ padding: '16px 16px', fontSize: 12, color: T.gray400, fontFamily: T.sans }}>{p.updated_at?.slice(0, 10) || '—'}</td>
                  <td style={{ padding: '16px 16px' }}>
                    <div style={{ display: 'flex', gap: 7 }}>
                      <button onClick={() => router.push(`/admin/pacientes/${p.id}`)} style={{ padding: '6px 12px', background: T.navy, color: T.white, border: 'none', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontFamily: T.sans, transition: 'all 0.2s ease' }}>Ver</button>
                      <button onClick={() => toggleStatus(p)} style={{ padding: '6px 10px', background: p.is_active ? T.amberLight : T.greenLight, color: p.is_active ? T.amberDark : T.greenDark, border: 'none', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontFamily: T.sans, transition: 'all 0.2s ease' }}>{p.is_active ? 'Inativar' : 'Ativar'}</button>
                      <button onClick={() => deletePatient(p)} style={{ padding: '6px 10px', background: T.redLight, color: T.red, border: 'none', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontFamily: T.sans, transition: 'all 0.2s ease' }}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile cards ── */}
        <div className="patient-cards" style={{ display: 'none', flexDirection: 'column', gap: 12 }}>
          {loading ? (
            [1,2,3].map(i => <div key={i} style={{ height: 96, background: '#e5e7eb', borderRadius: 14, animation: 'pulse 1.5s ease-in-out infinite' }} />)
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: T.white, borderRadius: 14, color: T.gray400, fontFamily: T.sans }}>Nenhum paciente encontrado.</div>
          ) : filtered.map(p => (
            <div key={p.id} style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.gray200}`, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: T.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.gold, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{initials(p.full_name)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.gray800, fontFamily: T.sans, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.full_name}</div>
                  <div style={{ fontSize: 12, color: T.gray500, fontFamily: T.sans, marginTop: 2 }}>@{p.username}{p.phone ? ` · ${p.phone}` : ''}</div>
                </div>
                <StatusBadge active={p.is_active} />
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => router.push(`/admin/pacientes/${p.id}`)} style={{ flex: 1, padding: '10px 0', background: T.navy, color: T.white, border: 'none', borderRadius: 9, fontSize: 13, cursor: 'pointer', fontWeight: 600, fontFamily: T.sans, minHeight: 48 }}>
                  Ver paciente
                </button>
                <button onClick={() => toggleStatus(p)} style={{ padding: '10px 14px', background: p.is_active ? T.amberLight : T.greenLight, color: p.is_active ? T.amberDark : T.greenDark, border: 'none', borderRadius: 9, fontSize: 13, cursor: 'pointer', fontFamily: T.sans, minHeight: 48 }}>
                  {p.is_active ? 'Inativar' : 'Ativar'}
                </button>
                <button onClick={() => deletePatient(p)} style={{ padding: '10px 14px', background: T.redLight, color: T.red, border: 'none', borderRadius: 9, fontSize: 13, cursor: 'pointer', fontFamily: T.sans, minHeight: 48 }}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
        </div>

      </AdminLayout>
    </ProtectedRoute>
  )
}
