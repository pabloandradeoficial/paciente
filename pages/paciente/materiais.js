import { useEffect, useState } from 'react'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'

const T = {
  sans:  "'Montserrat', system-ui, sans-serif",
  serif: "'Georgia', serif",
  navy:  '#1a2744', gold: '#c9a84c', white: '#ffffff',
  h1:    '#111827', body: '#1f2937', meta: '#374151',
  muted: '#4b5563', hint: '#6b7280',
  card:  '#ffffff', border: '#d1d5db', bg: '#f5f3ed',
}

const TYPE_CFG = {
  pdf:   { label: 'PDF',    icon: PdfIcon,   iconBg: '#ef4444', badgeBg: '#fee2e2',   badgeText: '#7f1d1d' },
  video: { label: 'Vídeo',  icon: VideoIcon,  iconBg: '#2563eb', badgeBg: '#dbeafe',   badgeText: '#1e3a8a' },
  image: { label: 'Imagem', icon: ImageIcon,  iconBg: '#059669', badgeBg: '#dcfce7',   badgeText: '#14532d' },
  link:  { label: 'Link',   icon: LinkIcon,   iconBg: '#d97706', badgeBg: '#fef3c7',   badgeText: '#78350f' },
}
const DEFAULT_CFG = { label: 'Arquivo', icon: FileIcon, iconBg: T.navy, badgeBg: '#f3f4f6', badgeText: '#374151' }

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
          <div style={{ fontSize: 10.5, color: T.gold, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 7, fontFamily: T.sans }}>Conteúdo de apoio</div>
          <h1 style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 700, color: T.h1, margin: '0 0 8px', fontFamily: T.serif, letterSpacing: '-0.3px' }}>
            Materiais Complementares
            {!loading && materials.length > 0 && (
              <span style={{ fontSize: 14, color: T.hint, fontFamily: T.sans, fontWeight: 400, marginLeft: 10 }}>({materials.length})</span>
            )}
          </h1>
          <p style={{ fontSize: 14, color: T.muted, fontFamily: T.sans, margin: 0, lineHeight: 1.65 }}>
            Conteúdos selecionados pelo Dr. Pablo para complementar seu tratamento.
          </p>
        </div>

        {loading ? <Skeleton /> : materials.length === 0 ? <EmptyState /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {materials.map(m => {
              const cfg = TYPE_CFG[m.type] || DEFAULT_CFG
              const url = m.external_url || m.file_url || '#'
              const Icon = cfg.icon
              return (
                <a key={m.id} href={url} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 'clamp(14px,2.5vw,18px) clamp(16px,3vw,20px)', background: T.card, borderRadius: 14, border: `1.5px solid ${T.border}`, textDecoration: 'none', transition: 'all 0.18s', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.navy; e.currentTarget.style.boxShadow = '0 6px 22px rgba(26,39,68,0.12)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'none' }}>

                  {/* Ícone colorido */}
                  <div style={{ width: 50, height: 50, borderRadius: 13, background: cfg.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={22} color="#fff" />
                  </div>

                  {/* Conteúdo */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'clamp(14px,1.8vw,16px)', fontWeight: 700, color: T.body, fontFamily: T.sans, marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.1px' }}>
                      {m.title}
                    </div>
                    <span style={{ display: 'inline-block', background: cfg.badgeBg, color: cfg.badgeText, fontSize: 10.5, fontWeight: 800, fontFamily: T.sans, padding: '3px 10px', borderRadius: 6, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Seta */}
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
                    </svg>
                  </div>
                </a>
              )
            })}
          </div>
        )}

        {!loading && materials.length > 0 && (
          <div style={{ marginTop: 22, textAlign: 'center', fontSize: 13.5, color: T.muted, fontFamily: T.sans, lineHeight: 1.7 }}>
            Dúvidas?{' '}
            <a href="tel:+5535998732804" style={{ color: T.gold, textDecoration: 'none', fontWeight: 700 }}>(35) 99873-2804</a>
          </div>
        )}
      </PatientLayout>
    </ProtectedRoute>
  )
}

/* ── SVG Icons ── */
function PdfIcon({ size, color }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
}
function VideoIcon({ size, color }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23,7 16,12 23,17 23,7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
}
function ImageIcon({ size, color }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
}
function LinkIcon({ size, color }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
}
function FileIcon({ size, color }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13,2 13,9 20,9"/></svg>
}

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      {[1,2,3].map(i => <div key={i} style={{ height: 78, background: '#e2e8f0', borderRadius: 14, animation: `pulse 1.5s ${i*0.12}s ease-in-out infinite` }} />)}
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px', background: '#fff', borderRadius: 16, border: '1.5px solid #d1d5db' }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: '#f1f5f9', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FileIcon size={24} color="#9ca3af" />
      </div>
      <div style={{ fontSize: 15, color: '#1f2937', fontFamily: 'system-ui,sans-serif', fontWeight: 700, marginBottom: 6 }}>Nenhum material disponível ainda</div>
      <div style={{ fontSize: 13.5, color: '#6b7280', fontFamily: 'system-ui,sans-serif', lineHeight: 1.6 }}>O Dr. Pablo irá adicionar em breve.</div>
    </div>
  )
}
