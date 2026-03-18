import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { saveSession } from '../lib/auth'
import { C } from '../lib/colors'

export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin() {
    if (!username || !password) { setError('Preencha usuário e senha.'); return }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()

      if (!res.ok) { setError(data.error || 'Erro ao fazer login.'); setLoading(false); return }

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
      <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${C.navy}, #2a3f6e)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: C.white, borderRadius: 20, padding: '48px 40px', width: '100%', maxWidth: 420, boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <span style={{ color: C.gold, fontWeight: 700, fontFamily: 'sans-serif', fontSize: 18 }}>PA</span>
            </div>
            <h1 style={{ color: C.navy, fontSize: 22, margin: '0 0 4px', fontFamily: 'sans-serif', fontWeight: 700 }}>Dr. Pablo Andrade</h1>
            <p style={{ color: C.gold, fontSize: 13, margin: '0 0 4px', fontFamily: 'sans-serif', fontWeight: 600 }}>Fisioterapia e Quiropraxia</p>
            <p style={{ color: C.gray400, fontSize: 13, margin: 0, fontFamily: 'sans-serif' }}>Acesse sua área exclusiva</p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: C.gray600, fontSize: 13, fontFamily: 'sans-serif', marginBottom: 6, fontWeight: 600 }}>Usuário</label>
            <input
              value={username} onChange={e => setUsername(e.target.value)}
              placeholder="Seu login"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '12px 16px', border: `1px solid ${error ? C.red : C.gray200}`, borderRadius: 8, fontSize: 14, fontFamily: 'sans-serif', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', color: C.gray600, fontSize: 13, fontFamily: 'sans-serif', marginBottom: 6, fontWeight: 600 }}>Senha</label>
            <input
              value={password} onChange={e => setPassword(e.target.value)}
              type="password" placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '12px 16px', border: `1px solid ${error ? C.red : C.gray200}`, borderRadius: 8, fontSize: 14, fontFamily: 'sans-serif', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          {error && (
            <div style={{ background: C.redLight, color: C.red, padding: '10px 14px', borderRadius: 8, fontSize: 13, fontFamily: 'sans-serif', marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} style={{
            width: '100%', background: C.navy, color: C.white, border: 'none',
            padding: 14, borderRadius: 8, fontSize: 16, fontFamily: 'sans-serif',
            fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginBottom: 12,
          }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <button onClick={() => router.push('/')} style={{ width: '100%', background: 'transparent', color: C.gray400, border: 'none', fontSize: 14, fontFamily: 'sans-serif', cursor: 'pointer', padding: 8 }}>
            Voltar ao site
          </button>
        </div>
      </div>
    </>
  )
}
