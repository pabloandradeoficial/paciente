import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { saveSession } from '../lib/auth'

const T = {
  sans: "'Montserrat', system-ui, sans-serif",
  serif: "'Montserrat', sans-serif",
  navy: '#111827', navyDeep: '#0d1117', green: '#22c55e',
  white: '#ffffff', gray200: '#e5e7eb', gray400: '#9ca3af',
  gray600: '#4b5563', gray700: '#374151',
  red: '#ef4444', redLight: '#fee2e2',
}

export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleLogin() {
    if (!username || !password) { setError('Preencha usuário e senha.'); return }
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Usuário ou senha incorretos.'); setLoading(false); return }
      saveSession(data)
      if (data.role === 'admin')   router.push('/admin')
      if (data.role === 'patient') router.push('/paciente')
    } catch {
      setError('Erro de conexão. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Entrar — Dr. Pablo Andrade</title></Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} body{overflow-x:hidden}`}</style>

      <div style={{ minHeight: '100vh', display: 'flex', fontFamily: T.sans, position: 'relative', overflow: 'hidden' }}>

        {/* ── Left: clinic photo panel (desktop only) ── */}
        <div style={{ flex: 1, position: 'relative', display: 'none' }} className="login-left">
          <style>{`.login-left{display:none!important} @media(min-width:900px){.login-left{display:block!important}}`}</style>
          <img src="/consultorio.jpg" alt="Consultório" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13,17,23,0.88) 0%, rgba(17,24,39,0.65) 100%)' }} />
          {/* Overlay content */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '48px' }}>
            <div style={{ color: T.green, fontSize: 10.5, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 12 }}>Portal Exclusivo</div>
            <h2 style={{ color: T.white, fontSize: 28, fontWeight: 800, lineHeight: 1.25, marginBottom: 16, fontFamily: T.serif }}>
              Seu acompanhamento<br /><em style={{ color: T.green, fontStyle: 'italic' }}>organizado e acessível</em>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.8, maxWidth: 320 }}>
              Acesse seus exercícios, orientações e materiais de reabilitação a qualquer momento.
            </p>
          </div>
        </div>

        {/* ── Right: login card panel ── */}
        <div style={{ width: '100%', maxWidth: 480, minHeight: '100vh', background: T.navyDeep, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(32px,6vw,56px) clamp(24px,5vw,48px)' }}>
          {/* Gold top accent */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: 480, height: 3, background: `linear-gradient(to left, ${T.green}, transparent)` }} />

          {/* Dr. Pablo photo + brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 44 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${T.green}`, flexShrink: 0 }}>
              <img src="/pablo.jpg" alt="Dr. Pablo Andrade" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }} />
            </div>
            <div>
              <div style={{ color: T.green, fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>Dr. Pablo Andrade</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11.5, marginTop: 2, letterSpacing: '0.3px' }}>Fisioterapia e Quiropraxia</div>
            </div>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ color: T.white, fontSize: 'clamp(22px,4vw,28px)', fontWeight: 800, fontFamily: T.serif, lineHeight: 1.2, marginBottom: 10 }}>
              Bem-vindo ao<br /><em style={{ color: T.green, fontWeight: 800 }}>seu portal</em>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13.5, lineHeight: 1.7 }}>
              Acesse sua área exclusiva com os dados fornecidos pelo fisioterapeuta.
            </p>
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700, marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Usuário</label>
              <input value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Seu login" autoComplete="username"
                style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.07)', border: `1px solid ${error ? T.red : 'rgba(255,255,255,0.15)'}`, borderRadius: 10, fontSize: 15, color: T.white, outline: 'none', transition: 'border-color 0.2s', fontFamily: T.sans, minHeight: 50 }}
                onFocus={e => e.target.style.borderColor = T.green}
                onBlur={e => e.target.style.borderColor = error ? T.red : 'rgba(255,255,255,0.15)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700, marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <input value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  type={showPass ? 'text' : 'password'} placeholder="••••••••" autoComplete="current-password"
                  style={{ width: '100%', padding: '14px 48px 14px 16px', background: 'rgba(255,255,255,0.07)', border: `1px solid ${error ? T.red : 'rgba(255,255,255,0.15)'}`, borderRadius: 10, fontSize: 15, color: T.white, outline: 'none', transition: 'border-color 0.2s', fontFamily: T.sans, boxSizing: 'border-box', minHeight: 50 }}
                  onFocus={e => e.target.style.borderColor = T.green}
                  onBlur={e => e.target.style.borderColor = error ? T.red : 'rgba(255,255,255,0.15)'}
                />
                <button onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 12, fontFamily: T.sans }}>
                  {showPass ? 'ocultar' : 'mostrar'}
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginTop: 16, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '12px 16px', borderRadius: 10, fontSize: 13.5 }}>
              {error}
            </div>
          )}

          {/* CTA */}
          <button onClick={handleLogin} disabled={loading} style={{
            marginTop: 28, width: '100%', background: loading ? 'rgba(34,197,94,0.6)' : T.green,
            color: T.navy, border: 'none', padding: '16px', borderRadius: 12,
            fontSize: 17, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.3px', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', fontFamily: T.sans,
            boxShadow: loading ? 'none' : '0 4px 20px rgba(34,197,94,0.35)',
            minHeight: 52,
          }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}>
            {loading ? 'Verificando...' : 'Entrar na minha área'}
          </button>

          <button onClick={() => router.push('/')} style={{ marginTop: 18, background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 13, cursor: 'pointer', fontFamily: T.sans, padding: '8px 0' }}>
            ← Voltar ao site
          </button>

          {/* Footer */}
          <div style={{ marginTop: 'auto', paddingTop: 48, borderTop: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.2)', fontSize: 11.5, lineHeight: 1.6 }}>
            Acesso exclusivo para pacientes cadastrados.<br />Dúvidas? Ligue: <a href="tel:+5535998732804" style={{ color: 'rgba(34,197,94,0.5)', textDecoration: 'none' }}>(35) 99873-2804</a>
          </div>
        </div>
      </div>
    </>
  )
}
