import { useEffect, useState } from 'react'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'
import { C } from '../../lib/colors'

const TYPE_LABEL = { pdf: 'PDF', video: 'Vídeo', image: 'Imagem', link: 'Link' }
const TYPE_COLOR = { pdf: C.red, video: C.blue, image: C.green, link: C.amber }

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
        <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 24 }}>
          Materiais Complementares {!loading && `(${materials.length})`}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: C.gray400 }}>Carregando materiais...</div>
        ) : materials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: C.gray400, background: C.white, borderRadius: 16 }}>
            <div style={{ fontSize: 14, marginBottom: 8, color: C.gray300, letterSpacing: 2 }}>· · ·</div>
            <div>Nenhum material disponível ainda.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {materials.map(m => (
              <a
                key={m.id}
                href={m.external_url || m.file_url || '#'}
                target="_blank"
                rel="noreferrer"
                style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.gray200}`, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.navy}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.gray200}
              >
                {/* Type badge */}
                <div style={{ width: 48, height: 48, borderRadius: 10, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: C.gold, fontSize: 11, fontWeight: 700, letterSpacing: '0.5px' }}>
                    {(TYPE_LABEL[m.type] || 'ARQ').toUpperCase()}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 4 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: TYPE_COLOR[m.type] || C.gray400, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                    {TYPE_LABEL[m.type] || m.type}
                  </div>
                </div>

                <div style={{ color: C.navy, fontSize: 20, fontWeight: 300, flexShrink: 0 }}>→</div>
              </a>
            ))}
          </div>
        )}
      </PatientLayout>
    </ProtectedRoute>
  )
}
