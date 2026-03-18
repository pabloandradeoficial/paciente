import { useEffect, useState } from 'react'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'
import { C } from '../../lib/colors'

export default function PatientExercicios() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (!session?.id) return
    fetch(`/api/patients/${session.id}`)
      .then(r => r.json())
      .then(data => {
        const plan = data?.plans?.find(p => p.is_active) || data?.plans?.[0]
        setExercises(plan?.exercises || [])
        setLoading(false)
      })
  }, [])

  return (
    <ProtectedRoute requiredRole="patient">
      <Head><title>Exercícios — Dr. Pablo Andrade</title></Head>
      <PatientLayout>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 24 }}>
          Meus Exercícios {!loading && `(${exercises.length})`}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: C.gray400 }}>Carregando exercícios...</div>
        ) : exercises.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: C.gray400, background: C.white, borderRadius: 16 }}>
            <div style={{ fontSize: 14, marginBottom: 8, color: C.gray300, letterSpacing: 2 }}>· · ·</div>
            <div>Nenhum exercício prescrito ainda.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {exercises
              .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
              .map((ex, i) => (
              <div key={ex.id} style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.gray200}`, overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ background: C.navy, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.navy, fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.white }}>{ex.title}</div>
                </div>

                {/* Body */}
                <div style={{ padding: '20px 24px' }}>
                  {/* Stats pills */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                    {[['Séries', ex.sets], ['Repetições', ex.reps], ['Frequência', ex.frequency]].filter(([, v]) => v).map(([l, v]) => (
                      <div key={l} style={{ background: C.gray50, borderRadius: 8, padding: '10px 16px', border: `1px solid ${C.gray200}`, textAlign: 'center', minWidth: 80 }}>
                        <div style={{ fontSize: 10, color: C.gray400, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{l}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  {ex.description && (
                    <p style={{ fontSize: 14, color: C.gray600, lineHeight: 1.8, margin: '0 0 12px' }}>{ex.description}</p>
                  )}

                  {/* Observations */}
                  {ex.observations && (
                    <div style={{ background: C.amberLight, borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#78350f', borderLeft: `3px solid ${C.amber}`, marginBottom: 12 }}>
                      Obs: {ex.observations}
                    </div>
                  )}

                  {/* Video link */}
                  {ex.video_url && (
                    <a href={ex.video_url} target="_blank" rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 4, color: C.blue, fontSize: 14, textDecoration: 'none', fontWeight: 600, background: C.blueLight, padding: '8px 16px', borderRadius: 8 }}>
                      Ver vídeo demonstrativo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </PatientLayout>
    </ProtectedRoute>
  )
}
