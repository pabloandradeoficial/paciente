import { useEffect, useState } from 'react'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'

const T = {
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  serif: "'Georgia', serif",
  navy: '#1a2744', gold: '#c9a84c', white: '#ffffff',
  textPrimary: '#1a2744', textSecondary: '#374151', textMuted: '#6b7280',
  bgCard: '#ffffff', bg: '#f5f3ed', border: '#e5e7eb', bgMeta: '#f3f4f6',
}

const TYPE = {
  pdf:   { label: 'PDF',    abbr: 'PDF', badgeBg: '#fee2e2', badgeText: '#7f1d1d', iconBg: '#ef4444' },
  video: { label: 'Vídeo',  abbr: 'VID', badgeBg: '#dbeafe', badgeText: '#1e40af', iconBg: '#2563eb' },
  image: { label: 'Imagem', abbr: 'IMG', badgeBg: '#d1fae5', badgeText: '#064e3b', iconBg: '#059669' },
  link:  { label: 'Link',   abbr: 'URL', badgeBg: '#fef3c7', badgeText: '#78350f', iconBg: '#d97706' },
}

export default function PatientMateriais() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (!session?.id) return
    fetch(`/api/patients/${session.id}`)
      .then(r => r.json())
      .then(data => {
        const plan = data?.plans?.find(p => p.is_active) || data?.plans?.[0]
        setMaterials(plan?.materials || [])
        setLoading(false)
      })
  }, [])

  return (
    <ProtectedRoute requiredRole="patient">
      <Head><title>Materiais — Dr. Pablo Andrade</title></Head>
      <PatientLayout>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10.5, color: T.gold, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6, fontFamily: T.sans }}>Conteúdo de apoio</div>
          <h1 style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 700, color: T.textPrimary, margin: '0 0 8px', fontFamily: T.serif }}>
            Materiais Complementares
            {!loading && materials.length > 0 && (
              <span style={{ fontSize: 14, color: T.textMuted, fontFamily: T.sans, fontWeight: 400, marginLeft: 10 }}>({materials.length})</span>
            )}
          </h1>
          <p style={{ fontSize: 13.5, color: '#4b5563', fontFamily: T.sans, margin: 0, lineHeight: 1.65 }}>
            Conteúdos selecionados pelo Dr. Pablo para complementar e apoiar o seu tratamento.
          </p>
        </div>

        {loading ? <Skeleton /> : materials.length === 0 ? <EmptyState /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {materials.map(m => {
              const cfg = TYPE[m.type] || { label: 'Arquivo', abbr: 'ARQ', badgeBg: T.bgMeta, badgeText: T.textMuted, iconBg: T.navy }
              const url = m.external_url || m.file_url || '#'
              return (
                <a key={m.id} href={url} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 'clamp(14px,2.5vw,18px) clamp(16px,3vw,22px)', background: T.bgCard, borderRadius: 14, border: `1px solid ${T.border}`, textDecoration: 'none', transition: 'all 0.18s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.navy; e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,39,68,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none' }}>

                  {/* Icon */}
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: cfg.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#fff', fontSize: 10, fontWeight: 800, fontFamily: T.sans, letterSpacing: '0.5px' }}>{cfg.abbr}</span>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'clamp(13.5px,1.8vw,15px)', fontWeight: 700, color: T.textPrimary, fontFamily: T.sans, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                    <span style={{ display: 'inline-block', background: cfg.badgeBg, color: cfg.badgeText, fontSize: 10.5, fontWeight: 700, fontFamily: T.sans, padding: '2px 9px', borderRadius: 6, letterSpacing: '0.3px' }}>{cfg.label}</span>
                  </div>

                  {/* Arrow */}
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: T.bgMeta, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
                    </svg>
                  </div>
                </a>
              )
            })}
          </div>
        )}

        {!loading && materials.length > 0 && (
          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: T.textMuted, fontFamily: T.sans, lineHeight: 1.7 }}>
            Dúvidas sobre os materiais?{' '}
            <a href="tel:+5535998732804" style={{ color: T.gold, textDecoration: 'none', fontWeight: 700 }}>(35) 99873-2804</a>
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
      {[1, 2, 3].map(i => <div key={i} style={{ height: 72, background: '#e5e7eb', borderRadius: 12, animation: `pulse 1.5s ${i*0.1}s ease-in-out infinite` }} />)}
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
      <div style={{ fontSize: 15, color: '#374151', fontFamily: 'system-ui,sans-serif', fontWeight: 600, marginBottom: 6 }}>Nenhum material disponível ainda</div>
      <div style={{ fontSize: 13, color: '#6b7280', fontFamily: 'system-ui,sans-serif' }}>O Dr. Pablo irá adicionar em breve.</div>
    </div>
  )
}
