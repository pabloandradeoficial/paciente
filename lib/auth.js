// Gerenciamento de sessão simples via localStorage
// Em produção você pode evoluir para JWT + cookies httpOnly

export function saveSession(user) {
  if (typeof window === 'undefined') return
  localStorage.setItem('pabloandrade_session', JSON.stringify(user))
}

export function getSession() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('pabloandrade_session')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('pabloandrade_session')
}

export function isAdmin(session) {
  return session?.role === 'admin'
}

export function isPatient(session) {
  return session?.role === 'patient'
}
