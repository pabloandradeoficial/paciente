import { C } from '../../lib/colors'

export default function StatusBadge({ active }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
      fontFamily: 'sans-serif',
      background: active ? C.greenLight : C.gray100,
      color: active ? '#065f46' : C.gray500,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: active ? C.green : C.gray400,
        flexShrink: 0,
      }} />
      {active ? 'Ativo' : 'Inativo'}
    </span>
  )
}
