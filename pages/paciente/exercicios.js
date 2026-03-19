import { useEffect, useState } from 'react'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'

const T = {
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  serif: "'Georgia', serif",
  navy: '#1a2744', navyDeep: '#0e1628', gold: '#c9a84c',
  white: '#ffffff', gray100: '#f3f4f6', gray200: '#e5e7eb',
  gray400: '#9ca3af', gray500: '#6b7280', gray600: '#4b5563',
  amber: '#f59e0b', amberLight: '#fef3c7',
  blue: '#3b82f6', blueLight: '#dbeafe',
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
      })
  }, [])

  return (
    <ProtectedRoute requiredRole="patient">
      <Head><title>Exercícios — Dr. Pablo Andrade</title></Head>
      <PatientLayout>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: T.gold, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6, fontFamily: T.sans }}>Prescrição</div>
          <h1 style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 400, color: T.navy, margin: 0, fontFamily: T.serif }}>
            Seus Exercícios {!loading && exercises.length > 0 && <span style={{ fontSize: 14, color: T.gray400, fontFamily: T.sans, fontWeight: 400 }}>({exercises.length})</span>}
          </h1>
          <p style={{ fontSize: 13, color: T.gray500, fontFamily: T.sans, marginTop: 6, lineHeight: 1.6 }}>
            Siga as orientações de séries e repetições conforme prescrito. Em caso de dúvida, entre em contato.
          </p>
        </div>

        {loading ? <Skeleton /> : exercises.length === 0 ? <EmptyState label="exercício" /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {exercises.map((ex, i) => {
              const open = expanded === ex.id
              return (
                <div key={ex.id} style={{ background: T.white, borderRadius: 16, border: `1px solid ${T.gray200}`, overflow: 'hidden', transition: 'box-shadow 0.2s' }}>
                  {/* Card header — always visible, tappable */}
                  <button onClick={() => setExpanded(open ? null : ex.id)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: 'clamp(14px,2.5vw,18px) clamp(16px,3vw,22px)',
                    background: open ? T.navy : T.white, border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s',
                  }}>
                    {/* Number badge */}
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: open ? T.gold : T.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                      <span style={{ color: open ? T.navy : T.gray500, fontWeight: 700, fontSize: 14, fontFamily: T.sans }}>{i + 1}</span>
                    </div>
                    {/* Title */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 'clamp(14px,1.8vw,16px)', fontWeight: 700, color: open ? T.white : T.navy, fontFamily: T.sans, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.title}</div>
                      {!open && (
                        <div style={{ fontSize: 12, color: T.gray400, fontFamily: T.sans, marginTop: 2 }}>
                          {[ex.sets && `${ex.sets} séries`, ex.reps && `${ex.reps} reps`, ex.frequency].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>
                    {/* Chevron */}
                    <span style={{ color: open ? T.gold : T.gray400, fontSize: 18, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>⌄</span>
                  </button>

                  {/* Expanded body */}
                  {open && (
                    <div style={{ padding: 'clamp(16px,2.5vw,22px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      {/* Prescription pills */}
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                        {[['Séries', ex.sets], ['Repetições', ex.reps], ['Frequência', ex.frequency]].filter(([, v]) => v).map(([l, v]) => (
                          <div key={l} style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 10, padding: '9px 16px', textAlign: 'center', minWidth: 80 }}>
                            <div style={{ fontSize: 9, color: T.gold, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 3, fontFamily: T.sans }}>{l}</div>
                            <div style={{ fontSize: 'clamp(14px,2vw,17px)', fontWeight: 700, color: T.white, fontFamily: T.sans }}>{v}</div>
                          </div>
                        ))}
                      </div>

                      {/* Description */}
                      {ex.description && (
                        <p style={{ fontSize: 14, color: '#d1d5db', lineHeight: 1.8, margin: '0 0 14px', fontFamily: T.sans }}>{ex.description}</p>
                      )}

                      {/* Observation */}
                      {ex.observations && (
                        <div style={{ background: T.amberLight, borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#78350f', borderLeft: `3px solid ${T.amber}`, marginBottom: 14, fontFamily: T.sans }}>
                          <strong style={{ display: 'block', fontSize: 10, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Atenção</strong>
                          {ex.observations}
                        </div>
                      )}

                      {/* Video */}
                      {ex.video_url && (
                        <a href={ex.video_url} target="_blank" rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.blueLight, color: T.blue, padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans }}>
                          <span>▶</span> Ver vídeo demonstrativo
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
          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12.5, color: T.gray400, fontFamily: T.sans, lineHeight: 1.7 }}>
            Mantenha a consistência. Dúvidas? Ligue para{' '}
            <a href="tel:+5535998732804" style={{ color: T.gold, textDecoration: 'none', fontWeight: 600 }}>(35) 99873-2804</a>
          </div>
        )}
      </PatientLayout>
    </ProtectedRoute>
  )
}

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[1, 2, 3].map(i => <div key={i} style={{ height: 64, background: '#e5e7eb', borderRadius: 14, animation: 'pulse 1.5s ease-in-out infinite' }} />)}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  )
}

function EmptyState({ label }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f3f4f6', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#9ca3af', fontSize: 20 }}>·</span>
      </div>
      <div style={{ fontSize: 15, color: '#6b7280', fontFamily: 'system-ui, sans-serif' }}>Nenhum {label} cadastrado ainda.</div>
      <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 6, fontFamily: 'system-ui, sans-serif' }}>O Dr. Pablo irá adicionar em breve.</div>
    </div>
  )
}
