import { useEffect, useState } from 'react'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'
import { C } from '../../lib/colors'

export default function PatientOrientacoes() {
  const [guidelines, setGuidelines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (!session?.id) return
    fetch(`/api/patients/${session.id}`)
      .then(r => r.json())
      .then(data => {
        const plan = data?.plans?.find(p => p.is_active) || data?.plans?.[0]
        setGuidelines(plan?.guidelines || [])
        setLoading(false)
      })
  }, [])

  return (
    <ProtectedRoute requiredRole="patient">
      <Head><title>Orientações — Dr. Pablo Andrade</title></Head>
      <PatientLayout>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 24 }}>
          Orientações do Dia a Dia {!loading && `(${guidelines.length})`}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: C.gray400 }}>Carregando orientações...</div>
        ) : guidelines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: C.gray400, background: C.white, borderRadius: 16 }}>
            <div style={{ fontSize: 14, marginBottom: 8, color: C.gray300, letterSpacing: 2 }}>· · ·</div>
            <div>Nenhuma orientação cadastrada ainda.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {guidelines
              .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
              .map(g => (
              <div key={g.id} style={{
                background: C.white, borderRadius: 16,
                border: `1px solid ${C.gray200}`,
                borderLeft: `5px solid ${C.gold}`,
                padding: '24px 28px',
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>
                  {g.category}
                </div>
                <div style={{ fontSize: 15, color: C.gray600, lineHeight: 1.9 }}>{g.content}</div>
              </div>
            ))}
          </div>
        )}
      </PatientLayout>
    </ProtectedRoute>
  )
}
