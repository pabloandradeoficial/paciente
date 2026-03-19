import { useRouter } from 'next/router'
import { clearSession, getSession } from '../../lib/auth'

const T = {
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  navy: '#1a2744',
  navyDeep: '#0e1628',
  gold: '#c9a84c',
  cream: '#f5f3ed',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  white: '#ffffff',
}

const tabs = [
  { href: '/paciente',               label: 'Início',      icon: HomeIcon },
  { href: '/paciente/exercicios',    label: 'Exercícios',  icon: ExIcon },
  { href: '/paciente/orientacoes',   label: 'Orientações', icon: GuideIcon },
  { href: '/paciente/materiais',     label: 'Materiais',   icon: MatIcon },
]

export default function PatientLayout({ children }) {
  const router = useRouter()
  const session = typeof window !== 'undefined' ? getSession() : null
  const active = router.pathname

  function logout() { clearSession(); router.push('/login') }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ed', fontFamily: T.sans }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        .patient-topbar { display: flex; }
        .patient-bottombar { display: none; }
        @media (max-width: 640px) {
          .patient-topbar-tabs { display: none !important; }
          .patient-bottombar { display: flex !important; }
          .patient-content { padding-bottom: 80px !important; }
        }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{ background: T.navyDeep, position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 clamp(1rem, 3vw, 1.5rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: T.navy, fontWeight: 800, fontSize: 12 }}>PA</span>
              </div>
              <div>
                <div style={{ color: T.white, fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Dr. Pablo Andrade</div>
                <div style={{ color: T.gold, fontSize: 10, letterSpacing: '0.3px' }}>Fisioterapia e Quiropraxia</div>
              </div>
            </div>

            {/* Right: name + logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {session?.full_name && (
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12.5 }}>
                  {session.full_name.split(' ')[0]}
                </span>
              )}
              <button onClick={logout} style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)', padding: '5px 13px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                Sair
              </button>
            </div>
          </div>

          {/* Desktop tab nav */}
          <div className="patient-topbar-tabs" style={{ display: 'flex', gap: 2, paddingBottom: 0 }}>
            {tabs.map(t => {
              const on = active === t.href
              return (
                <button key={t.href} onClick={() => router.push(t.href)} style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: on ? T.gold : 'rgba(255,255,255,0.5)',
                  fontSize: 13.5, fontWeight: on ? 700 : 400,
                  borderBottom: on ? `2px solid ${T.gold}` : '2px solid transparent',
                  transition: 'all 0.15s', fontFamily: T.sans,
                }}>
                  <t.icon size={14} color={on ? T.gold : 'rgba(255,255,255,0.45)'} />
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Page content ── */}
      <div className="patient-content" style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(20px, 4vw, 32px) clamp(1rem, 3vw, 1.5rem)' }}>
        {children}
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <div className="patient-bottombar" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: T.navyDeep, borderTop: '1px solid rgba(201,168,76,0.15)',
        display: 'none', justifyContent: 'space-around', alignItems: 'center',
        height: 68, paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {tabs.map(t => {
          const on = active === t.href
          return (
            <button key={t.href} onClick={() => router.push(t.href)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 16px', borderRadius: 10, flex: 1,
              color: on ? T.gold : 'rgba(255,255,255,0.4)', fontFamily: T.sans,
            }}>
              <t.icon size={20} color={on ? T.gold : 'rgba(255,255,255,0.4)'} />
              <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 400, letterSpacing: '0.2px' }}>{t.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── SVG Icons ── */
function HomeIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  )
}
function ExIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 010 8h-1" />
      <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  )
}
function GuideIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  )
}
function MatIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  )
}
