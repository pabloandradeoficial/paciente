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
  gray50: '#f9fafb', gray100: '#f3f4f6', gray200: '#e5e7eb',
  gray400: '#9ca3af', gray500: '#6b7280', gray600: '#4b5563', gray700: '#374151', gray800: '#1f2937',
  green: '#059669', greenLight: '#d1fae5', greenDark: '#065f46',
  amber: '#d97706', amberLight: '#fef3c7', amberDark: '#78350f',
  blue: '#2563eb', blueLight: '#dbeafe', blueDark: '#1e40af',
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

  const h = new Date().getHours()
  const greeting = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <ProtectedRoute requiredRole="patient">
      <Head><title>Minha Área — Dr. Pablo Andrade</title></Head>
      <PatientLayout>
        {loading ? <Skeleton /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* ══ 1. SAUDAÇÃO PREMIUM com foto do Dr. ══ */}
            <div style={{
              background: `linear-gradient(135deg, ${T.navyDeep} 0%, #1a2744 65%, #243358 100%)`,
              borderRadius: 20, overflow: 'hidden', position: 'relative',
            }}>
              {/* Gold accent top */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${T.gold}, rgba(201,168,76,0.15))` }} />
              {/* Decorative rings */}
              <div style={{ position: 'absolute', right: -60, bottom: -60, width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.08)' }} />
              <div style={{ position: 'absolute', right: -20, bottom: -20, width: 120, height: 120, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.06)' }} />

              <div style={{ padding: 'clamp(24px,4vw,32px)', position: 'relative', zIndex: 2 }}>
                {/* Top row: greeting + Dr. photo */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: T.gold, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8, fontFamily: T.sans }}>{greeting}</div>
                    <h1 style={{ color: T.white, fontSize: 'clamp(22px,5vw,30px)', fontWeight: 400, margin: 0, fontFamily: T.serif, lineHeight: 1.15 }}>
                      Olá, <em style={{ color: T.gold, fontStyle: 'italic' }}>{firstName}</em>
                    </h1>
                  </div>
                  {/* Dr. Pablo mini card */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${T.gold}`, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                      <img src="/pablo.jpg" alt="Dr. Pablo" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }} />
                    </div>
                    <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.4)', fontFamily: T.sans, textAlign: 'center', letterSpacing: '0.3px' }}>Dr. Pablo</div>
                  </div>
                </div>

                {/* Welcome message or default */}
                {activePlan?.welcome_message ? (
                  <div style={{ fontSize: 14, lineHeight: 1.85, color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 18px', borderLeft: `3px solid ${T.gold}`, fontFamily: T.sans }}>
                    {activePlan.welcome_message}
                  </div>
                ) : (
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: T.sans, margin: 0, lineHeight: 1.75 }}>
                    Seu plano está organizado aqui. Consulte seus exercícios e orientações sempre que precisar.
                  </p>
                )}
              </div>
            </div>

            {/* ══ 2. PLANO ATUAL ══ */}
            {activePlan && (
              <div style={{ background: T.white, borderRadius: 16, border: `1px solid ${T.gray200}`, overflow: 'hidden' }}>
                <div style={{ padding: 'clamp(16px,3vw,22px)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: T.gold, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 7, fontFamily: T.sans }}>Seu Plano Atual</div>
                    <div style={{ fontSize: 'clamp(16px,2.5vw,20px)', fontWeight: 700, color: T.navy, fontFamily: T.serif, marginBottom: activePlan.description ? 8 : 0 }}>{activePlan.title}</div>
                    {activePlan.description && (
                      <div style={{ fontSize: 14, color: T.gray600, lineHeight: 1.7, fontFamily: T.sans }}>{activePlan.description}</div>
                    )}
                  </div>
                  {activePlan.updated_at && (
                    <div style={{ background: T.gray50, borderRadius: 8, padding: '6px 12px', fontSize: 11, color: T.gray400, fontFamily: T.sans, whiteSpace: 'nowrap', flexShrink: 0, border: `1px solid ${T.gray100}` }}>
                      Atualizado {activePlan.updated_at?.slice(0, 10)}
                    </div>
                  )}
                </div>
                {/* Progress indicators */}
                <div style={{ display: 'flex', borderTop: `1px solid ${T.gray100}` }}>
                  {[
                    { n: exercises.length,  label: 'Exercícios',  color: T.navy,  href: '/paciente/exercicios' },
                    { n: guidelines.length, label: 'Orientações', color: T.green, href: '/paciente/orientacoes' },
                    { n: materials.length,  label: 'Materiais',   color: T.amber, href: '/paciente/materiais' },
                  ].map((item, i) => (
                    <button key={item.label} onClick={() => router.push(item.href)} style={{
                      flex: 1, padding: 'clamp(12px,2vw,16px) 8px', background: 'none', border: 'none',
                      borderRight: i < 2 ? `1px solid ${T.gray100}` : 'none',
                      cursor: 'pointer', textAlign: 'center', fontFamily: T.sans,
                    }}>
                      <div style={{ fontSize: 'clamp(20px,3.5vw,26px)', fontWeight: 700, color: item.color, lineHeight: 1 }}>{item.n}</div>
                      <div style={{ fontSize: 11, color: T.gray400, marginTop: 4 }}>{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ══ 3. SEU FOCO AGORA ══ */}
            {(exercises.length > 0 || guidelines.length > 0) && (
              <div style={{ background: `linear-gradient(135deg, ${T.navy} 0%, #243358 100%)`, borderRadius: 18, padding: 'clamp(18px,3vw,24px)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(201,168,76,0.08)' }} />
                <div style={{ fontSize: 10, color: T.gold, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 14, fontFamily: T.sans, position: 'relative', zIndex: 2 }}>Seu Foco Agora</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 2 }}>
                  {exercises.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.gold, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontFamily: T.sans, marginBottom: 2 }}>Principal exercício</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: T.white, fontFamily: T.sans }}>{exercises[0].title}</div>
                        {exercises[0].sets && exercises[0].reps && (
                          <div style={{ fontSize: 12, color: T.gold, marginTop: 2, fontFamily: T.sans }}>{exercises[0].sets} séries · {exercises[0].reps} reps · {exercises[0].frequency}</div>
                        )}
                      </div>
                    </div>
                  )}
                  {guidelines.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontFamily: T.sans, marginBottom: 2 }}>Orientação prioritária</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: T.white, fontFamily: T.sans }}>{guidelines[0].category}</div>
                        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', marginTop: 2, fontFamily: T.sans, lineHeight: 1.5 }}>
                          {guidelines[0].content.length > 80 ? guidelines[0].content.slice(0, 80) + '…' : guidelines[0].content}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 14, display: 'flex', gap: 10, position: 'relative', zIndex: 2 }}>
                  <button onClick={() => router.push('/paciente/exercicios')} style={{ background: T.gold, color: T.navy, border: 'none', padding: '9px 18px', borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: T.sans }}>
                    Ver Exercícios
                  </button>
                  <button onClick={() => router.push('/paciente/orientacoes')} style={{ background: 'rgba(255,255,255,0.1)', color: T.white, border: '1px solid rgba(255,255,255,0.2)', padding: '9px 18px', borderRadius: 8, fontSize: 12.5, cursor: 'pointer', fontFamily: T.sans }}>
                    Ver Orientações
                  </button>
                </div>
              </div>
            )}

            {/* ══ 4. MATERIAIS (se houver) ══ */}
            {materials.length > 0 && (
              <div style={{ background: T.white, borderRadius: 16, padding: 'clamp(16px,3vw,22px)', border: `1px solid ${T.gray200}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: T.gold, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: T.sans }}>Materiais de Apoio</div>
                  <button onClick={() => router.push('/paciente/materiais')} style={{ background: 'none', border: 'none', color: T.gray400, fontSize: 12, cursor: 'pointer', fontFamily: T.sans }}>Ver todos →</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {materials.slice(0, 2).map(m => (
                    <a key={m.id} href={m.external_url || m.file_url || '#'} target="_blank" rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: T.gray50, borderRadius: 10, textDecoration: 'none', border: `1px solid ${T.gray100}` }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: T.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: T.gold, fontSize: 9, fontWeight: 700, fontFamily: T.sans }}>{(m.type || 'ARQ').toUpperCase().slice(0, 3)}</span>
                      </div>
                      <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: T.navy, fontFamily: T.sans, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                      <span style={{ color: T.gray400, fontSize: 14 }}>→</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ══ 5. MENSAGEM DO FISIOTERAPEUTA ══ */}
            <div style={{ background: T.white, borderRadius: 16, padding: 'clamp(16px,3vw,22px)', border: `1px solid ${T.gray200}`, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${T.gold}`, flexShrink: 0 }}>
                <img src="/pablo.jpg" alt="Dr. Pablo" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10.5, color: T.gold, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6, fontFamily: T.sans }}>Mensagem do seu fisioterapeuta</div>
                <p style={{ fontSize: 14, color: T.gray700, lineHeight: 1.8, margin: '0 0 10px', fontFamily: T.serif, fontStyle: 'italic' }}>
                  "Mantenha constância no que foi proposto. Cada sessão e cada exercício realizado é um passo real na sua evolução."
                </p>
                <div style={{ fontSize: 12, color: T.gray400, fontFamily: T.sans }}>Dr. Pablo Andrade · Fisioterapeuta</div>
                <a href="tel:+5535998732804" style={{ display: 'inline-block', marginTop: 8, fontSize: 12, color: T.gold, textDecoration: 'none', fontFamily: T.sans, fontWeight: 600 }}>
                  Dúvidas? (35) 99873-2804
                </a>
              </div>
            </div>

          </div>
        )}
      </PatientLayout>
    </ProtectedRoute>
  )
}

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
      {[160, 100, 130, 80].map((h, i) => (
        <div key={i} style={{ height: h, background: '#ddd', borderRadius: 16, animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  )
}
