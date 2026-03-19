import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../components/admin/AdminLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'

const T = {
  sans: "'Montserrat', system-ui, sans-serif",
  navy: '#1a2744', navyDeep: '#0e1628', navyMid: '#243358',
  gold: '#c9a84c', goldLight: 'rgba(201,168,76,0.1)', goldBorder: 'rgba(201,168,76,0.25)',
  white: '#ffffff',
  gray50: '#f9fafb', gray100: '#f3f4f6', gray200: '#e5e7eb',
  gray400: '#9ca3af', gray500: '#6b7280', gray600: '#4b5563', gray700: '#374151', gray800: '#1f2937',
  green: '#059669', greenLight: '#dcfce7', greenDark: '#14532d',
  red: '#ef4444', redLight: '#fee2e2',
  amber: '#d97706', amberLight: '#fef3c7',
}

export default function AdminDashboard() {
  const router = useRouter()
  const [patients, setPatients]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [weeklyMsg, setWeeklyMsg]       = useState(null)
  const [msgTitle, setMsgTitle]         = useState('')
  const [msgText, setMsgText]           = useState('')
  const [savingMsg, setSavingMsg]       = useState(false)
  const [msgSaved, setMsgSaved]         = useState(false)
  const [editingMsg, setEditingMsg]     = useState(false)

  useEffect(() => {
    fetch('/api/patients').then(r => r.json()).then(data => { setPatients(data); setLoading(false) })
    fetch('/api/weekly-message').then(r => r.json()).then(data => {
      if (data) {
        setWeeklyMsg(data)
        setMsgTitle(data.title || '')
        setMsgText(data.message || '')
      } else {
        setEditingMsg(true) // sem mensagem ainda, abrir editor
      }
    })
  }, [])

  const active   = patients.filter(p => p.is_active).length
  const inactive = patients.filter(p => !p.is_active).length
  const recent   = [...patients].sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 5)

  async function saveMessage() {
    if (!msgText.trim()) return
    setSavingMsg(true)
    const res = await fetch('/api/weekly-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: msgTitle || 'Mensagem desta semana', message: msgText }),
    })
    const data = await res.json()
    setWeeklyMsg(data)
    setSavingMsg(false)
    setMsgSaved(true)
    setEditingMsg(false)
    setTimeout(() => setMsgSaved(false), 3000)
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <Head><title>Dashboard — Admin</title></Head>
      <AdminLayout title="Dashboard" subtitle="Visão geral do sistema">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── Stats row ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {[
              { label: 'Total', value: patients.length, color: T.navy,  bg: T.gray50,       icon: '👥' },
              { label: 'Ativos',    value: active,          color: T.green, bg: T.greenLight,  icon: '✓'  },
              { label: 'Inativos',  value: inactive,        color: T.gray500, bg: T.gray100,   icon: '○'  },
            ].map(card => (
              <div key={card.label} style={{ background: T.white, borderRadius: 14, padding: '20px 22px', border: `1px solid ${T.gray200}`, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {card.icon}
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: card.color, lineHeight: 1, fontFamily: T.sans }}>{loading ? '—' : card.value}</div>
                  <div style={{ fontSize: 12, color: T.gray400, marginTop: 3, fontFamily: T.sans }}>{card.label}</div>
                </div>
              </div>
            ))}
            {/* Quick action card */}
            <button onClick={() => router.push('/admin/pacientes/novo')} style={{ background: `linear-gradient(135deg, ${T.navy}, ${T.navyMid})`, borderRadius: 14, padding: '20px 22px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 4px 16px rgba(26,39,68,0.2)', textAlign: 'left' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: T.navy, fontSize: 22, fontWeight: 700, lineHeight: 1 }}>+</span>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.white, fontFamily: T.sans }}>Novo Paciente</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2, fontFamily: T.sans }}>Cadastrar agora</div>
              </div>
            </button>
          </div>

          {/* ── Main grid: patients + weekly message ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 20, alignItems: 'start' }}>

            {/* Recent patients */}
            <div style={{ background: T.white, borderRadius: 16, border: `1px solid ${T.gray200}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '18px 22px', borderBottom: `1px solid ${T.gray100}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.navy, fontFamily: T.sans }}>Pacientes Recentes</div>
                  <div style={{ fontSize: 11, color: T.gray400, marginTop: 2, fontFamily: T.sans }}>Ordenados por última atualização</div>
                </div>
                <button onClick={() => router.push('/admin/pacientes')} style={{ background: T.goldLight, border: `1px solid ${T.goldBorder}`, color: T.gold, fontSize: 12, cursor: 'pointer', padding: '5px 12px', borderRadius: 8, fontWeight: 600, fontFamily: T.sans }}>
                  Ver todos
                </button>
              </div>
              {loading ? (
                <div style={{ padding: 40, textAlign: 'center', color: T.gray400, fontFamily: T.sans }}>Carregando...</div>
              ) : recent.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: T.gray400, fontFamily: T.sans }}>Nenhum paciente ainda.</div>
              ) : recent.map((p, i) => (
                <div key={p.id} onClick={() => router.push(`/admin/pacientes/${p.id}`)}
                  style={{ padding: '13px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: i < recent.length - 1 ? `1px solid ${T.gray50}` : 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = T.gray50}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.gold, fontWeight: 800, fontSize: 12, flexShrink: 0, fontFamily: T.sans }}>
                      {p.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: T.gray800, fontFamily: T.sans }}>{p.full_name}</div>
                      <div style={{ fontSize: 11.5, color: T.gray400, marginTop: 1, fontFamily: T.sans }}>@{p.username}</div>
                    </div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: p.is_active ? T.greenLight : T.gray100, color: p.is_active ? T.greenDark : T.gray500, fontFamily: T.sans }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.is_active ? T.green : T.gray400 }} />
                    {p.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              ))}
            </div>

            {/* ── MENSAGEM SEMANAL ── */}
            <div style={{ background: T.white, borderRadius: 16, border: `1px solid ${T.gray200}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${T.navy}, ${T.navyMid})`, padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.white, fontFamily: T.sans }}>Mensagem da Semana</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2, fontFamily: T.sans }}>Aparece para todos os pacientes no portal</div>
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div style={{ padding: '20px 22px' }}>
                {/* Preview da mensagem atual */}
                {weeklyMsg && !editingMsg && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 10, color: T.gold, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8, fontFamily: T.sans }}>Mensagem atual</div>
                    <div style={{ background: T.goldLight, border: `1px solid ${T.goldBorder}`, borderLeft: `3px solid ${T.gold}`, borderRadius: 10, padding: '14px 16px', marginBottom: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 6, fontFamily: T.sans }}>{weeklyMsg.title}</div>
                      <div style={{ fontSize: 13.5, color: T.gray700, lineHeight: 1.75, fontFamily: T.sans }}>{weeklyMsg.message}</div>
                    </div>
                    <div style={{ fontSize: 11, color: T.gray400, fontFamily: T.sans }}>
                      Publicada em {new Date(weeklyMsg.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                )}

                {/* Editor */}
                {editingMsg ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.gray500, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 7, fontFamily: T.sans }}>Título (opcional)</label>
                      <input value={msgTitle} onChange={e => setMsgTitle(e.target.value)}
                        placeholder="Ex: Foco desta semana"
                        style={{ width: '100%', padding: '10px 14px', border: `1px solid ${T.gray200}`, borderRadius: 9, fontSize: 14, outline: 'none', color: T.gray800, fontFamily: T.sans, background: T.gray50 }}
                        onFocus={e => e.target.style.borderColor = T.gold}
                        onBlur={e => e.target.style.borderColor = T.gray200}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.gray500, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 7, fontFamily: T.sans }}>Mensagem *</label>
                      <textarea value={msgText} onChange={e => setMsgText(e.target.value)}
                        placeholder="Ex: Esta semana o foco é consistência. Realize os exercícios no horário planejado e respeite os intervalos de recuperação."
                        rows={5}
                        style={{ width: '100%', padding: '12px 14px', border: `1px solid ${T.gray200}`, borderRadius: 9, fontSize: 14, outline: 'none', resize: 'vertical', lineHeight: 1.65, color: T.gray800, fontFamily: T.sans, background: T.gray50, boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = T.gold}
                        onBlur={e => e.target.style.borderColor = T.gray200}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={saveMessage} disabled={savingMsg || !msgText.trim()} style={{
                        flex: 1, padding: '11px 0', background: msgText.trim() ? T.gold : T.gray200, color: msgText.trim() ? T.navy : T.gray400,
                        border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: msgText.trim() ? 'pointer' : 'not-allowed', fontFamily: T.sans,
                        boxShadow: msgText.trim() ? '0 4px 16px rgba(201,168,76,0.3)' : 'none',
                      }}>
                        {savingMsg ? 'Publicando...' : 'Publicar para todos'}
                      </button>
                      {weeklyMsg && (
                        <button onClick={() => { setEditingMsg(false); setMsgTitle(weeklyMsg.title); setMsgText(weeklyMsg.message) }}
                          style={{ padding: '11px 16px', background: T.gray100, color: T.gray600, border: 'none', borderRadius: 9, fontSize: 13, cursor: 'pointer', fontFamily: T.sans }}>
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setEditingMsg(true)} style={{ width: '100%', padding: '11px 0', background: T.navy, color: T.white, border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>
                    {weeklyMsg ? 'Atualizar mensagem' : 'Escrever primeira mensagem'}
                  </button>
                )}

                {/* Sucesso */}
                {msgSaved && (
                  <div style={{ marginTop: 12, padding: '10px 14px', background: T.greenLight, borderRadius: 9, fontSize: 13, color: T.greenDark, fontWeight: 600, fontFamily: T.sans, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>✓</span> Mensagem publicada para todos os pacientes!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Quick actions row ── */}
          <div style={{ background: T.white, borderRadius: 16, border: `1px solid ${T.gray200}`, padding: '18px 22px', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, fontFamily: T.sans }}>Ações rápidas</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: '+ Novo Paciente',     href: '/admin/pacientes/novo', primary: true  },
                { label: 'Ver Todos Pacientes', href: '/admin/pacientes',      primary: false },
              ].map(a => (
                <button key={a.label} onClick={() => router.push(a.href)} style={{ padding: '9px 20px', background: a.primary ? T.navy : T.gray50, color: a.primary ? T.white : T.gray700, border: `1px solid ${a.primary ? T.navy : T.gray200}`, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
