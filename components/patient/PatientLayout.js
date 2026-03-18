import { useRouter } from 'next/router'
import { clearSession, getSession } from '../../lib/auth'
import { C } from '../../lib/colors'

export default function PatientLayout({ children }) {
  const router = useRouter()
  const session = typeof window !== 'undefined' ? getSession() : null

  function logout() {
    clearSession()
    router.push('/login')
  }

  const tabs = [
    { href: '/paciente', label: 'Início' },
    { href: '/paciente/exercicios', label: 'Exercícios' },
    { href: '/paciente/orientacoes', label: 'Orientações' },
    { href: '/paciente/materiais', label: 'Materiais' },
  ]

  const active = router.pathname

  return (
    <div style={{ minHeight: '100vh', background: C.gray50, fontFamily: 'sans-serif' }}>
      <div style={{ background: C.navy, padding: '0 20px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: C.gold,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: C.navy, fontWeight: 700, fontSize: 12 }}>PA</span>
              </div>
              <div>
                <div style={{ color: C.white, fontWeight: 700, fontSize: 13 }}>Dr. Pablo Andrade</div>
                <div style={{ color: C.gold, fontSize: 10 }}>Fisioterapia e Quiropraxia</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                {session?.full_name?.split(' ')[0]}
              </span>
              <button onClick={logout} style={{
                background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)',
                border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13,
              }}>
                Sair
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4 }}>
            {tabs.map(t => {
              const isActive = active === t.href
              return (
                <button
                  key={t.href}
                  onClick={() => router.push(t.href)}
                  style={{
                    padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer',
                    color: isActive ? C.gold : 'rgba(255,255,255,0.55)',
                    fontSize: 14, fontWeight: isActive ? 700 : 400,
                    borderBottom: isActive ? `2px solid ${C.gold}` : '2px solid transparent',
                  }}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
        {children}
      </div>
    </div>
  )
}
