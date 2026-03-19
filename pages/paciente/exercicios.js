import { useEffect, useState } from 'react'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'

/* ── ALL COLORS DARK ON LIGHT — legibility is priority ── */
const T = {
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  serif: "'Georgia', serif",
  navy:    '#1a2744',
  navyMid: '#243358',
  gold:    '#c9a84c',
  white:   '#ffffff',
  /* Text colors — ALL DARK for maximum legibility */
  textPrimary:   '#1a2744',  /* navy — headings */
  textSecondary: '#374151',  /* gray-700 — body text */
  textTertiary:  '#4b5563',  /* gray-600 — descriptions */
  textMuted:     '#6b7280',  /* gray-500 — labels */
  /* Backgrounds */
  bg:      '#f5f3ed',
  bgCard:  '#ffffff',
  bgMeta:  '#f3f4f6',
  /* Borders */
  border:  '#e5e7eb',
  borderLight: '#f3f4f6',
  /* Accents */
  amberBg:   '#fef3c7', amberText: '#78350f', amberBorder: '#f59e0b',
  blueBg:    '#dbeafe', blueText:  '#1e40af',
  greenText: '#065f46',
}

export default function PatientExercicios() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading]     = useState(true)
  const [expanded, setExpanded]   = useState(null)

  useEffect(() => {
    const session = getSession()
    if (!session?.id) return
    fetch(`/api/patients/${session.id}`)
      .then(r => r.json())
      .then(data => {
        const plan = data?.plans?.find(p => p.is_active) || data?.plans?.[0]
        setExercises((plan?.exercises || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)))
        setLoading(false)
        /* Auto-expand first exercise */
        if (plan?.exercises?.length > 0) setExpanded(plan.exercises[0].id)
      })
  }, [])

  const toggle = (id) => setExpanded(prev => prev === id ? null : id)

  return (
    <ProtectedRoute requiredRole="patient">
      <Head><title>Exercícios — Dr. Pablo Andrade</title></Head>
      <PatientLayout>

        {/* ── Section header ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10.5, color: T.gold, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6, fontFamily: T.sans }}>Prescrição</div>
          <h1 style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 700, color: T.textPrimary, margin: '0 0 8px', fontFamily: T.serif }}>
            Exercícios Prescritos
            {!loading && exercises.length > 0 && (
              <span style={{ fontSize: 14, color: T.textMuted, fontFamily: T.sans, fontWeight: 400, marginLeft: 10 }}>({exercises.length})</span>
            )}
          </h1>
          <p style={{ fontSize: 13.5, color: T.textTertiary, fontFamily: T.sans, margin: 0, lineHeight: 1.65 }}>
            Realize os exercícios conforme as orientações abaixo. Em caso de dúvida ou desconforto, entre em contato.
          </p>
        </div>

        {loading ? <Skeleton /> : exercises.length === 0 ? <EmptyState /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {exercises.map((ex, i) => {
              const open = expanded === ex.id
              return (
                <div key={ex.id} style={{
                  background: T.bgCard, borderRadius: 16,
                  border: open ? `1.5px solid ${T.gold}` : `1px solid ${T.border}`,
                  overflow: 'hidden', boxShadow: open ? '0 4px 20px rgba(201,168,76,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}>

                  {/* ── Card header button ── */}
                  <button onClick={() => toggle(ex.id)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                    padding: 'clamp(14px,2.5vw,18px) clamp(16px,3vw,22px)',
                    background: open ? T.navy : T.bgCard,
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.2s',
                  }}>
                    {/* Number */}
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: open ? T.gold : T.bgMeta,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.2s',
                    }}>
                      <span style={{ fontWeight: 700, fontSize: 15, fontFamily: T.sans, color: open ? T.navy : T.textMuted }}>{i + 1}</span>
                    </div>

                    {/* Title + preview */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 'clamp(14px,2vw,16px)', fontWeight: 700, fontFamily: T.sans,
                        color: open ? T.white : T.textPrimary,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{ex.title}</div>
                      {!open && (
                        <div style={{ fontSize: 12, color: T.textMuted, fontFamily: T.sans, marginTop: 2 }}>
                          {[ex.sets && `${ex.sets} séries`, ex.reps && `${ex.reps} reps`, ex.frequency].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>

                    {/* Chevron */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={open ? T.gold : T.textMuted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* ── Expanded body — ALL DARK TEXT on WHITE BG ── */}
                  {open && (
                    <div style={{ background: T.bgCard, padding: 'clamp(18px,3vw,24px)' }}>

                      {/* Prescription grid */}
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
                        {[
                          { label: 'Séries',      value: ex.sets      },
                          { label: 'Repetições',  value: ex.reps      },
                          { label: 'Frequência',  value: ex.frequency },
                        ].filter(item => item.value).map(item => (
                          <div key={item.label} style={{
                            background: T.bgMeta, borderRadius: 10, padding: '10px 18px',
                            textAlign: 'center', border: `1px solid ${T.border}`, minWidth: 80,
                          }}>
                            <div style={{ fontSize: 9.5, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4, fontFamily: T.sans, fontWeight: 600 }}>{item.label}</div>
                            <div style={{ fontSize: 'clamp(15px,2.5vw,18px)', fontWeight: 800, color: T.textPrimary, fontFamily: T.sans }}>{item.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Description — DARK text */}
                      {ex.description && (
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ fontSize: 10.5, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, fontFamily: T.sans, fontWeight: 600 }}>Como realizar</div>
                          <p style={{ fontSize: 'clamp(14px,1.8vw,15px)', color: T.textSecondary, lineHeight: 1.85, margin: 0, fontFamily: T.sans }}>
                            {ex.description}
                          </p>
                        </div>
                      )}

                      {/* Observations — amber box with DARK text */}
                      {ex.observations && (
                        <div style={{
                          background: T.amberBg, borderRadius: 10, padding: '12px 16px',
                          borderLeft: `3px solid ${T.amberBorder}`, marginBottom: 14,
                        }}>
                          <div style={{ fontSize: 10.5, color: T.amberText, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 5, fontFamily: T.sans, fontWeight: 700 }}>Atenção</div>
                          <p style={{ fontSize: 'clamp(13px,1.6vw,14px)', color: T.amberText, lineHeight: 1.8, margin: 0, fontFamily: T.sans }}>{ex.observations}</p>
                        </div>
                      )}

                      {/* Video link */}
                      {ex.video_url && (
                        <a href={ex.video_url} target="_blank" rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.blueBg, color: T.blueText, padding: '10px 18px', borderRadius: 10, fontSize: 13.5, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans, border: '1px solid #bfdbfe' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={T.blueText}><polygon points="5,3 19,12 5,21"/></svg>
                          Ver vídeo demonstrativo
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Footer note */}
        {!loading && exercises.length > 0 && (
          <div style={{ marginTop: 24, padding: 'clamp(14px,2.5vw,18px)', background: T.bgCard, borderRadius: 12, border: `1px solid ${T.border}`, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: T.textTertiary, fontFamily: T.sans, margin: 0, lineHeight: 1.7 }}>
              Dúvidas sobre algum exercício? Ligue:{' '}
              <a href="tel:+5535998732804" style={{ color: T.gold, textDecoration: 'none', fontWeight: 700 }}>(35) 99873-2804</a>
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
      {[1, 2, 3].map(i => <div key={i} style={{ height: 64, background: '#e5e7eb', borderRadius: 14, animation: `pulse 1.5s ${i * 0.1}s ease-in-out infinite` }} />)}
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
      <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>—</div>
      <div style={{ fontSize: 15, color: '#374151', fontFamily: 'system-ui, sans-serif', fontWeight: 600, marginBottom: 6 }}>Nenhum exercício prescrito ainda</div>
      <div style={{ fontSize: 13, color: '#6b7280', fontFamily: 'system-ui, sans-serif' }}>O Dr. Pablo irá adicionar o seu protocolo em breve.</div>
    </div>
  )
}
