import { useEffect, useState } from 'react'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'

/* ── LEGIBILIDADE MÁXIMA: todos os textos escuros sobre fundo branco ── */
const T = {
  sans:  ''Montserrat', system-ui, sans-serif',
  serif: 'Montserrat', sans-serif,
  /* Cores absolutamente fixas — nunca mudar */
  navy:    '#1a2744',
  gold:    '#c9a84c',
  white:   '#ffffff',
  /* Hierarquia de texto — sempre escuro */
  h1:     '#111827',  /* quase preto — títulos de exercícios */
  body:   '#1f2937',  /* muito escuro — descrições */
  meta:   '#374151',  /* escuro — labels e metadados */
  muted:  '#4b5563',  /* médio — textos secundários */
  hint:   '#6b7280',  /* só para info muito secundária */
  /* Backgrounds */
  pageBg: '#f5f3ed',
  card:   '#ffffff',
  metaBg: '#f1f5f9',  /* levemente azulado para pills */
  border: '#d1d5db',  /* borda mais definida */
  borderFocus: '#c9a84c',
  /* Amber para observações */
  amberBg:     '#fff7ed',
  amberBorder: '#f59e0b',
  amberText:   '#7c2d12',
  /* Blue para vídeo */
  blueBg:   '#eff6ff',
  blueText: '#1d4ed8',
  blueBorder: '#bfdbfe',
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
        const sorted = (plan?.exercises || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        setExercises(sorted)
        setLoading(false)
        if (sorted.length > 0) setExpanded(sorted[0].id)
      })
  }, [])

  const toggle = (id) => setExpanded(p => p === id ? null : id)

  return (
    <ProtectedRoute requiredRole="patient">
      <Head><title>Exercícios — Dr. Pablo Andrade</title></Head>
      <PatientLayout>

        {/* Section header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10.5, color: T.gold, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 7, fontFamily: T.sans }}>Prescrição</div>
          <h1 style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 700, color: T.h1, margin: '0 0 8px', fontFamily: T.serif, letterSpacing: '-0.3px' }}>
            Exercícios Prescritos
            {!loading && exercises.length > 0 && (
              <span style={{ fontSize: 14, color: T.hint, fontFamily: T.sans, fontWeight: 400, marginLeft: 10 }}>({exercises.length})</span>
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
              return (
                <div key={ex.id} style={{
                  background: T.card, borderRadius: 16,
                  border: open ? `2px solid ${T.gold}` : `1.5px solid ${T.border}`,
                  overflow: 'hidden',
                  boxShadow: open ? '0 6px 24px rgba(201,168,76,0.14)' : '0 1px 3px rgba(0,0,0,0.06)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}>

                  {/* ── HEADER — sempre visível, toque para expandir ── */}
                  <button onClick={() => toggle(ex.id)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                    padding: 'clamp(15px,2.5vw,20px) clamp(16px,3vw,22px)',
                    background: open ? T.navy : T.card,
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.22s',
                  }}>
                    {/* Número */}
                    <div style={{
                      width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                      background: open ? T.gold : T.metaBg,
                      border: open ? 'none' : `1.5px solid ${T.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.22s',
                    }}>
                      <span style={{ fontWeight: 800, fontSize: 16, fontFamily: T.sans, color: open ? T.navy : T.meta }}>{i + 1}</span>
                    </div>

                    {/* Título + preview */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 'clamp(15px,2.2vw,17px)',
                        fontWeight: 800,
                        fontFamily: T.sans,
                        color: open ? T.white : T.h1,   /* escuro quando fechado */
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        letterSpacing: '-0.1px',
                        lineHeight: 1.3,
                      }}>{ex.title}</div>
                      {!open && (
                        <div style={{ fontSize: 12.5, color: T.muted, fontFamily: T.sans, marginTop: 3, fontWeight: 500 }}>
                          {[ex.sets && `${ex.sets} séries`, ex.reps && `${ex.reps} reps`, ex.frequency].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>

                    {/* Chevron */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke={open ? T.gold : T.meta} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {/* ── CORPO EXPANDIDO — tudo escuro sobre branco ── */}
                  {open && (
                    <div style={{ background: T.card, padding: 'clamp(18px,3vw,24px)', borderTop: `1px solid ${T.border}` }}>

                      {/* Pills de prescrição */}
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
                        {[
                          { label: 'Séries',     value: ex.sets      },
                          { label: 'Repetições', value: ex.reps      },
                          { label: 'Frequência', value: ex.frequency },
                        ].filter(item => item.value).map(item => (
                          <div key={item.label} style={{
                            background: T.metaBg, borderRadius: 10,
                            padding: '10px 20px', textAlign: 'center',
                            border: `1.5px solid ${T.border}`, minWidth: 84,
                          }}>
                            <div style={{ fontSize: 10, color: T.hint, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4, fontFamily: T.sans, fontWeight: 700 }}>{item.label}</div>
                            <div style={{ fontSize: 'clamp(17px,2.5vw,20px)', fontWeight: 900, color: T.navy, fontFamily: T.sans, letterSpacing: '-0.5px' }}>{item.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Como realizar */}
                      {ex.description && (
                        <div style={{ marginBottom: 16, padding: '14px 16px', background: '#f8fafc', borderRadius: 10, border: `1px solid #e2e8f0` }}>
                          <div style={{ fontSize: 10, color: T.hint, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 7, fontFamily: T.sans, fontWeight: 700 }}>Como realizar</div>
                          <p style={{ fontSize: 'clamp(14px,1.8vw,15.5px)', color: T.body, lineHeight: 1.9, margin: 0, fontFamily: T.sans, fontWeight: 450 }}>
                            {ex.description}
                          </p>
                        </div>
                      )}

                      {/* Atenção */}
                      {ex.observations && (
                        <div style={{ background: T.amberBg, borderRadius: 10, padding: '13px 16px', borderLeft: `4px solid ${T.amberBorder}`, marginBottom: 16 }}>
                          <div style={{ fontSize: 10, color: T.amberText, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, fontFamily: T.sans, fontWeight: 800 }}>Atenção</div>
                          <p style={{ fontSize: 'clamp(13.5px,1.7vw,15px)', color: T.amberText, lineHeight: 1.85, margin: 0, fontFamily: T.sans, fontWeight: 500 }}>{ex.observations}</p>
                        </div>
                      )}

                      {/* Vídeo */}
                      {ex.video_url && (
                        <a href={ex.video_url} target="_blank" rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.blueBg, color: T.blueText, padding: '11px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', fontFamily: T.sans, border: `1.5px solid ${T.blueBorder}` }}>
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

        {!loading && exercises.length > 0 && (
          <div style={{ marginTop: 22, padding: 'clamp(13px,2.5vw,17px)', background: T.card, borderRadius: 12, border: `1.5px solid ${T.border}`, textAlign: 'center' }}>
            <p style={{ fontSize: 13.5, color: T.muted, fontFamily: T.sans, margin: 0, lineHeight: 1.7 }}>
              Dúvidas sobre algum exercício?{' '}
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
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ height: 70, background: '#e2e8f0', borderRadius: 14, animation: `pulse 1.5s ${i*0.12}s ease-in-out infinite` }} />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px', background: '#fff', borderRadius: 16, border: '1.5px solid #d1d5db' }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: '#f1f5f9', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>
      </div>
      <div style={{ fontSize: 15, color: '#1f2937', fontFamily: 'system-ui,sans-serif', fontWeight: 700, marginBottom: 6 }}>Nenhum exercício prescrito ainda</div>
      <div style={{ fontSize: 13.5, color: '#6b7280', fontFamily: 'system-ui,sans-serif', lineHeight: 1.6 }}>O Dr. Pablo irá adicionar o seu protocolo em breve.</div>
    </div>
  )
}
