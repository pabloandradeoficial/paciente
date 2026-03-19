import { useEffect, useState } from 'react'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'

const T = {
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  serif: "'Georgia', serif",
  navy: '#1a2744', gold: '#c9a84c', white: '#ffffff',
  gray100: '#f3f4f6', gray200: '#e5e7eb', gray400: '#9ca3af',
  gray500: '#6b7280', gray600: '#4b5563',
}

/* Subtle accent colors per category index */
const accents = ['#c9a84c', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4']

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

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: T.gold, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6, fontFamily: T.sans }}>Orientações</div>
          <h1 style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 400, color: T.navy, margin: 0, fontFamily: T.serif }}>
            Do Dia a Dia {!loading && guidelines.length > 0 && <span style={{ fontSize: 14, color: T.gray400, fontFamily: T.sans, fontWeight: 400 }}>({guidelines.length})</span>}
          </h1>
          <p style={{ fontSize: 13, color: T.gray500, fontFamily: T.sans, marginTop: 6, lineHeight: 1.6 }}>
            Cuidados e hábitos importantes para apoiar sua recuperação fora das sessões.
          </p>
        </div>

        {loading ? <Skeleton /> : guidelines.length === 0 ? <EmptyState /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {guidelines.map((g, i) => {
              const accent = accents[i % accents.length]
              return (
                <div key={g.id} style={{
                  background: T.white, borderRadius: 16, padding: 'clamp(18px,3vw,24px)',
                  border: `1px solid ${T.gray200}`, borderLeft: `4px solid ${accent}`,
                  transition: 'box-shadow 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,39,68,0.09)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                  {/* Category label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: T.sans }}>
                      {g.category}
                    </div>
                  </div>
                  {/* Content */}
                  <p style={{ fontSize: 'clamp(14px,1.6vw,15px)', color: T.gray600, lineHeight: 1.85, margin: 0, fontFamily: T.sans }}>{g.content}</p>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer note */}
        {!loading && guidelines.length > 0 && (
          <div style={{ marginTop: 24, padding: 'clamp(14px,2.5vw,18px)', background: 'rgba(201,168,76,0.07)', borderRadius: 12, border: '1px solid rgba(201,168,76,0.18)', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: T.gray500, fontFamily: T.sans, margin: 0, lineHeight: 1.7 }}>
              Estas orientações foram definidas especificamente para o seu caso. Siga com atenção e ligue em caso de dúvida:{' '}
              <a href="tel:+5535998732804" style={{ color: T.gold, textDecoration: 'none', fontWeight: 600 }}>(35) 99873-2804</a>
            </p>
          </div>
        )}
      </PatientLayout>
    </ProtectedRoute>
  )
}

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[1, 2, 3].map(i => <div key={i} style={{ height: 90, background: '#e5e7eb', borderRadius: 14, animation: 'pulse 1.5s ease-in-out infinite' }} />)}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
      <div style={{ fontSize: 15, color: '#6b7280', fontFamily: 'system-ui, sans-serif' }}>Nenhuma orientação cadastrada ainda.</div>
      <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 6, fontFamily: 'system-ui, sans-serif' }}>O Dr. Pablo irá adicionar em breve.</div>
    </div>
  )
}
