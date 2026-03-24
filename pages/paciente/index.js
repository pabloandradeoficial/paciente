import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
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
}

export default function PatientHome() {
  const router = useRouter()
  const [patient, setPatient]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [weeklyMessage, setWeeklyMessage] = useState(null)
  const [descExpanded, setDescExpanded]   = useState(false)
  const [todayChecks, setTodayChecks]     = useState(0)

  useEffect(() => {
    const session = getSession()
    if (!session?.id) return
    fetch(`/api/patients/${session.id}`)
      .then(r => r.json())
      .then(data => { setPatient(data); setLoading(false) })
    fetch('/api/weekly-message')
      .then(r => r.json())
      .then(data => { if (data?.message) setWeeklyMessage(data) })
  }, [])

  const activePlan = patient?.plans?.find(p => p.is_active) || patient?.plans?.[0]
  const exercises  = activePlan?.exercises  || []
  const guidelines = activePlan?.guidelines || []
  const materials  = activePlan?.materials  || []
  const firstName  = patient?.full_name?.split(' ')[0] || ''
  const h = new Date().getHours()
  const greeting = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'

  const weekNumber = (() => {
    if (!patient?.created_at) return null
    const start = new Date(patient.created_at)
    const now   = new Date()
    const days  = Math.floor((now - start) / (1000 * 60 * 60 * 24))
    return Math.max(1, Math.ceil((days + 1) / 7))
  })()

  useEffect(() => {
    if (exercises.length === 0) return
    try {
      const today = new Date().toISOString().slice(0, 10)
      const count = exercises.filter(e =>
        localStorage.getItem(`check_exercicio_${e.id}_${today}`) === '1'
      ).length
      setTodayChecks(count)
    } catch {}
  }, [exercises.length])

  return (
    <ProtectedRoute requiredRole="patient">
      <Head><title>Minha Área — Dr. Pablo Andrade</title></Head>
      <PatientLayout>
        {loading ? <Skeleton /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ══ 1. SAUDAÇÃO ══ */}
            <div style={{
              background: '#111827', borderRadius: 20,
              overflow: 'hidden', position: 'relative',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#22c55e' }} />
              <div style={{ padding: 'clamp(22px,4vw,30px)', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 10.5, color: '#22c55e', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: T.sans, fontWeight: 600 }}>
                        {greeting}
                      </div>
                      {weekNumber && (
                        <div style={{
                          background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
                          borderRadius: 20, padding: '2px 10px', fontSize: 10,
                          color: '#22c55e', fontFamily: T.sans,
                        }}>
                          Semana {weekNumber}
                        </div>
                      )}
                    </div>
                    <h1 style={{
                      color: '#ffffff', fontSize: 'clamp(24px,5vw,32px)',
                      fontWeight: 700, margin: '7px 0 0',
                      fontFamily: T.sans, lineHeight: 1.15,
                    }}>
                      Olá, <span style={{ color: '#22c55e' }}>{firstName}</span>
                    </h1>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', border: '2px solid #22c55e' }}>
                      <img src="/pablo.jpg" alt="Dr. Pablo" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }} />
                    </div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: T.sans }}>Dr. Pablo</div>
                  </div>
                </div>
                {activePlan?.welcome_message ? (
                  <div style={{
                    fontSize: 13.5, lineHeight: 1.85,
                    color: 'rgba(255,255,255,0.8)',
                    borderLeft: '3px solid #22c55e', paddingLeft: 14,
                    fontFamily: T.sans,
                  }}>
                    {activePlan.welcome_message}
                  </div>
                ) : (
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13.5, fontFamily: T.sans, margin: 0, lineHeight: 1.7 }}>
                    Seu plano está organizado aqui para facilitar sua rotina e evolução.
                  </p>
                )}
              </div>
            </div>

            {/* ══ 2. PLANO ATUAL ══ */}
            {activePlan && (
              <div style={{
                background: '#ffffff', borderRadius: 16,
                border: '1px solid #e5e7eb', overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}>
                <div style={{ padding: 'clamp(16px,3vw,20px)', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#22c55e', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 5, fontFamily: T.sans, fontWeight: 600 }}>
                        Seu Plano Atual
                      </div>
                      <div style={{ fontSize: 'clamp(15px,2.5vw,18px)', fontWeight: 700, color: '#111827', fontFamily: T.sans }}>
                        {activePlan.title}
                      </div>
                    </div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: '#f0fdf4', color: '#15803d',
                      fontSize: 11, fontWeight: 700, fontFamily: T.sans,
                      padding: '4px 12px', borderRadius: 20,
                      border: '1px solid #bbf7d0',
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
                      Ativo
                    </span>
                  </div>
                  {activePlan.description && (
                    <div>
                      <p style={{
                        fontSize: 13.5, color: '#6b7280', lineHeight: 1.7,
                        margin: '8px 0 4px', fontFamily: T.sans,
                        display: descExpanded ? 'block' : '-webkit-box',
                        WebkitLineClamp: descExpanded ? 'unset' : 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: descExpanded ? 'visible' : 'hidden',
                      }}>
                        {activePlan.description}
                      </p>
                      {activePlan.description.length > 80 && (
                        <button onClick={() => setDescExpanded(e => !e)} style={{
                          background: 'none', border: 'none', color: '#22c55e',
                          fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                          padding: '2px 0', fontFamily: T.sans,
                        }}>
                          {descExpanded ? 'Ver menos ↑' : 'Ver mais ↓'}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Contadores */}
                <div style={{ display: 'flex' }}>
                  {[
                    { n: exercises.length,  label: 'Exercícios',  href: '/paciente/exercicios'  },
                    { n: guidelines.length, label: 'Orientações', href: '/paciente/orientacoes' },
                    { n: materials.length,  label: 'Materiais',   href: '/paciente/materiais'   },
                  ].map((item, i) => (
                    <button key={item.label} onClick={() => router.push(item.href)} style={{
                      flex: 1, padding: 'clamp(12px,2vw,15px) 8px',
                      background: 'none', border: 'none',
                      borderRight: i < 2 ? '1px solid #f3f4f6' : 'none',
                      cursor: 'pointer', textAlign: 'center', fontFamily: T.sans,
                    }}>
                      <div style={{ fontSize: 'clamp(20px,3.5vw,24px)', fontWeight: 700, color: '#111827', lineHeight: 1 }}>{item.n}</div>
                      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>{item.label}</div>
                    </button>
                  ))}
                </div>

                {/* Progresso hoje */}
                {exercises.length > 0 && (
                  <div style={{ padding: '10px clamp(16px,3vw,20px)', borderTop: '1px solid #f3f4f6' }}>
                    {todayChecks === exercises.length ? (
                      <span style={{ fontSize: 12.5, color: '#15803d', fontFamily: T.sans, fontWeight: 700 }}>
                        Todos os exercícios feitos hoje!
                      </span>
                    ) : (
                      <span style={{ fontSize: 12.5, color: '#6b7280', fontFamily: T.sans }}>
                        <strong style={{ color: todayChecks > 0 ? '#22c55e' : '#374151' }}>{todayChecks}</strong>
                        {' '}de{' '}
                        <strong style={{ color: '#374151' }}>{exercises.length}</strong> exercícios feitos hoje
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ══ 3. FOCO AGORA ══ */}
            {(exercises.length > 0 || guidelines.length > 0) && (
              <div style={{ background: '#111827', borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#22c55e' }} />
                <div style={{ padding: 'clamp(18px,3.5vw,24px)', position: 'relative', zIndex: 2 }}>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                    <div style={{ fontSize: 10.5, color: '#22c55e', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: T.sans, fontWeight: 600 }}>
                      Seu Foco Agora
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {exercises.length > 0 && (
                      <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px', borderLeft: '3px solid #22c55e' }}>
                        <div style={{ fontSize: 10, color: '#22c55e', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 5, fontFamily: T.sans, fontWeight: 600 }}>
                          Principal exercício
                        </div>
                        <div style={{ fontSize: 'clamp(14px,2vw,16px)', fontWeight: 700, color: '#ffffff', fontFamily: T.sans, marginBottom: exercises[0].sets ? 6 : 0 }}>
                          {exercises[0].title}
                        </div>
                        {(exercises[0].sets || exercises[0].reps || exercises[0].frequency) && (
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {[
                              exercises[0].sets      && `${exercises[0].sets} séries`,
                              exercises[0].reps      && `${exercises[0].reps} reps`,
                              exercises[0].frequency,
                            ].filter(Boolean).map(v => (
                              <span key={v} style={{
                                background: 'rgba(34,197,94,0.18)', color: '#22c55e',
                                fontSize: 11, fontWeight: 600, fontFamily: T.sans,
                                padding: '3px 10px', borderRadius: 6,
                              }}>{v}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {guidelines.length > 0 && (
                      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '14px 16px', borderLeft: '3px solid rgba(34,197,94,0.45)' }}>
                        <div style={{ fontSize: 10, color: 'rgba(34,197,94,0.75)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 5, fontFamily: T.sans, fontWeight: 600 }}>
                          Orientação prioritária
                        </div>
                        <div style={{ fontSize: 'clamp(13px,1.8vw,15px)', fontWeight: 600, color: '#ffffff', fontFamily: T.sans, marginBottom: 4 }}>
                          {guidelines[0].category}
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.58)', fontFamily: T.sans, lineHeight: 1.6 }}>
                          {guidelines[0].content.length > 90
                            ? guidelines[0].content.slice(0, 90) + '…'
                            : guidelines[0].content}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button onClick={() => router.push('/paciente/exercicios')} style={{
                      background: '#22c55e', color: '#111827', border: 'none',
                      padding: '10px 20px', borderRadius: 9, fontSize: 13,
                      fontWeight: 700, cursor: 'pointer', fontFamily: T.sans, minHeight: 44,
                    }}>
                      Ver Exercícios
                    </button>
                    <button onClick={() => router.push('/paciente/orientacoes')} style={{
                      background: 'rgba(255,255,255,0.08)', color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.15)',
                      padding: '10px 18px', borderRadius: 9, fontSize: 13,
                      cursor: 'pointer', fontFamily: T.sans, minHeight: 44,
                    }}>
                      Ver Orientações
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ══ 4. MENSAGEM DA SEMANA ══ */}
            {weeklyMessage && (
              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ background: '#111827', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', fontFamily: T.sans }}>
                      {weeklyMessage.title || 'Mensagem desta semana'}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: T.sans, marginTop: 1 }}>
                      Dr. Pablo Andrade · {new Date(weeklyMessage.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                <div style={{ background: '#ffffff', padding: 'clamp(16px,3vw,22px)' }}>
                  <p style={{ fontSize: 'clamp(14px,1.8vw,15px)', color: '#374151', lineHeight: 1.9, margin: 0, fontFamily: T.sans }}>
                    {weeklyMessage.message}
                  </p>
                </div>
              </div>
            )}

            {/* ══ 5. CARD DR. PABLO ══ */}
            <div style={{
              background: '#ffffff', borderRadius: 16,
              padding: 'clamp(16px,3vw,20px)', border: '1px solid #e5e7eb',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: '2px solid #22c55e', flexShrink: 0 }}>
                <img src="/pablo.jpg" alt="Dr. Pablo" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: '#22c55e', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 4, fontFamily: T.sans, fontWeight: 600 }}>
                  Dr. Pablo Andrade
                </div>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, margin: '0 0 12px', fontFamily: T.sans, fontStyle: 'italic' }}>
                  "Mantenha constância no que foi proposto. Cada exercício realizado é um passo real na sua evolução."
                </p>
                <a href="tel:+5535998732804" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#22c55e', color: '#111827',
                  padding: '10px 18px', borderRadius: 9,
                  fontSize: 13, fontWeight: 700, textDecoration: 'none',
                  fontFamily: T.sans, minHeight: 44,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.68 19.79 19.79 0 01.06 1.1 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
                  </svg>
                  Ligar agora
                </a>
              </div>
            </div>

            {/* INDICAÇÃO — discreta */}
            <div style={{ textAlign: 'center', padding: '6px 0 2px' }}>
              <a
                href="https://wa.me/?text=Estou%20fazendo%20fisioterapia%20com%20o%20Dr.%20Pablo%20Andrade%20em%20Tr%C3%AAs%20Pontas%20e%20recomendo%20muito!%20Ele%20tem%20um%20portal%20exclusivo%20para%20cada%20paciente.%20Confira%3A%20https%3A%2F%2Fpablopaciente.com.br"
                target="_blank" rel="noreferrer"
                style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none', fontFamily: T.sans }}
              >
                Conhece alguém que precisa de fisioterapia? Indicar Dr. Pablo →
              </a>
            </div>

          </div>
        )}
      </PatientLayout>
    </ProtectedRoute>
  )
}

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
      {[150, 100, 130, 80].map((h, i) => (
        <div key={i} style={{ height: h, background: '#e5e7eb', borderRadius: 16, animation: `pulse 1.6s ${i * 0.12}s ease-in-out infinite` }} />
      ))}
    </div>
  )
}
