import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'

const T = {
  sans: "'Montserrat', system-ui, sans-serif",
  serif: "'Montserrat', sans-serif",
  navy: '#111827', navyDeep: '#0d1117', green: '#22c55e',
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
  const [weeklyMessage, setWeeklyMessage] = useState(null)

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

  // Calcular semana de tratamento
  const weekNumber = (() => {
    if (!patient?.created_at) return null
    const start = new Date(patient.created_at)
    const now = new Date()
    const days = Math.floor((now - start) / (1000 * 60 * 60 * 24))
    return Math.max(1, Math.ceil((days + 1) / 7))
  })()

  return (
    <ProtectedRoute requiredRole="patient">
      <Head><title>Minha Área — Dr. Pablo Andrade</title></Head>
      <PatientLayout>
        {loading ? <Skeleton /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ══ 1. SAUDAÇÃO ══ */}
            <div style={{ background: `linear-gradient(135deg, ${T.navyDeep} 0%, #1a2744 65%, #243358 100%)`, borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${T.green}, rgba(34,197,94,0.1))` }} />
              <div style={{ position: 'absolute', right: -50, bottom: -50, width: 180, height: 180, borderRadius: '50%', border: '1px solid rgba(34,197,94,0.07)' }} />
              <div style={{ padding: 'clamp(22px,4vw,30px)', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 10.5, color: T.green, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: T.sans }}>{greeting}</div>
                      {weekNumber && (
                        <div style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 20, padding: '2px 10px', fontSize: 10, color: T.green, fontFamily: T.sans, letterSpacing: '0.5px' }}>
                          Semana {weekNumber} de tratamento
                        </div>
                      )}
                    </div>
                    <h1 style={{ color: T.white, fontSize: 'clamp(22px,5vw,28px)', fontWeight: 400, margin: '7px 0 0', fontFamily: T.serif, lineHeight: 1.15 }}>
                      Olá, <em style={{ color: T.green, fontStyle: 'italic' }}>{firstName}</em>
                    </h1>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                    <div style={{ width: 50, height: 50, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${T.green}`, boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
                      <img src="/pablo.jpg" alt="Dr. Pablo" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }} />
                    </div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: T.sans }}>Dr. Pablo</div>
                  </div>
                </div>
                {activePlan?.welcome_message ? (
                  <div style={{ fontSize: 13.5, lineHeight: 1.85, color: 'rgba(255,255,255,0.82)', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 16px', borderLeft: `3px solid ${T.green}`, fontFamily: T.sans }}>
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
                      <div style={{ fontSize: 10, color: T.green, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 5, fontFamily: T.sans }}>Seu Plano Atual</div>
                      <div style={{ fontSize: 'clamp(15px,2.5vw,18px)', fontWeight: 700, color: T.navy, fontFamily: T.serif }}>{activePlan.title}</div>
                    </div>
                    {/* Status badge */}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: T.greenLight, color: T.greenDark, fontSize: 11, fontWeight: 700, fontFamily: T.sans, padding: '4px 12px', borderRadius: 20 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.green }} />
                      Ativo
                    </span>
                  </div>
                  {activePlan.description && (
                    <p style={{
                      fontSize: 13.5, color: T.gray600, lineHeight: 1.7, margin: '8px 0 0', fontFamily: T.sans,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{activePlan.description}</p>
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
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: T.green }} />
                {/* Decorative */}
                <div style={{ position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(34,197,94,0.06)' }} />

                <div style={{ padding: 'clamp(18px,3.5vw,24px)', position: 'relative', zIndex: 2 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', borderLeft: `3px solid ${T.green}` }}>
                        <div style={{ fontSize: 10, color: T.green, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 5, fontFamily: T.sans }}>Principal exercício</div>
                        <div style={{ fontSize: 'clamp(14px,2vw,16px)', fontWeight: 700, color: T.white, fontFamily: T.sans, marginBottom: exercises[0].sets ? 6 : 0 }}>{exercises[0].title}</div>
                        {(exercises[0].sets || exercises[0].reps || exercises[0].frequency) && (
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {[exercises[0].sets && `${exercises[0].sets} séries`, exercises[0].reps && `${exercises[0].reps} reps`, exercises[0].frequency].filter(Boolean).map(v => (
                              <span key={v} style={{ background: 'rgba(34,197,94,0.18)', color: T.green, fontSize: 11, fontWeight: 600, fontFamily: T.sans, padding: '3px 10px', borderRadius: 6 }}>{v}</span>
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
                    <button onClick={() => router.push('/paciente/exercicios')} style={{ background: T.green, color: T.navy, border: 'none', padding: '10px 20px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: T.sans }}>
                      Ver Exercícios
                    </button>
                    <button onClick={() => router.push('/paciente/orientacoes')} style={{ background: 'rgba(255,255,255,0.1)', color: T.white, border: '1px solid rgba(255,255,255,0.18)', padding: '10px 18px', borderRadius: 9, fontSize: 13, cursor: 'pointer', fontFamily: T.sans }}>
                      Ver Orientações
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ══ 4. MENSAGEM DA SEMANA ══ */}
            {weeklyMessage && (
              <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${T.gray200}` }}>
                {/* Topo dourado */}
                <div style={{ background: `linear-gradient(135deg, ${T.navy}, #243358)`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.white, fontFamily: T.sans }}>
                      {weeklyMessage.title || 'Mensagem desta semana'}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: T.sans, marginTop: 1 }}>
                      Dr. Pablo Andrade · {new Date(weeklyMessage.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', flexShrink: 0 }} title="Ativo esta semana" />
                </div>
                {/* Corpo */}
                <div style={{ background: T.white, padding: 'clamp(16px,3vw,22px)' }}>
                  <p style={{ fontSize: 'clamp(14px,1.8vw,15px)', color: T.gray700, lineHeight: 1.9, margin: 0, fontFamily: T.sans }}>
                    {weeklyMessage.message}
                  </p>
                </div>
              </div>
            )}

            {/* ══ 5. MATERIAIS (preview) ══ */}
            {materials.length > 0 && (
              <div style={{ background: T.white, borderRadius: 16, padding: 'clamp(16px,3vw,20px)', border: `1px solid ${T.gray200}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: T.green, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: T.sans }}>Materiais de Apoio</div>
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

            {/* ══ 6. MENSAGEM DO FISIOTERAPEUTA ══ */}
            <div style={{ background: T.white, borderRadius: 16, padding: 'clamp(16px,3vw,20px)', border: `1px solid ${T.gray200}`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${T.green}`, flexShrink: 0 }}>
                <img src="/pablo.jpg" alt="Dr. Pablo" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: T.green, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6, fontFamily: T.sans }}>Mensagem do seu fisioterapeuta</div>
                <p style={{ fontSize: 14, color: T.gray700, lineHeight: 1.8, margin: '0 0 8px', fontFamily: T.serif, fontStyle: 'italic' }}>
                  "Mantenha constância no que foi proposto. Cada exercício realizado é um passo real na sua evolução."
                </p>
                <div style={{ fontSize: 11.5, color: T.gray400, fontFamily: T.sans }}>Dr. Pablo Andrade · Fisioterapeuta</div>
                <a href="tel:+5535998732804" style={{ display: 'inline-block', marginTop: 7, fontSize: 12, color: T.green, textDecoration: 'none', fontFamily: T.sans, fontWeight: 700 }}>
                  Dúvidas? (35) 99873-2804
                </a>
              </div>
            </div>

            {/* ══ 7. AVISO DE SEGURANÇA ══ */}
            <div style={{ borderRadius: 14, padding: 'clamp(14px,2.5vw,18px)', background: '#fff7ed', border: '1px solid #fed7aa', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#9a3412', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 5, fontFamily: T.sans }}>Atenção — Sinal de parada</div>
                <p style={{ fontSize: 13.5, color: '#7c2d12', lineHeight: 1.75, margin: 0, fontFamily: T.sans }}>
                  Se sentir dor forte, formigamento, tontura ou qualquer sintoma incomum durante os exercícios, <strong>pare imediatamente</strong> e entre em contato com o Dr. Pablo.
                </p>
                <a href="https://wa.me/5535998732804?text=Dr.%20Pablo%2C%20preciso%20de%20orienta%C3%A7%C3%A3o%20urgente%20sobre%20meu%20tratamento."
                  target="_blank" rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 12.5, color: '#9a3412', textDecoration: 'none', fontFamily: T.sans, fontWeight: 700, background: '#fed7aa', padding: '6px 14px', borderRadius: 8 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#9a3412"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Avisar Dr. Pablo agora
                </a>
              </div>
            </div>

            {/* ══ 8. INDICAÇÃO ══ */}
            <div style={{ borderRadius: 14, padding: 'clamp(14px,2.5vw,18px)', background: T.white, border: `1px solid ${T.gray200}`, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, fontFamily: T.sans, marginBottom: 4 }}>
                  Conhece alguém que precisa de acompanhamento?
                </div>
                <div style={{ fontSize: 12.5, color: T.gray500, fontFamily: T.sans, lineHeight: 1.6 }}>
                  Compartilhe o site do Dr. Pablo com quem você acha que pode se beneficiar.
                </div>
              </div>
              <a href="https://wa.me/?text=Estou%20fazendo%20fisioterapia%20com%20o%20Dr.%20Pablo%20Andrade%20em%20Tr%C3%AAs%20Pontas%20e%20recomendo%20muito!%20Ele%20tem%20um%20portal%20exclusivo%20para%20cada%20paciente.%20Confira%3A%20https%3A%2F%2Fpablopaciente.com.br"
                target="_blank" rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#25d366', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', fontFamily: T.sans, flexShrink: 0, boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Indicar pelo WhatsApp
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
        <div key={i} style={{ height: h, background: '#e5e7eb', borderRadius: 16, animation: `pulse 1.6s ${i*0.12}s ease-in-out infinite` }} />
      ))}
    </div>
  )
}
