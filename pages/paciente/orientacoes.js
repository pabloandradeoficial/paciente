import { useEffect, useState } from 'react'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'

const T = {
  sans: "'Montserrat', system-ui, sans-serif",
  green: '#22c55e',
  greenDark: '#15803d',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textDark: '#374151',
  border: '#e5e7eb',
}

export default function PatientOrientacoes() {
  const [guidelines, setGuidelines] = useState([])
  const [loading, setLoading]       = useState(true)

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
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{
              fontSize: 10.5, fontWeight: 600, color: T.green,
              letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: T.sans,
            }}>Orientações</span>
            {!loading && guidelines.length > 0 && (
              <span style={{
                background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
                color: T.greenDark, fontSize: 10, fontWeight: 700,
                padding: '2px 9px', borderRadius: 20, fontFamily: T.sans,
              }}>
                {guidelines.length}
              </span>
            )}
          </div>
          <h1 style={{
            fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700,
            color: T.textPrimary, margin: '0 0 10px',
            fontFamily: T.sans, letterSpacing: '-0.4px', lineHeight: 1.15,
          }}>
            Orientações do Dia a Dia
          </h1>
          <p style={{
            fontSize: 'clamp(13.5px,1.6vw,15px)', color: T.textSecondary,
            fontFamily: T.sans, margin: 0, lineHeight: 1.7,
          }}>
            Hábitos, cuidados e recomendações definidos especialmente para a sua recuperação.
          </p>
        </div>

        {/* Cards */}
        {loading ? <Skeleton /> : guidelines.length === 0 ? <EmptyState /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {guidelines.map(g => (
              <GuidelineCard key={g.id} g={g} />
            ))}
          </div>
        )}

        {/* Rodapé */}
        {!loading && guidelines.length > 0 && (
          <div style={{
            marginTop: 28,
            padding: 'clamp(14px,3vw,18px) clamp(18px,3vw,24px)',
            background: '#ffffff',
            borderRadius: 14,
            border: '1px solid #e5e7eb',
            borderLeft: '3px solid #22c55e',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <p style={{ fontSize: 14, color: T.textDark, fontFamily: T.sans, margin: 0, lineHeight: 1.75 }}>
              Estas orientações foram definidas para o seu caso. Siga com atenção e ligue se tiver dúvidas:{' '}
              <a href="tel:+5535998732804" style={{ color: T.green, textDecoration: 'none', fontWeight: 700 }}>
                (35) 99873-2804
              </a>
            </p>
          </div>
        )}

      </PatientLayout>
    </ProtectedRoute>
  )
}

function GuidelineCard({ g }) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 16,
      border: '1px solid #e5e7eb',
      borderLeft: '3px solid #22c55e',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    }}>
      {/* Header limpo */}
      <div style={{
        padding: 'clamp(13px,2vw,16px) clamp(18px,3vw,24px)',
        display: 'flex', alignItems: 'center', gap: 8,
        borderBottom: '1px solid #f3f4f6',
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#22c55e', flexShrink: 0,
        }} />
        <div style={{
          fontSize: 10.5, fontWeight: 600, color: '#15803d',
          textTransform: 'uppercase', letterSpacing: '1.5px',
          fontFamily: T.sans,
        }}>
          {g.category}
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: 'clamp(16px,3vw,22px) clamp(18px,3vw,24px)' }}>
        <p style={{
          fontSize: 'clamp(14px,1.8vw,15px)',
          color: '#111827',
          lineHeight: 1.85,
          margin: 0,
          fontFamily: T.sans,
          fontWeight: 400,
        }}>
          {g.content}
        </p>
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
      {[110, 90, 130].map((h, i) => (
        <div key={i} style={{
          height: h, background: '#e5e7eb', borderRadius: 16,
          animation: `pulse 1.5s ${i * 0.12}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center', padding: '64px 20px',
      background: '#ffffff', borderRadius: 16,
      border: '1px solid #e5e7eb',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: '#f5f5f0', margin: '0 auto 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid #e5e7eb',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </div>
      <div style={{ fontSize: 15, color: '#111827', fontFamily: T.sans, fontWeight: 700, marginBottom: 6 }}>
        Nenhuma orientação cadastrada ainda
      </div>
      <div style={{ fontSize: 14, color: '#6b7280', fontFamily: T.sans, lineHeight: 1.6 }}>
        O Dr. Pablo irá adicionar em breve.
      </div>
    </div>
  )
}
