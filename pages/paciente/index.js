import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'

const T = {
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  serif: "'Georgia', serif",
  navy: '#1a2744', navyDeep: '#0e1628', gold: '#c9a84c',
  white: '#ffffff', cream: '#f5f3ed',
  gray100: '#f3f4f6', gray200: '#e5e7eb',
  gray400: '#9ca3af', gray500: '#6b7280', gray600: '#4b5563', gray700: '#374151',
  green: '#10b981', greenLight: '#d1fae5',
  amber: '#f59e0b', amberLight: '#fef3c7',
  blue: '#3b82f6', blueLight: '#dbeafe',
}

export default function PatientHome() {
  const router = useRouter()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (!session?.id) return
    fetch(`/api/patients/${session.id}`)
      .then(r => r.json())
      .then(data => { setPatient(data); setLoading(false) })
  }, [])

  const activePlan = patient?.plans?.find(p => p.is_active) || patient?.plans?.[0]
  const exercises  = activePlan?.exercises  || []
  const guidelines = activePlan?.guidelines || []
  const materials  = activePlan?.materials  || []
  const firstName  = patient?.full_name?.split(' ')[0] || ''

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <ProtectedRoute requiredRole="patient">
      <Head><title>Minha Área — Dr. Pablo Andrade</title></Head>
      <PatientLayout>
        {loading ? <LoadingState /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── A: SAUDAÇÃO PREMIUM ── */}
            <div style={{
              background: `linear-gradient(135deg, ${T.navyDeep} 0%, #1a2744 60%, #243358 100%)`,
              borderRadius: 20, padding: 'clamp(24px,4vw,36px)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Gold accent top */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${T.gold}, rgba(201,168,76,0.2))` }} />
              {/* Decorative circles */}
              <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.1)' }} />
              <div style={{ position: 'absolute', right: -10, top: -10, width: 100, height: 100, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.08)' }} />

              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 11, color: T.gold, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>{greeting}</div>
                <h1 style={{ color: T.white, fontSize: 'clamp(22px,5vw,30px)', fontWeight: 400, margin: '0 0 16px', fontFamily: T.serif, letterSpacing: '-0.3px' }}>
                  {firstName && <>Olá, <em style={{ color: T.gold, fontStyle: 'italic' }}>{firstName}</em></>}
                </h1>

                {activePlan?.welcome_message ? (
                  <div style={{ fontSize: 'clamp(13px,1.5vw,15px)', lineHeight: 1.85, color: 'rgba(255,255,255,0.82)', background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 18px', borderLeft: `3px solid ${T.gold}`, fontFamily: T.sans }}>
                    {activePlan.welcome_message}
                  </div>
                ) : (
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, fontFamily: T.sans, margin: 0, lineHeight: 1.7 }}>
                    Seu plano de acompanhamento está organizado aqui. Consulte seus exercícios e orientações sempre que precisar.
                  </p>
                )}
              </div>
            </div>

            {/* ── B: PLANO ATUAL ── */}
            {activePlan && (
              <div style={{ background: T.white, borderRadius: 16, padding: 'clamp(18px,3vw,24px)', border: `1px solid ${T.gray200}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: T.gold, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6, fontFamily: T.sans }}>Plano Atual</div>
                    <div style={{ fontSize: 'clamp(16px,2.5vw,19px)', fontWeight: 700, color: T.navy, marginBottom: 6, fontFamily: T.serif }}>{activePlan.title}</div>
                    {activePlan.description && (
                      <div style={{ fontSize: 13.5, color: T.gray500, lineHeight: 1.7, fontFamily: T.sans }}>{activePlan.description}</div>
                    )}
                  </div>
                  {activePlan.updated_at && (
                    <div style={{ background: T.gray100, borderRadius: 8, padding: '6px 12px', fontSize: 11, color: T.gray400, fontFamily: T.sans, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      Atualizado {activePlan.updated_at?.slice(0, 10)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── C: FOCO ATUAL ── quick access cards */}
            <div>
              <div style={{ fontSize: 11, color: T.gray400, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 14, fontFamily: T.sans }}>Acesso Rápido</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: 12 }}>
                {[
                  { label: 'Exercícios', value: exercises.length, color: T.navy, href: '/paciente/exercicios', icon: '↗', desc: 'prescritos' },
                  { label: 'Orientações', value: guidelines.length, color: T.green, href: '/paciente/orientacoes', icon: '↗', desc: 'do dia a dia' },
                  { label: 'Materiais', value: materials.length, color: T.amber, href: '/paciente/materiais', icon: '↗', desc: 'complementares' },
                ].map(card => (
                  <button key={card.label} onClick={() => router.push(card.href)} style={{
                    background: T.white, borderRadius: 14, padding: 'clamp(16px,2.5vw,20px)',
                    border: `1px solid ${T.gray200}`, cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s', fontFamily: T.sans,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = card.color; e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,39,68,0.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.gray200; e.currentTarget.style.boxShadow = 'none' }}>
                    <div style={{ fontSize: 'clamp(26px,4vw,32px)', fontWeight: 700, color: card.color, lineHeight: 1 }}>{card.value}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.navy, marginTop: 6 }}>{card.label}</div>
                    <div style={{ fontSize: 11, color: T.gray400, marginTop: 2 }}>{card.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── D: FOCO — first exercise preview ── */}
            {exercises.length > 0 && (
              <div style={{ background: T.white, borderRadius: 16, overflow: 'hidden', border: `1px solid ${T.gray200}` }}>
                <div style={{ background: `linear-gradient(135deg, ${T.navy}, #2a3f6e)`, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 10, color: T.gold, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 2, fontFamily: T.sans }}>Exercício em Destaque</div>
                    <div style={{ color: T.white, fontSize: 'clamp(14px,2vw,16px)', fontWeight: 700, fontFamily: T.sans }}>{exercises[0].title}</div>
                  </div>
                  <button onClick={() => router.push('/paciente/exercicios')} style={{ background: T.gold, color: T.navy, border: 'none', padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: T.sans, whiteSpace: 'nowrap' }}>
                    Ver todos
                  </button>
                </div>
                <div style={{ padding: 'clamp(16px,2.5vw,20px)' }}>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: exercises[0].description ? 14 : 0 }}>
                    {[['Séries', exercises[0].sets], ['Reps', exercises[0].reps], ['Freq.', exercises[0].frequency]].filter(([, v]) => v).map(([l, v]) => (
                      <div key={l} style={{ background: T.gray100, borderRadius: 8, padding: '8px 14px', textAlign: 'center' }}>
                        <div style={{ fontSize: 9, color: T.gray400, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2, fontFamily: T.sans }}>{l}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: T.navy, fontFamily: T.sans }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {exercises[0].description && (
                    <p style={{ fontSize: 13.5, color: T.gray600, lineHeight: 1.75, margin: 0, fontFamily: T.sans }}>{exercises[0].description}</p>
                  )}
                </div>
              </div>
            )}

            {/* ── E: ORIENTAÇÃO DESTAQUE — first guideline ── */}
            {guidelines.length > 0 && (
              <div style={{ background: T.white, borderRadius: 16, padding: 'clamp(16px,3vw,22px)', border: `1px solid ${T.gray200}`, borderLeft: `4px solid ${T.gold}` }}>
                <div style={{ fontSize: 10, color: T.gold, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8, fontFamily: T.sans }}>Orientação Importante</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: T.sans }}>{guidelines[0].category}</div>
                <p style={{ fontSize: 14, color: T.gray600, lineHeight: 1.8, margin: '0 0 14px', fontFamily: T.sans }}>{guidelines[0].content}</p>
                {guidelines.length > 1 && (
                  <button onClick={() => router.push('/paciente/orientacoes')} style={{ background: 'none', border: 'none', color: T.gold, fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: T.sans }}>
                    Ver todas as orientações ({guidelines.length}) →
                  </button>
                )}
              </div>
            )}

            {/* ── F: MATERIAIS ── preview ── */}
            {materials.length > 0 && (
              <div style={{ background: T.white, borderRadius: 16, padding: 'clamp(16px,3vw,22px)', border: `1px solid ${T.gray200}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: T.gold, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: T.sans }}>Materiais Disponíveis</div>
                  <button onClick={() => router.push('/paciente/materiais')} style={{ background: 'none', border: 'none', color: T.gray400, fontSize: 12, cursor: 'pointer', padding: 0, fontFamily: T.sans }}>
                    Ver todos →
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {materials.slice(0, 2).map(m => (
                    <a key={m.id} href={m.external_url || m.file_url || '#'} target="_blank" rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: T.gray100, borderRadius: 10, textDecoration: 'none' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: T.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: T.gold, fontSize: 9, fontWeight: 700, fontFamily: T.sans }}>{(m.type || 'ARQ').toUpperCase().slice(0, 3)}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: T.navy, fontFamily: T.sans, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                      </div>
                      <span style={{ color: T.gray400, fontSize: 16, flexShrink: 0 }}>→</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ── G: DOCTOR CARD ── */}
            <div style={{ background: T.white, borderRadius: 16, padding: 'clamp(16px,3vw,22px)', border: `1px solid ${T.gray200}`, display: 'flex', alignItems: 'center', gap: 16 }}>
              <img src="/pablo.jpg" alt="Dr. Pablo Andrade" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', border: `2px solid ${T.gold}`, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, fontFamily: T.sans }}>Dr. Pablo Andrade</div>
                <div style={{ fontSize: 12, color: T.gray400, fontFamily: T.sans, marginTop: 2 }}>Fisioterapia · Quiropraxia</div>
                <div style={{ fontSize: 12, color: T.gray500, fontFamily: T.sans, marginTop: 3 }}>Dúvidas? Ligue: (35) 99873-2804</div>
              </div>
              <a href="tel:+5535998732804" style={{ background: T.gold, color: T.navy, border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: T.sans, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Ligar
              </a>
            </div>

            {/* ── H: APOIO FINAL ── */}
            <div style={{ textAlign: 'center', padding: 'clamp(16px,3vw,24px)', background: 'rgba(201,168,76,0.08)', borderRadius: 14, border: '1px solid rgba(201,168,76,0.2)' }}>
              <p style={{ fontSize: 13.5, color: T.gray600, lineHeight: 1.8, margin: 0, fontFamily: T.sans, fontStyle: 'italic' }}>
                Mantenha a constância no que foi proposto. Cada dia de adesão ao plano é um passo concreto na sua recuperação.
              </p>
            </div>

          </div>
        )}
      </PatientLayout>
    </ProtectedRoute>
  )
}

function LoadingState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: '#e5e7eb', borderRadius: 16, height: i === 1 ? 140 : 80, animation: 'pulse 1.5s ease-in-out infinite' }} />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}
