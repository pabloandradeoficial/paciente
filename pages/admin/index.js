import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../components/admin/AdminLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { C } from '../../lib/colors'

export default function AdminDashboard() {
  const router = useRouter()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/patients').then(r => r.json()).then(data => { setPatients(data); setLoading(false) })
  }, [])

  const active   = patients.filter(p => p.is_active).length
  const inactive = patients.filter(p => !p.is_active).length
  const recent   = [...patients].slice(0, 5)

  return (
    <ProtectedRoute requiredRole="admin">
      <Head><title>Dashboard — Admin</title></Head>
      <AdminLayout title="Dashboard" subtitle="Visão geral do sistema">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 32 }}>
          {[
            { label: 'Total de Pacientes', value: patients.length, color: C.navy },
            { label: 'Pacientes Ativos',   value: active,          color: C.green },
            { label: 'Pacientes Inativos', value: inactive,        color: C.gray500 },
          ].map(card => (
            <div key={card.label} style={{ background: C.white, borderRadius: 12, padding: 24, border: `1px solid ${C.gray200}` }}>
              <div style={{ fontSize: 13, color: C.gray400, marginBottom: 8 }}>{card.label}</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: card.color }}>
                {loading ? '—' : card.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.gray200}`, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.gray100}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Pacientes Recentes</div>
              <button onClick={() => router.push('/admin/pacientes')} style={{ background: 'none', border: 'none', color: C.gold, fontSize: 13, cursor: 'pointer' }}>Ver todos</button>
            </div>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: C.gray400 }}>Carregando...</div>
            ) : recent.map(p => (
              <div key={p.id}
                onClick={() => router.push(`/admin/pacientes/${p.id}`)}
                style={{ padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: `1px solid ${C.gray50}` }}
                onMouseEnter={e => e.currentTarget.style.background = C.gray50}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold, fontWeight: 700, fontSize: 13 }}>
                    {p.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.gray800 }}>{p.full_name}</div>
                    <div style={{ fontSize: 12, color: C.gray400 }}>@{p.username}</div>
                  </div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: p.is_active ? C.greenLight : C.gray100, color: p.is_active ? '#065f46' : C.gray500 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.is_active ? C.green : C.gray400 }} />
                  {p.is_active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            ))}
          </div>

          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.gray200}`, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 20 }}>Ações Rápidas</div>
            <button onClick={() => router.push('/admin/pacientes/novo')} style={{ width: '100%', padding: 14, background: C.navy, color: C.white, border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontWeight: 600, marginBottom: 12 }}>
              + Novo Paciente
            </button>
            <button onClick={() => router.push('/admin/pacientes')} style={{ width: '100%', padding: 14, background: C.gray50, color: C.gray700, border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
              Ver Todos os Pacientes
            </button>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
