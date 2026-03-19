import { useEffect, useState } from 'react'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'

const T = {
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  serif: "'Georgia', serif",
  navy: '#1a2744', gold: '#c9a84c', white: '#ffffff',
  gray100: '#f3f4f6', gray200: '#e5e7eb',
  gray400: '#9ca3af', gray500: '#6b7280', gray600: '#4b5563',
  red: '#ef4444', redLight: '#fee2e2',
  blue: '#3b82f6', blueLight: '#dbeafe',
  green: '#10b981', greenLight: '#d1fae5',
  amber: '#f59e0b', amberLight: '#fef3c7',
}

const TYPE_CONFIG = {
  pdf:   { label: 'PDF',    bg: T.redLight,   color: '#991b1b', abbr: 'PDF' },
  video: { label: 'Vídeo',  bg: T.blueLight,  color: '#1e40af', abbr: 'VID' },
  image: { label: 'Imagem', bg: T.greenLight, color: '#065f46', abbr: 'IMG' },
  link:  { label: 'Link',   bg: T.amberLight, color: '#78350f', abbr: 'URL' },
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

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: T.gold, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6, fontFamily: T.sans }}>Conteúdo</div>
          <h1 style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 400, color: T.navy, margin: 0, fontFamily: T.serif }}>
            Materiais Complementares {!loading && materials.length > 0 && <span style={{ fontSize: 14, color: T.gray400, fontFamily: T.sans, fontWeight: 400 }}>({materials.length})</span>}
          </h1>
          <p style={{ fontSize: 13, color: T.gray500, fontFamily: T.sans, marginTop: 6, lineHeight: 1.6 }}>
            Conteúdos selecionados pelo Dr. Pablo para complementar seu tratamento.
          </p>
        </div>

        {loading ? <Skeleton /> : materials.length === 0 ? <EmptyState /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {materials.map(m => {
              const cfg = TYPE_CONFIG[m.type] || { label: 'Arquivo', bg: T.gray100, color: T.gray500, abbr: 'ARQ' }
              const url = m.external_url || m.file_url || '#'
              return (
                <a key={m.id} href={url} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 'clamp(14px,2.5vw,18px) clamp(16px,3vw,22px)', background: T.white, borderRadius: 14, border: `1px solid ${T.gray200}`, textDecoration: 'none', transition: 'all 0.18s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.navy; e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,39,68,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.gray200; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}>

                  {/* Type badge */}
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: cfg.color, fontSize: 10, fontWeight: 800, fontFamily: T.sans, letterSpacing: '0.5px' }}>{cfg.abbr}</span>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'clamp(13px,1.6vw,15px)', fontWeight: 600, color: T.navy, fontFamily: T.sans, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                    <div style={{ fontSize: 11, color: cfg.color, fontFamily: T.sans, marginTop: 3, fontWeight: 600, letterSpacing: '0.3px' }}>{cfg.label}</div>
                  </div>

                  {/* Arrow */}
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: T.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: T.navy, fontSize: 14, fontWeight: 600 }}>→</span>
                  </div>
                </a>
              )
            })}
          </div>
        )}

        {!loading && materials.length > 0 && (
          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12.5, color: T.gray400, fontFamily: T.sans, lineHeight: 1.7 }}>
            Dúvidas sobre os materiais? Entre em contato:{' '}
            <a href="tel:+5535998732804" style={{ color: T.gold, textDecoration: 'none', fontWeight: 600 }}>(35) 99873-2804</a>
          </div>
        )}
      </PatientLayout>
    </ProtectedRoute>
  )
}

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[1, 2, 3].map(i => <div key={i} style={{ height: 70, background: '#e5e7eb', borderRadius: 12, animation: 'pulse 1.5s ease-in-out infinite' }} />)}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
      <div style={{ fontSize: 15, color: '#6b7280', fontFamily: 'system-ui, sans-serif' }}>Nenhum material disponível ainda.</div>
      <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 6, fontFamily: 'system-ui, sans-serif' }}>O Dr. Pablo irá adicionar em breve.</div>
    </div>
  )
}
