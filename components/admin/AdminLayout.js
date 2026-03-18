import { useRouter } from 'next/router'
import { clearSession, getSession } from '../../lib/auth'
import { C } from '../../lib/colors'

export default function AdminLayout({ children, title, subtitle }) {
  const router = useRouter()
  const session = typeof window !== 'undefined' ? getSession() : null

  function logout() {
    clearSession()
    router.push('/login')
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '▦' },
    { href: '/admin/pacientes', label: 'Pacientes', icon: '⊞' },
  ]

  const active = router.pathname

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.gray50, fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: C.navy, display: 'flex', flexDirection: 'column', minHeight: '100vh', flexShrink: 0 }}>
        <div style={{ padding: '28px 24px 20px' }}>
          <div style={{ color: C.gold, fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>Dr. Pablo Andrade</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>Fisioterapia e Quiropraxia</div>
          <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '3px 8px', display: 'inline-block' }}>Painel Admin</div>
        </div>

        <nav style={{ flex: 1, padding: '4px 12px' }}>
          {navItems.map(item => {
            const isActive = active === item.href || (item.href !== '/admin' && active.startsWith(item.href))
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 16px', background: isActive ? 'rgba(201,168,76,0.15)' : 'transparent',
                  border: 'none', borderRadius: 10, cursor: 'pointer', marginBottom: 3,
                  color: isActive ? C.gold : 'rgba(255,255,255,0.6)',
                  fontSize: 14, textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>

        <div style={{ padding: '12px 12px 24px' }}>
          <button onClick={logout} style={{
            width: '100%', padding: '11px 16px', background: 'rgba(255,255,255,0.05)',
            border: 'none', borderRadius: 10, color: 'rgba(255,255,255,0.45)',
            fontSize: 14, cursor: 'pointer', textAlign: 'left',
          }}>
            Sair
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {/* Header */}
        <div style={{
          padding: '20px 32px', background: C.white,
          borderBottom: `1px solid ${C.gray200}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.navy }}>{title}</div>
            {subtitle && <div style={{ fontSize: 13, color: C.gray400, marginTop: 2 }}>{subtitle}</div>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: C.navy,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.gold, fontWeight: 700, fontSize: 13,
            }}>PA</div>
            <div style={{ fontSize: 13, color: C.gray600 }}>{session?.name || 'Dr. Pablo Andrade'}</div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: 32, flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
