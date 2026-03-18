import { useEffect, useState } from 'react'
import { C } from '../../lib/colors'

export default function Toast({ msg, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); onClose?.() }, 3000)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: type === 'error' ? C.red : C.green,
      color: C.white, padding: '14px 24px', borderRadius: 10,
      fontSize: 14, fontFamily: 'sans-serif',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)', fontWeight: 600,
      maxWidth: 340,
    }}>
      {type === 'error' ? 'Erro: ' : 'OK — '}{msg}
    </div>
  )
}
