import { useEffect, useState } from 'react'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'

const T = {
  sans:  "'Montserrat', system-ui, sans-serif",
  serif: "'Montserrat', sans-serif",
  navy:  '#111827', green: '#22c55e', white: '#ffffff',
  textPrimary: '#111827', textSecondary: '#374151', textTertiary: '#4b5563', textMuted: '#6b7280',
  bg: '#f5f5f0', bgCard: '#ffffff', border: '#e5e7eb',
}

/* Paleta premium rotativa */
const ACCENTS = [
  { border: '#22c55e', headerBg: 'rgba(34,197,94,0.06)',  label: '#15803d', icon: 'activity'  },
  { border: '#3b82f6', headerBg: 'rgba(59,130,246,0.06)', label: '#1d4ed8', icon: 'clock'     },
  { border: '#8b5cf6', headerBg: 'rgba(139,92,246,0.06)', label: '#6d28d9', icon: 'moon'      },
  { border: '#f59e0b', headerBg: 'rgba(245,158,11,0.06)', label: '#b45309', icon: 'shield'    },
  { border: '#ef4444', headerBg: 'rgba(239,68,68,0.06)',  label: '#b91c1c', icon: 'alert'     },
  { border: '#06b6d4', headerBg: 'rgba(6,182,212,0.06)',  label: '#0e7490', icon: 'doc'       },
]

/* Ícones SVG por tipo */
function CategoryIcon({ type, color, size = 18 }) {
  const s = { width: size, height: size, flexShrink: 0 }
  const p = { fill: 'none', stroke: color, strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (type === 'activity') return (
    <svg viewBox="0 0 24 24" style={s} {...p}>
      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
    </svg>
  )
  if (type === 'clock') return (
    <svg viewBox="0 0 24 24" style={s} {...p}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12,6 12,12 16,14"/>
    </svg>
  )
  if (type === 'moon') return (
    <svg viewBox="0 0 24 24" style={s} {...p}>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  )
  if (type === 'shield') return (
    <svg viewBox="0 0 24 24" style={s} {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
  if (type === 'alert') return (
    <svg viewBox="0 0 24 24" style={s} {...p}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
  /* doc — fallback */
  return (
    <svg viewBox="0 0 24 24" style={s} {...p}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  )
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

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            marginBottom: 12,
          }}>
            <span style={{
              fontSize: 10.5, fontWeight: 600, color: T.green,
              letterSpacing: '2.5px', textTransform: 'uppercase',
              fontFamily: T.sans,
            }}>Orientações</span>
            {!loading && guidelines.length > 0 && (
              <span style={{
                background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
                color: '#15803d', fontSize: 10, fontWeight: 700,
                padding: '2px 9px', borderRadius: 20, fontFamily: T.sans,
              }}>
                {guidelines.length}
              </span>
            )}
          </div>
          <h1 style={{
            fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800,
            color: T.textPrimary, margin: '0 0 10px',
            fontFamily: T.serif, letterSpacing: '-0.4px', lineHeight: 1.15,
          }}>
            Orientações do Dia a Dia
          </h1>
          <p style={{
            fontSize: 'clamp(13.5px,1.6vw,15px)', color: T.textTertiary,
            fontFamily: T.sans, margin: 0, lineHeight: 1.7,
          }}>
            Hábitos, cuidados e recomendações definidos especialmente para a sua recuperação.
          </p>
        </div>

        {/* ── CARDS ── */}
        {loading ? <Skeleton /> : guidelines.length === 0 ? <EmptyState /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {guidelines.map((g, i) => {
              const ac = ACCENTS[i % ACCENTS.length]
              return (
                <GuidelineCard key={g.id} g={g} ac={ac} />
              )
            })}
          </div>
        )}

        {/* ── NOTA DE RODAPÉ ── */}
        {!loading && guidelines.length > 0 && (
          <div style={{
            marginTop: 28,
            padding: 'clamp(16px,3vw,22px) clamp(18px,3vw,26px)',
            background: 'linear-gradient(135deg, #f0fdf4, #fefce8)',
            borderRadius: 14,
            border: '1px solid rgba(34,197,94,0.2)',
            borderLeft: '4px solid #22c55e',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#22c55e', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.68 19.79 19.79 0 01.06 1.1 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
              </svg>
            </div>
            <p style={{ fontSize: 'clamp(13px,1.6vw,14px)', color: '#374151', fontFamily: T.sans, margin: 0, lineHeight: 1.75 }}>
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

/* ── CARD individual ── */
function GuidelineCard({ g, ac }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#ffffff',
        borderRadius: 16,
        border: `1px solid ${hovered ? ac.border : '#e5e7eb'}`,
        borderLeft: `4px solid ${ac.border}`,
        boxShadow: hovered
          ? `0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)`
          : '0 2px 16px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}
    >
      {/* Card header com fundo colorido suave */}
      <div style={{
        background: ac.headerBg,
        padding: 'clamp(14px,2.5vw,18px) clamp(18px,3vw,24px)',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: `1px solid ${ac.border}22`,
      }}>
        {/* Ícone */}
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: '#fff',
          border: `1.5px solid ${ac.border}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 2px 8px ${ac.border}20`,
        }}>
          <CategoryIcon type={ac.icon} color={ac.border} size={17} />
        </div>

        {/* Nome da categoria */}
        <div style={{
          fontSize: 11, fontWeight: 700, color: ac.label,
          textTransform: 'uppercase', letterSpacing: '1.5px',
          fontFamily: "'Montserrat', system-ui, sans-serif",
        }}>
          {g.category}
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: 'clamp(18px,3vw,24px)' }}>
        <p style={{
          fontSize: 'clamp(14px,1.8vw,15px)',
          color: '#374151',
          lineHeight: 1.85,
          margin: 0,
          fontFamily: "'Montserrat', system-ui, sans-serif",
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
      background: '#ffffff', borderRadius: 20,
      border: '1px solid #e5e7eb',
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: '#f0fdf4', margin: '0 auto 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1.5px solid rgba(34,197,94,0.25)',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </div>
      <div style={{
        fontSize: 16, color: '#111827',
        fontFamily: "'Montserrat', system-ui, sans-serif",
        fontWeight: 700, marginBottom: 8,
      }}>
        Nenhuma orientação cadastrada ainda
      </div>
      <div style={{
        fontSize: 14, color: '#6b7280',
        fontFamily: "'Montserrat', system-ui, sans-serif",
        lineHeight: 1.6,
      }}>
        O Dr. Pablo irá adicionar em breve.
      </div>
    </div>
  )
}
