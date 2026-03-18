import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getSession } from '../../lib/auth'
import { C } from '../../lib/colors'

export default function ProtectedRoute({ children, requiredRole }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.replace('/login')
      return
    }
    if (requiredRole && session.role !== requiredRole) {
      router.replace('/login')
      return
    }
    setChecking(false)
  }, [])

  if (checking) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: C.gray50, fontFamily: 'sans-serif',
      }}>
        <div style={{ color: C.gray400, fontSize: 15 }}>Verificando acesso...</div>
      </div>
    )
  }

  return children
}
