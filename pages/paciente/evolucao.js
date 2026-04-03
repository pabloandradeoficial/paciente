import { useEffect, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  sans:   "'Montserrat', system-ui, sans-serif",
  navy:   '#111827',
  green:  '#22c55e',
  white:  '#ffffff',
  border: '#e5e7eb',
  muted:  '#6b7280',
  bg:     '#f5f5f0',
}

// ─── Borg → number ────────────────────────────────────────────────────────────

const BORG_NUM = { muito_leve: 1, leve: 3, moderado: 5, intenso: 7, maximo: 9 }
const BORG_LABEL = { muito_leve: 'Muito leve', leve: 'Leve', moderado: 'Moderado', intenso: 'Intenso', maximo: 'Máximo' }

// ─── Date helpers ─────────────────────────────────────────────────────────────

function fmtDDMM(isoStr) {
  const d = new Date(isoStr)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

// ─── Recharts (dynamic — no SSR) ─────────────────────────────────────────────

const EvolucaoChart = dynamic(() => import('recharts').then(rc => {
  const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = rc

  return function Chart({ data }) {
    const CustomTooltip = ({ active, payload, label }) => {
      if (!active || !payload?.length) return null
      return (
        <div style={{
          background: T.white, borderRadius: 10, padding: '10px 14px',
          border: `1px solid ${T.border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          fontFamily: T.sans, fontSize: 12, minWidth: 140,
        }}>
          <div style={{ fontWeight: 700, color: T.navy, marginBottom: 6 }}>{label}</div>
          {payload.map(p => (
            <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, color: p.color, marginBottom: 3 }}>
              <span>{p.name}</span>
              <span style={{ fontWeight: 700 }}>
                {p.dataKey === 'dor'
                  ? `${p.value}/10`
                  : Object.entries(BORG_NUM).find(([, v]) => v === p.value)?.[0]
                    ? BORG_LABEL[Object.entries(BORG_NUM).find(([, v]) => v === p.value)[0]]
                    : `${p.value}`
                }
              </span>
            </div>
          ))}
        </div>
      )
    }

    return (
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: T.muted, fontFamily: T.sans }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            tick={{ fontSize: 11, fill: T.muted, fontFamily: T.sans }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, fontFamily: T.sans, paddingTop: 12 }}
            iconType="circle"
            iconSize={8}
          />
          <Line
            type="monotone"
            dataKey="dor"
            name="Nível de dor"
            stroke="#22c55e"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#22c55e' }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="esforco"
            name="Esforço (Borg)"
            stroke="#9ca3af"
            strokeWidth={1.8}
            strokeDasharray="5 3"
            dot={false}
            activeDot={{ r: 5, fill: '#9ca3af' }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }
}), { ssr: false })

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Evolucao() {
  const [chartData, setChartData]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [stats, setStats]           = useState({ avgDor: null, lastDor: null, totalSessoes: 0 })

  useEffect(() => {
    const session = getSession()
    if (!session?.id) return

    fetch(`/api/evolucao?patient_id=${session.id}`)
      .then(r => r.json())
      .then(rows => {
        const data = (rows || []).map(row => ({
          date:    fmtDDMM(row.registrado_em),
          dor:     row.nivel_dor ?? null,
          esforco: row.nivel_esforco ? BORG_NUM[row.nivel_esforco] ?? null : null,
          rawDor:  row.nivel_dor,
        }))

        setChartData(data)

        const dorValues = data.filter(d => d.rawDor != null).map(d => d.rawDor)
        setStats({
          avgDor:       dorValues.length ? Math.round((dorValues.reduce((s, v) => s + v, 0) / dorValues.length) * 10) / 10 : null,
          lastDor:      dorValues.length ? dorValues[dorValues.length - 1] : null,
          totalSessoes: data.length,
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <ProtectedRoute requiredRole="patient">
      <Head><title>Minha Evolução — Dr. Pablo Andrade</title></Head>
      <PatientLayout>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10.5, color: T.green, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 7, fontFamily: T.sans, fontWeight: 600 }}>
            Acompanhamento
          </div>
          <h1 style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 700, color: T.navy, margin: '0 0 8px', fontFamily: T.sans, letterSpacing: '-0.3px' }}>
            Minha Evolução
          </h1>
          <p style={{ fontSize: 14, color: T.muted, fontFamily: T.sans, margin: 0, lineHeight: 1.65 }}>
            Acompanhe sua evolução de dor e esforço ao longo do tempo.
          </p>
        </div>

        {loading ? (
          <ChartSkeleton />
        ) : chartData.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* ── Stats cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Sessões registradas', value: stats.totalSessoes, unit: '',     color: T.navy  },
                { label: 'Última dor',           value: stats.lastDor,      unit: '/10',  color: stats.lastDor <= 3 ? '#16a34a' : stats.lastDor <= 6 ? '#d97706' : '#dc2626' },
                { label: 'Média de dor',          value: stats.avgDor,       unit: '/10',  color: T.muted },
              ].map(card => (
                <div key={card.label} style={{
                  background: T.white, borderRadius: 14, padding: '16px 14px',
                  border: `1px solid ${T.border}`, textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                  <div style={{ fontSize: 'clamp(20px,4vw,28px)', fontWeight: 800, color: card.color, lineHeight: 1, fontFamily: T.sans }}>
                    {card.value ?? '—'}<span style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>{card.unit}</span>
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 5, fontFamily: T.sans, lineHeight: 1.3 }}>
                    {card.label}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Gráfico ── */}
            <div style={{
              background: T.white, borderRadius: 16,
              border: `1px solid ${T.border}`,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              padding: 'clamp(16px,3vw,24px)',
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.navy, fontFamily: T.sans }}>
                    Dor e Esforço por Sessão
                  </div>
                  <div style={{ fontSize: 12, color: T.muted, fontFamily: T.sans, marginTop: 3 }}>
                    Últimas {chartData.length} sessões registradas
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 28, height: 2.5, background: T.green, borderRadius: 2 }} />
                    <span style={{ fontSize: 11, color: T.muted, fontFamily: T.sans }}>Dor (EVA)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 28, height: 2, background: '#9ca3af', borderRadius: 2, borderTop: '1px dashed #9ca3af', opacity: 0.8 }} />
                    <span style={{ fontSize: 11, color: T.muted, fontFamily: T.sans }}>Esforço (Borg)</span>
                  </div>
                </div>
              </div>

              <EvolucaoChart data={chartData} />

              {/* Y-axis reference labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingLeft: 34 }}>
                <span style={{ fontSize: 10, color: '#9ca3af', fontFamily: T.sans }}>0 = Sem dor</span>
                <span style={{ fontSize: 10, color: '#9ca3af', fontFamily: T.sans }}>10 = Dor máxima</span>
              </div>
            </div>

            {/* ── Interpretação ── */}
            <div style={{
              background: T.white, borderRadius: 14,
              border: `1px solid ${T.border}`,
              borderLeft: `3px solid ${T.green}`,
              padding: 'clamp(14px,3vw,20px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: 11, color: T.green, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8, fontFamily: T.sans, fontWeight: 600 }}>
                Como interpretar
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { range: '0 – 3', label: 'Dor leve ou ausente', color: '#16a34a' },
                  { range: '4 – 6', label: 'Dor moderada — atenção', color: '#d97706' },
                  { range: '7 – 10', label: 'Dor intensa — informe seu fisioterapeuta', color: '#dc2626' },
                ].map(item => (
                  <div key={item.range} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, color: T.muted, fontFamily: T.sans }}>
                      <strong style={{ color: item.color }}>{item.range}</strong> — {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </PatientLayout>
    </ProtectedRoute>
  )
}

// ─── Skeleton / Empty ─────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ height: 72, background: '#e5e7eb', borderRadius: 14, animation: `pulse 1.5s ${i*0.1}s infinite` }} />
        ))}
      </div>
      <div style={{ height: 320, background: '#e5e7eb', borderRadius: 16, animation: 'pulse 1.5s 0.3s infinite' }} />
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center', padding: '56px 20px',
      background: T.white, borderRadius: 16,
      border: `1px solid ${T.border}`,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      <div style={{ fontSize: 36, marginBottom: 14 }}>📊</div>
      <div style={{ fontSize: 15, color: T.navy, fontFamily: T.sans, fontWeight: 700, marginBottom: 6 }}>
        Nenhum dado ainda
      </div>
      <div style={{ fontSize: 14, color: T.muted, fontFamily: T.sans, lineHeight: 1.65 }}>
        Complete seus exercícios e registre seu feedback.<br/>
        O gráfico será preenchido automaticamente.
      </div>
    </div>
  )
}
