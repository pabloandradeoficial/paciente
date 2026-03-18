import { useEffect, useState } from 'react'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'
import { C } from '../../lib/colors'

export default function PatientHome() {
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

  return (
    <ProtectedRoute requiredRole="patient">
      <Head><title>Minha Área — Dr. Pablo Andrade</title></Head>
      <PatientLayout>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: C.gray400 }}>Carregando sua área...</div>
        ) : (
          <div>
            {/* Welcome card */}
            <div style={{ background: `linear-gradient(135deg, ${C.navy}, #2a3f6e)`, borderRadius: 16, padding: 32, marginBottom: 24, color: C.white }}>
              <div style={{ fontSize: 12, color: C.gold, letterSpacing: '1px', marginBottom: 8, textTransform: 'uppercase' }}>Bem-vindo(a)</div>
              <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 16 }}>Olá, {patient?.full_name?.split(' ')[0]}</div>
              {activePlan?.welcome_message && (
                <div style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '16px 20px', borderLeft: `3px solid ${C.gold}` }}>
                  {activePlan.welcome_message}
                </div>
              )}
            </div>

            {/* Active plan */}
            {activePlan && (
              <div style={{ background: C.white, borderRadius: 16, padding: '24px 28px', marginBottom: 20, border: `1px solid ${C.gray200}` }}>
                <div style={{ fontSize: 12, color: C.gray400, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Plano Atual</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{activePlan.title}</div>
                <div style={{ fontSize: 14, color: C.gray500, lineHeight: 1.7, marginBottom: 12 }}>{activePlan.description}</div>
                <div style={{ fontSize: 12, color: C.gray400 }}>Última atualização: {activePlan.updated_at?.slice(0, 10)}</div>
              </div>
            )}

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Exercícios', value: activePlan?.exercises?.length || 0, color: C.navy },
                { label: 'Orientações', value: activePlan?.guidelines?.length || 0, color: C.green },
                { label: 'Materiais', value: activePlan?.materials?.length || 0, color: C.amber },
              ].map(card => (
                <div key={card.label} style={{ background: C.white, borderRadius: 12, padding: 20, border: `1px solid ${C.gray200}`, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 700, color: card.color, marginBottom: 4 }}>{card.value}</div>
                  <div style={{ fontSize: 13, color: C.gray400 }}>{card.label}</div>
                </div>
              ))}
            </div>

            {/* Doctor card */}
            <div style={{ background: C.white, borderRadius: 16, padding: '20px 24px', border: `1px solid ${C.gray200}`, display: 'flex', alignItems: 'center', gap: 16 }}>
              <img src="/pablo.jpg" alt="Dr. Pablo Andrade" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', border: `2px solid ${C.gold}` }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Dr. Pablo Andrade</div>
                <div style={{ fontSize: 13, color: C.gray400 }}>Fisioterapia e Quiropraxia</div>
                <div style={{ fontSize: 13, color: C.gray500, marginTop: 2 }}>Dúvidas? (35) 9 9999-9999</div>
              </div>
            </div>
          </div>
        )}
      </PatientLayout>
    </ProtectedRoute>
  )
}
