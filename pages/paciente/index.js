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
  white: '#ffffff',
  gray50: '#f9fafb', gray100: '#f3f4f6', gray200: '#e5e7eb',
  gray400: '#9ca3af', gray500: '#6b7280', gray600: '#4b5563', gray700: '#374151', gray800: '#1f2937',
  green: '#059669', greenLight: '#dcfce7', greenDark: '#14532d',
  amber: '#d97706', amberLight: '#fef3c7', amberDark: '#78350f',
  blue: '#2563eb',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ══ 1. SAUDAÇÃO ══ */}
            <div style={{ background: `linear-gradient(135deg, ${T.navyDeep} 0%, #1a2744 65%, #243358 100%)`, borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${T.gold}, rgba(201,168,76,0.1))` }} />
              <div style={{ position: 'absolute', right: -50, bottom: -50, width: 180, height: 180, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.07)' }} />
              <div style={{ padding: 'clamp(22px,4vw,30px)', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10.5, color: T.gold, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 7, fontFamily: T.sans }}>{greeting}</div>
                    <h1 style={{ color: T.white, fontSize: 'clamp(22px,5vw,28px)', fontWeight: 400, margin: 0, fontFamily: T.serif, lineHeight: 1.15 }}>
                      Olá, <em style={{ color: T.gold, fontStyle: 'italic' }}>{firstName}</em>
                    </h1>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                    <div style={{ width: 50, height: 50, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${T.gold}`, boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
                      <img src="/pablo.jpg" alt="Dr. Pablo" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }} />
                    </div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: T.sans }}>Dr. Pablo</div>
                  </div>
                </div>
                {activePlan?.welcome_message ? (
                  <div style={{ fontSize: 13.5, lineHeight: 1.85, color: 'rgba(255,255,255,0.82)', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 16px', borderLeft: `3px solid ${T.gold}`, fontFamily: T.sans }}>
                    {activePlan.welcome_message}
                  </div>
                ) : (
                  <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: 13.5, fontFamily: T.sans, margin: 0, lineHeight: 1.7 }}>
                    Seu plano está organizado aqui para facilitar sua rotina e evolução.
                  </p>
                )}
              </div>
            </div>

            {/* ══ 2. PLANO ATUAL — ESCANEÁVEL ══ */}
            {activePlan && (
              <div style={{ background: T.white, borderRadius: 16, border: `1px solid ${T.gray200}`, overflow: 'hidden' }}>
                {/* Header do plano */}
                <div style={{ padding: 'clamp(16px,3vw,20px)', borderBottom: `1px solid ${T.gray100}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: 10, color: T.gold, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 5, fontFamily: T.sans }}>Seu Plano Atual</div>
                      <div style={{ fontSize: 'clamp(15px,2.5vw,18px)', fontWeight: 700, color: T.navy, fontFamily: T.serif }}>{activePlan.title}</div>
                    </div>
                    {/* Status badge */}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: T.greenLight, color: T.greenDark, fontSize: 11, fontWeight: 700, fontFamily: T.sans, padding: '4px 12px', borderRadius: 20 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.green }} />
                      Ativo
                    </span>
                  </div>
                  {activePlan.description && (
                    <p style={{ fontSize: 13.5, color: T.gray600, lineHeight: 1.7, margin: '8px 0 0', fontFamily: T.sans }}>{activePlan.description}</p>
                  )}
                </div>

                {/* Mini stats row */}
                <div style={{ display: 'flex', borderBottom: `1px solid ${T.gray100}` }}>
                  {[
                    { n: exercises.length,  label: 'Exercícios',  color: T.navy,  href: '/paciente/exercicios' },
                    { n: guidelines.length, label: 'Orientações', color: T.green, href: '/paciente/orientacoes' },
                    { n: materials.length,  label: 'Materiais',   color: T.amber, href: '/paciente/materiais' },
                  ].map((item, i) => (
                    <button key={item.label} onClick={() => router.push(item.href)} style={{
                      flex: 1, padding: 'clamp(12px,2vw,15px) 8px',
                      background: 'none', border: 'none', borderRight: i < 2 ? `1px solid ${T.gray100}` : 'none',
                      cursor: 'pointer', textAlign: 'center', fontFamily: T.sans,
                    }}>
                      <div style={{ fontSize: 'clamp(20px,3.5vw,24px)', fontWeight: 800, color: item.color, lineHeight: 1 }}>{item.n}</div>
                      <div style={{ fontSize: 11, color: T.gray500, marginTop: 3 }}>{item.label}</div>
                    </button>
                  ))}
                </div>

                {/* Last update row */}
                {activePlan.updated_at && (
                  <div style={{ padding: '10px clamp(16px,3vw,20px)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.gray400} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                    <span style={{ fontSize: 11.5, color: T.gray400, fontFamily: T.sans }}>
                      Última atualização: <strong style={{ color: T.gray600 }}>{activePlan.updated_at?.slice(0, 10)}</strong>
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ══ 3. SEU FOCO AGORA — MAIS FORTE ══ */}
            {(exercises.length > 0 || guidelines.length > 0) && (
              <div style={{ background: T.navy, borderRadius: 18, overflow: 'hidden', position: 'relative' }}>
                {/* Gold top bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: T.gold }} />
                {/* Decorative */}
                <div style={{ position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(201,168,76,0.06)' }} />

                <div style={{ padding: 'clamp(18px,3.5vw,24px)', position: 'relative', zIndex: 2 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.navy} strokeWidth="2.5" strokeLinecap="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.white, fontFamily: T.sans }}>Seu Foco Agora</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontFamily: T.sans }}>O mais importante neste momento</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Principal exercício */}
                    {exercises.length > 0 && (
                      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', borderLeft: `3px solid ${T.gold}` }}>
                        <div style={{ fontSize: 10, color: T.gold, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 5, fontFamily: T.sans }}>Principal exercício</div>
                        <div style={{ fontSize: 'clamp(14px,2vw,16px)', fontWeight: 700, color: T.white, fontFamily: T.sans, marginBottom: exercises[0].sets ? 6 : 0 }}>{exercises[0].title}</div>
                        {(exercises[0].sets || exercises[0].reps || exercises[0].frequency) && (
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {[exercises[0].sets && `${exercises[0].sets} séries`, exercises[0].reps && `${exercises[0].reps} reps`, exercises[0].frequency].filter(Boolean).map(v => (
                              <span key={v} style={{ background: 'rgba(201,168,76,0.18)', color: T.gold, fontSize: 11, fontWeight: 600, fontFamily: T.sans, padding: '3px 10px', borderRadius: 6 }}>{v}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Principal orientação */}
                    {guidelines.length > 0 && (
                      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', borderLeft: '3px solid #34d399' }}>
                        <div style={{ fontSize: 10, color: '#34d399', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 5, fontFamily: T.sans }}>Orientação prioritária</div>
                        <div style={{ fontSize: 'clamp(13px,1.8vw,15px)', fontWeight: 600, color: T.white, fontFamily: T.sans, marginBottom: 4 }}>{guidelines[0].category}</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontFamily: T.sans, lineHeight: 1.6 }}>
                          {guidelines[0].content.length > 90 ? guidelines[0].content.slice(0, 90) + '…' : guidelines[0].content}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTAs */}
                  <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button onClick={() => router.push('/paciente/exercicios')} style={{ background: T.gold, color: T.navy, border: 'none', padding: '10px 20px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: T.sans }}>
                      Ver Exercícios
                    </button>
                    <button onClick={() => router.push('/paciente/orientacoes')} style={{ background: 'rgba(255,255,255,0.1)', color: T.white, border: '1px solid rgba(255,255,255,0.18)', padding: '10px 18px', borderRadius: 9, fontSize: 13, cursor: 'pointer', fontFamily: T.sans }}>
                      Ver Orientações
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ══ 4. MATERIAIS (preview) ══ */}
            {materials.length > 0 && (
              <div style={{ background: T.white, borderRadius: 16, padding: 'clamp(16px,3vw,20px)', border: `1px solid ${T.gray200}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: T.gold, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: T.sans }}>Materiais de Apoio</div>
                  <button onClick={() => router.push('/paciente/materiais')} style={{ background: 'none', border: 'none', color: T.blue, fontSize: 12.5, cursor: 'pointer', fontFamily: T.sans, fontWeight: 600 }}>
                    Ver todos →
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {materials.slice(0, 2).map(m => {
                    const typeColors = { pdf: '#ef4444', video: '#2563eb', image: '#059669', link: '#d97706' }
                    const tc = typeColors[m.type] || T.navy
                    return (
                      <a key={m.id} href={m.external_url || m.file_url || '#'} target="_blank" rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: T.gray50, borderRadius: 10, textDecoration: 'none', border: `1px solid ${T.gray100}` }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: tc, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: '#fff', fontSize: 9, fontWeight: 800, fontFamily: T.sans }}>{(m.type || 'ARQ').toUpperCase().slice(0, 3)}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: T.navy, fontFamily: T.sans, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                          <div style={{ fontSize: 11, color: tc, fontFamily: T.sans, marginTop: 2, fontWeight: 600 }}>{(m.type || 'arquivo').toUpperCase()}</div>
                        </div>
                        <span style={{ color: T.gray400, fontSize: 14 }}>→</span>
                      </a>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ══ 5. MENSAGEM DO FISIOTERAPEUTA ══ */}
            <div style={{ background: T.white, borderRadius: 16, padding: 'clamp(16px,3vw,20px)', border: `1px solid ${T.gray200}`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${T.gold}`, flexShrink: 0 }}>
                <img src="/pablo.jpg" alt="Dr. Pablo" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: T.gold, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6, fontFamily: T.sans }}>Mensagem do seu fisioterapeuta</div>
                <p style={{ fontSize: 14, color: T.gray700, lineHeight: 1.8, margin: '0 0 8px', fontFamily: T.serif, fontStyle: 'italic' }}>
                  "Mantenha constância no que foi proposto. Cada exercício realizado é um passo real na sua evolução."
                </p>
                <div style={{ fontSize: 11.5, color: T.gray400, fontFamily: T.sans }}>Dr. Pablo Andrade · Fisioterapeuta</div>
                <a href="tel:+5535998732804" style={{ display: 'inline-block', marginTop: 7, fontSize: 12, color: T.gold, textDecoration: 'none', fontFamily: T.sans, fontWeight: 700 }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
      {[150, 100, 130, 80].map((h, i) => (
        <div key={i} style={{ height: h, background: '#e5e7eb', borderRadius: 16, animation: `pulse 1.6s ${i*0.12}s ease-in-out infinite` }} />
      ))}
    </div>
  )
}
