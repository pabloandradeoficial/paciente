import { useEffect, useState } from 'react'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'

const T = {
  sans: "'Montserrat', system-ui, sans-serif",
  serif: "'Montserrat', sans-serif",
  navy: '#111827', green: '#22c55e', white: '#ffffff',
  textPrimary: '#111827', textSecondary: '#374151', textTertiary: '#4b5563', textMuted: '#6b7280',
  bg: '#f5f5f0', bgCard: '#ffffff', border: '#e5e7eb', borderLight: '#f3f4f6',
}

const ACCENT_COLORS = [
  { border: '#22c55e', dot: '#22c55e', label: '#78350f', bg: '#fffbeb' },
  { border: '#059669', dot: '#059669', label: '#065f46', bg: '#f0fdf4' },
  { border: '#2563eb', dot: '#2563eb', label: '#1e40af', bg: '#eff6ff' },
  { border: '#7c3aed', dot: '#7c3aed', label: '#4c1d95', bg: '#f5f3ff' },
  { border: '#dc2626', dot: '#dc2626', label: '#7f1d1d', bg: '#fef2f2' },
  { border: '#0891b2', dot: '#0891b2', label: '#164e63', bg: '#ecfeff' },
]

export default function PatientOrientacoes() {
  const [guidelines, setGuidelines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (!session?.id) return
    fetch(`/api/patients/${session.id}`)
      .then(r => r.json())
      .then(data => {
        const plan = data?.plans?.find(p => p.is_active) || data?.plans?.[0]
        setGuidelines((plan?.guidelines || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)))
        setLoading(false)
      })
  }, [])

  return (
    <ProtectedRoute requiredRole="patient">
      <Head><title>Orientações — Dr. Pablo Andrade</title></Head>
      <PatientLayout>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10.5, color: T.green, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6, fontFamily: T.sans }}>Orientações</div>
          <h1 style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 700, color: T.textPrimary, margin: '0 0 8px', fontFamily: T.serif }}>
            Orientações do Dia a Dia
            {!loading && guidelines.length > 0 && (
              <span style={{ fontSize: 14, color: T.textMuted, fontFamily: T.sans, fontWeight: 400, marginLeft: 10 }}>({guidelines.length})</span>
            )}
          </h1>
          <p style={{ fontSize: 13.5, color: T.textTertiary, fontFamily: T.sans, margin: 0, lineHeight: 1.65 }}>
            Hábitos, cuidados e recomendações definidos especialmente para a sua recuperação.
          </p>
        </div>

        {loading ? <Skeleton /> : guidelines.length === 0 ? <EmptyState /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {guidelines.map((g, i) => {
              const ac = ACCENT_COLORS[i % ACCENT_COLORS.length]
              return (
                <div key={g.id} style={{
                  background: T.bgCard, borderRadius: 16, padding: 'clamp(20px,3.5vw,28px)',
                  border: `1px solid ${T.border}`, borderLeft: `4px solid ${ac.border}`,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                }}>
                  {/* Category */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: ac.dot, flexShrink: 0 }} />
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: ac.label, textTransform: 'uppercase', letterSpacing: '1.2px', fontFamily: T.sans }}>{g.category}</div>
                  </div>
                  {/* Content — DARK on WHITE */}
                  <p style={{ fontSize: 'clamp(14px,1.8vw,15px)', color: T.textSecondary, lineHeight: 1.9, margin: 0, fontFamily: T.sans }}>{g.content}</p>
                </div>
              )
            })}
          </div>
        )}

        {!loading && guidelines.length > 0 && (
          <div style={{ marginTop: 24, padding: 'clamp(16px,3vw,20px)', background: '#fffbeb', borderRadius: 12, border: '1px solid rgba(34,197,94,0.25)', textAlign: 'center', borderLeft: '3px solid #22c55e', paddingLeft: 'clamp(18px,3vw,24px)' }}>
            <p style={{ fontSize: 13.5, color: '#78350f', fontFamily: T.sans, margin: 0, lineHeight: 1.7 }}>
              Estas orientações foram definidas para o seu caso. Siga com atenção e ligue se tiver dúvidas:{' '}
              <a href="tel:+5535998732804" style={{ color: T.green, textDecoration: 'none', fontWeight: 700 }}>(35) 99873-2804</a>
            </p>
          </div>
        )}
      </PatientLayout>
    </ProtectedRoute>
  )
}

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
      {[1, 2, 3].map(i => <div key={i} style={{ height: 90, background: '#e5e7eb', borderRadius: 14, animation: `pulse 1.5s ${i*0.1}s ease-in-out infinite` }} />)}
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
      <div style={{ fontSize: 15, color: '#374151', fontFamily: 'system-ui,sans-serif', fontWeight: 600, marginBottom: 6 }}>Nenhuma orientação cadastrada ainda</div>
      <div style={{ fontSize: 13, color: '#6b7280', fontFamily: 'system-ui,sans-serif' }}>O Dr. Pablo irá adicionar em breve.</div>
    </div>
  )
}
