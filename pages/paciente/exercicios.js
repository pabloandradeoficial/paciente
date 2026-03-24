import { useEffect, useState } from 'react'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'

const T = {
  sans:    "'Montserrat', system-ui, sans-serif",
  navy:    '#111827',
  green:   '#22c55e',
  white:   '#ffffff',
  border:  '#e5e7eb',
  muted:   '#6b7280',
  dark:    '#374151',
  pillBg:  '#f3f4f6',
}

const todayKey = () => new Date().toISOString().slice(0, 10)
function getDoneKey(id) { return `check_exercicio_${id}_${todayKey()}` }
function isChecked(id) { try { return localStorage.getItem(getDoneKey(id)) === '1' } catch { return false } }
function toggleCheck(id) {
  try {
    if (isChecked(id)) localStorage.removeItem(getDoneKey(id))
    else localStorage.setItem(getDoneKey(id), '1')
  } catch {}
}

export default function PatientExercicios() {
  const [exercises, setExercises]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [expanded, setExpanded]     = useState(null)
  const [checkedMap, setCheckedMap] = useState({})

  function refreshChecks(ids) {
    const map = {}
    ids.forEach(id => { map[id] = isChecked(id) })
    setCheckedMap(map)
  }

  useEffect(() => {
    const session = getSession()
    if (!session?.id) return
    fetch(`/api/patients/${session.id}`)
      .then(r => r.json())
      .then(data => {
        const plan   = data?.plans?.find(p => p.is_active) || data?.plans?.[0]
        const sorted = (plan?.exercises || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        setExercises(sorted)
        setLoading(false)
        if (sorted.length > 0) {
          setExpanded(sorted[0].id)
          refreshChecks(sorted.map(e => e.id))
        }
      })
  }, [])

  useEffect(() => {
    if (exercises.length > 0) refreshChecks(exercises.map(e => e.id))
  }, [exercises.length])

  const toggle = (id) => setExpanded(p => p === id ? null : id)

  return (
    <ProtectedRoute requiredRole="patient">
      <Head><title>Exercícios — Dr. Pablo Andrade</title></Head>
      <PatientLayout>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10.5, color: T.green, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 7, fontFamily: T.sans, fontWeight: 600 }}>
            Prescrição
          </div>
          <h1 style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 700, color: T.navy, margin: '0 0 8px', fontFamily: T.sans, letterSpacing: '-0.3px' }}>
            Exercícios Prescritos
            {!loading && exercises.length > 0 && (
              <span style={{ fontSize: 14, color: T.muted, fontFamily: T.sans, fontWeight: 400, marginLeft: 10 }}>
                ({exercises.length})
              </span>
            )}
          </h1>
          <p style={{ fontSize: 14, color: T.muted, fontFamily: T.sans, margin: 0, lineHeight: 1.65 }}>
            Siga as orientações de séries e repetições. Dúvidas? Entre em contato.
          </p>
        </div>

        {loading ? <Skeleton /> : exercises.length === 0 ? <EmptyState /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {exercises.map((ex, i) => {
              const open = expanded === ex.id
              const done = checkedMap[ex.id]
              return (
                <div key={ex.id} style={{
                  background: '#ffffff', borderRadius: 16,
                  border: open
                    ? '2px solid #22c55e'
                    : done
                      ? '2px solid #22c55e'
                      : '1.5px solid #e5e7eb',
                  overflow: 'hidden',
                  boxShadow: open
                    ? '0 4px 20px rgba(34,197,94,0.12)'
                    : '0 2px 12px rgba(0,0,0,0.06)',
                  transition: 'all 0.25s ease',
                }}>

                  {/* Header — clique para expandir */}
                  <button onClick={() => toggle(ex.id)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                    padding: 'clamp(14px,2.5vw,18px) clamp(16px,3vw,22px)',
                    background: open ? '#111827' : '#ffffff',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.2s', minHeight: 52,
                  }}>
                    {/* Número */}
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: open ? '#22c55e' : '#f5f5f0',
                      border: open ? 'none' : '1.5px solid #e5e7eb',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}>
                      <span style={{
                        fontWeight: 700, fontSize: 15, fontFamily: T.sans,
                        color: open ? '#111827' : '#374151',
                      }}>{i + 1}</span>
                    </div>

                    {/* Título */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 'clamp(14px,2.2vw,16px)', fontWeight: 700,
                        fontFamily: T.sans,
                        color: open ? '#ffffff' : '#111827',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{ex.title}</div>
                      {!open && done && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#15803d', background: '#f0fdf4', padding: '2px 8px', borderRadius: 10, display: 'inline-block', marginTop: 3 }}>
                          Feito hoje
                        </span>
                      )}
                      {!open && !done && (
                        <div style={{ fontSize: 12, color: T.muted, fontFamily: T.sans, marginTop: 3, fontWeight: 400 }}>
                          {[ex.sets && `${ex.sets} séries`, ex.reps && `${ex.reps} reps`, ex.frequency].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>

                    {/* Chevron */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke={open ? '#22c55e' : '#9ca3af'} strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {/* Corpo expandido */}
                  {open && (
                    <div style={{ background: '#ffffff', padding: 'clamp(18px,3vw,24px)', borderTop: '1px solid #f3f4f6' }}>

                      {/* Pills de prescrição — cinza, sem cores vibrantes */}
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
                        {[
                          { label: 'Séries',     value: ex.sets      },
                          { label: 'Repetições', value: ex.reps      },
                          { label: 'Frequência', value: ex.frequency },
                        ].filter(item => item.value).map(item => (
                          <div key={item.label} style={{
                            background: '#f3f4f6', borderRadius: 12,
                            padding: '12px 20px', textAlign: 'center',
                            border: '1px solid #e5e7eb', minWidth: 90,
                          }}>
                            <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4, fontFamily: T.sans, fontWeight: 600 }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 700, color: '#111827', fontFamily: T.sans }}>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Como realizar */}
                      {ex.description && (
                        <div style={{ marginBottom: 14, padding: '14px 16px', background: '#f9fafb', borderRadius: 10, border: '1px solid #f3f4f6' }}>
                          <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 7, fontFamily: T.sans, fontWeight: 600 }}>
                            Como realizar
                          </div>
                          <p style={{ fontSize: 'clamp(14px,1.8vw,15px)', color: '#111827', lineHeight: 1.85, margin: 0, fontFamily: T.sans }}>
                            {ex.description}
                          </p>
                        </div>
                      )}

                      {/* Atenção / observações */}
                      {ex.observations && (
                        <div style={{ marginBottom: 14, padding: '13px 16px', background: '#fff7ed', borderRadius: 10, borderLeft: '3px solid #f59e0b' }}>
                          <div style={{ fontSize: 10, color: '#92400e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, fontFamily: T.sans, fontWeight: 700 }}>
                            Atenção
                          </div>
                          <p style={{ fontSize: 'clamp(14px,1.8vw,15px)', color: '#7c2d12', lineHeight: 1.8, margin: 0, fontFamily: T.sans }}>
                            {ex.observations}
                          </p>
                        </div>
                      )}

                      {/* Vídeo */}
                      {ex.video_url && (
                        <a href={ex.video_url} target="_blank" rel="noreferrer" style={{
                          display: 'inline-flex', alignItems: 'center', gap: 8,
                          background: '#eff6ff', color: '#1d4ed8',
                          padding: '11px 20px', borderRadius: 10,
                          fontSize: 13.5, fontWeight: 600, textDecoration: 'none',
                          fontFamily: T.sans, border: '1px solid #bfdbfe',
                          marginBottom: 14, minHeight: 44,
                        }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="#1d4ed8"><polygon points="5,3 19,12 5,21"/></svg>
                          Ver vídeo demonstrativo
                        </a>
                      )}

                      {/* Fiz hoje */}
                      <div style={{ paddingTop: 14, borderTop: '1px solid #f3f4f6' }}>
                        <button
                          onClick={() => {
                            toggleCheck(ex.id)
                            setCheckedMap(prev => ({ ...prev, [ex.id]: !prev[ex.id] }))
                          }}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '11px 20px', borderRadius: 10,
                            background: checkedMap[ex.id] ? '#22c55e' : 'transparent',
                            border: checkedMap[ex.id] ? 'none' : '1.5px solid #e5e7eb',
                            color: checkedMap[ex.id] ? '#111827' : '#374151',
                            fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            fontFamily: T.sans, minHeight: 44,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {checkedMap[ex.id]
                            ? <>&#10003; Feito hoje!</>
                            : <>&#9675; Marcar como feito hoje</>
                          }
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Nota de rodapé */}
        {!loading && exercises.length > 0 && (
          <div style={{
            marginTop: 20,
            padding: 'clamp(13px,2.5vw,16px) clamp(16px,3vw,22px)',
            background: '#ffffff', borderRadius: 14,
            border: '1px solid #e5e7eb',
            borderLeft: '3px solid #22c55e',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <p style={{ fontSize: 13.5, color: '#6b7280', fontFamily: T.sans, margin: 0, lineHeight: 1.7 }}>
              Dúvidas sobre algum exercício?{' '}
              <a href="tel:+5535998732804" style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 700 }}>
                (35) 99873-2804
              </a>
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
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ height: 66, background: '#e5e7eb', borderRadius: 14, animation: `pulse 1.5s ${i * 0.12}s ease-in-out infinite` }} />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px', background: '#ffffff', borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: '#f5f5f0', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
          <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
        </svg>
      </div>
      <div style={{ fontSize: 15, color: '#111827', fontFamily: "'Montserrat', system-ui, sans-serif", fontWeight: 700, marginBottom: 6 }}>
        Nenhum exercício prescrito ainda
      </div>
      <div style={{ fontSize: 14, color: '#6b7280', fontFamily: "'Montserrat', system-ui, sans-serif", lineHeight: 1.6 }}>
        O Dr. Pablo irá adicionar o seu protocolo em breve.
      </div>
    </div>
  )
}
