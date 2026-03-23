import { useRouter } from 'next/router'
import { useState } from 'react'
import { clearSession, getSession } from '../../lib/auth'

const T = {
  sans: "'Montserrat', system-ui, sans-serif",
  navy: '#1a2744', navyDeep: '#0e1628', navyMid: '#243358',
  gold: '#c9a84c', white: '#ffffff',
  gray50: '#f9fafb', gray100: '#f3f4f6', gray200: '#e5e7eb',
  gray400: '#9ca3af', gray500: '#6b7280', gray800: '#1f2937',
}

const navItems = [
  {
    href: '/admin', label: 'Dashboard',
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? T.gold : 'rgba(255,255,255,0.55)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    )
  },
  {
    href: '/admin/pacientes', label: 'Pacientes',
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? T.gold : 'rgba(255,255,255,0.55)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    )
  },
]

export default function AdminLayout({ children, title, subtitle }) {
  const router   = useRouter()
  const session  = typeof window !== 'undefined' ? getSession() : null
  const active   = router.pathname
  const [mobileOpen, setMobileOpen] = useState(false)

  function logout() { clearSession(); router.push('/login') }
  function navigate(href) { router.push(href); setMobileOpen(false) }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: T.gray50, fontFamily: T.sans }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; overflow-x: hidden; }
        /* Desktop: sidebar visible, mobile topbar hidden */
        .admin-sidebar  { display: flex; }
        .admin-mob-bar  { display: none; }
        .admin-overlay  { display: none; }
        @media (max-width: 768px) {
          .admin-sidebar  { display: none !important; }
          .admin-mob-bar  { display: flex !important; }
          .admin-content  { padding: 16px !important; }
          .admin-overlay  { display: block !important; }
        }
      `}</style>

      {/* ── Desktop sidebar ── */}
      <div className="admin-sidebar" style={{ width: 248, background: T.navyDeep, flexDirection: 'column', minHeight: '100vh', flexShrink: 0, borderRight: '1px solid rgba(201,168,76,0.1)' }}>
        <SidebarContent active={active} navigate={navigate} logout={logout} />
      </div>

      {/* ── Mobile overlay menu ── */}
      {mobileOpen && (
        <>
          <div className="admin-overlay" onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 199 }} />
          <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 280, background: T.navyDeep, zIndex: 200, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(201,168,76,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 16px 0' }}>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 24, lineHeight: 1 }}>×</button>
            </div>
            <SidebarContent active={active} navigate={navigate} logout={logout} />
          </div>
        </>
      )}

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', minWidth: 0 }}>

        {/* Desktop header */}
        <div style={{ padding: '18px 32px', background: T.white, borderBottom: `1px solid ${T.gray200}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}
          className="admin-desk-header">
          <style>{`.admin-desk-header{display:flex} @media(max-width:768px){.admin-desk-header{display:none!important}}`}</style>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.navy }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12.5, color: T.gray400, marginTop: 2 }}>{subtitle}</div>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.gold, fontWeight: 700, fontSize: 13 }}>PA</div>
            <div>
              <div style={{ fontSize: 13, color: T.gray800, fontWeight: 600 }}>{session?.name || 'Dr. Pablo Andrade'}</div>
              <div style={{ fontSize: 11, color: T.gray400 }}>Administrador</div>
            </div>
          </div>
        </div>

        {/* Mobile topbar */}
        <div className="admin-mob-bar" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 64, background: T.navyDeep, borderBottom: '1px solid rgba(201,168,76,0.15)', flexShrink: 0, position: 'sticky', top: 0, zIndex: 100 }}>
          <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 22, height: 2, background: T.white, borderRadius: 2 }} />)}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: T.navy, fontWeight: 800, fontSize: 11 }}>PA</span>
            </div>
            <div>
              <div style={{ color: T.gold, fontSize: 12, fontWeight: 700 }}>Dr. Pablo Andrade</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Painel Admin</div>
            </div>
          </div>
          <button onClick={logout} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: T.sans }}>
            Sair
          </button>
        </div>

        {/* Mobile page title strip */}
        <div style={{ display: 'none', padding: '14px 16px 0', background: T.gray50 }} className="admin-mob-title">
          <style>{`.admin-mob-title{display:none} @media(max-width:768px){.admin-mob-title{display:block!important}}`}</style>
          <div style={{ fontSize: 17, fontWeight: 700, color: T.navy }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: T.gray400, marginTop: 2 }}>{subtitle}</div>}
        </div>

        {/* Content */}
        <div className="admin-content" style={{ padding: '28px 32px', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

function SidebarContent({ active, navigate, logout }) {
  return (
    <>
      <div style={{ padding: '28px 22px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: T.navy, fontWeight: 800, fontSize: 13 }}>PA</span>
          </div>
          <div>
            <div style={{ color: T.gold, fontWeight: 700, fontSize: 13.5, lineHeight: 1.2 }}>Dr. Pablo Andrade</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10.5, marginTop: 2 }}>Fisioterapia e Quiropraxia</div>
          </div>
        </div>
        <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '4px 12px', display: 'inline-block' }}>
          <span style={{ color: T.gold, fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Painel Admin</span>
        </div>
      </div>

      <div style={{ height: 1, background: 'linear-gradient(to right, rgba(201,168,76,0.3), transparent)', margin: '0 22px 12px' }} />

      <nav style={{ flex: 1, padding: '4px 12px' }}>
        {navItems.map(item => {
          const isActive = active === item.href || (item.href !== '/admin' && active.startsWith(item.href))
          return (
            <button key={item.href} onClick={() => navigate(item.href)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent',
              border: isActive ? '1px solid rgba(201,168,76,0.2)' : '1px solid transparent',
              borderLeft: isActive ? '3px solid #c9a84c' : '3px solid transparent',
              borderRadius: 10, cursor: 'pointer', marginBottom: 4,
              color: isActive ? T.gold : 'rgba(255,255,255,0.6)',
              fontSize: 14, textAlign: 'left', fontFamily: T.sans, minHeight: 48,
            }}>
              {item.icon(isActive)}
              {item.label}
            </button>
          )
        })}
      </nav>

      <div style={{ padding: '12px 12px 28px' }}>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 12 }} />
        <button onClick={logout} style={{
          width: '100%', padding: '11px 14px', background: 'transparent',
          border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10,
          color: 'rgba(255,255,255,0.35)', fontSize: 13.5, cursor: 'pointer',
          textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, fontFamily: T.sans, minHeight: 44,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Sair
        </button>
      </div>
    </>
  )
}
