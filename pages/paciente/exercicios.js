import { useEffect, useState } from 'react'
import Head from 'next/head'
import PatientLayout from '../../components/patient/PatientLayout'
import ProtectedRoute from '../../components/shared/ProtectedRoute'
import { getSession } from '../../lib/auth'

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  sans:   "'Montserrat', system-ui, sans-serif",
  navy:   '#1C1410',
  green:  '#C9A84C',
  white:  '#ffffff',
  border: '#E8DDD0',
  muted:  '#6B5C4E',
  dark:   '#4A3728',
  bg:     '#FAFAF8',
}

// ─── Feedback data ────────────────────────────────────────────────────────────

const PAIN_SCALE = [
  { v: 0,  e: '😌', l: 'Sem dor'     },
  { v: 1,  e: '🙂', l: ''            },
  { v: 2,  e: '😊', l: ''            },
  { v: 3,  e: '😐', l: ''            },
  { v: 4,  e: '😕', l: ''            },
  { v: 5,  e: '😟', l: 'Moderada'    },
  { v: 6,  e: '😣', l: ''            },
  { v: 7,  e: '😖', l: ''            },
  { v: 8,  e: '😫', l: ''            },
  { v: 9,  e: '😩', l: ''            },
  { v: 10, e: '😭', l: 'Insuportável'},
]

const BORG = [
  { v: 'muito_leve', e: '🌬️', l: 'Muito Leve' },
  { v: 'leve',       e: '😌', l: 'Leve'       },
  { v: 'moderado',   e: '😤', l: 'Moderado'   },
  { v: 'intenso',    e: '💪', l: 'Intenso'    },
  { v: 'maximo',     e: '🔥', l: 'Máximo'     },
]

function painColors(v) {
  if (v <= 2) return { bg: '#F5EDD8', border: '#C9A84C', text: '#8B6914' }
  if (v <= 5) return { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' }
  if (v <= 7) return { bg: '#fff7ed', border: '#f97316', text: '#9a3412' }
  return { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' }
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

const todayKey = () => new Date().toISOString().slice(0, 10)
function getDoneKey(id) { return `check_exercicio_${id}_${todayKey()}` }
function isChecked(id)  { try { return localStorage.getItem(getDoneKey(id)) === '1' } catch { return false } }
function markDone(id)   { try { localStorage.setItem(getDoneKey(id), '1') } catch {} }

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PatientExercicios() {
  const [exercises,   setExercises]   = useState([])
  const [planId,      setPlanId]      = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [expanded,    setExpanded]    = useState(null)
  const [checkedMap,  setCheckedMap]  = useState({})

  // Feedback modal state
  const [modal,      setModal]      = useState(null)  // { exercise, planId } | null
  const [painLevel,  setPainLevel]  = useState(0)
  const [borgLevel,  setBorgLevel]  = useState(null)
  const [notes,      setNotes]      = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [saveError,  setSaveError]  = useState(null)

  function refreshChecks(ids) {
    const map = {}
    ids.forEach(id => { map[id] = isChecked(id) })
    setCheckedMap(map)
  }

  useEffect(() => {
    const session = getSession()
    if (!session?.id) return
    fetch(`/api/patients/${session.id}`)
      .then(r => r.json())
      .then(data => {
        const plan   = data?.plans?.find(p => p.is_active) || data?.plans?.[0]
        const sorted = (plan?.exercises || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        setExercises(sorted)
        setPlanId(plan?.id || null)
        setLoading(false)
        if (sorted.length > 0) {
          setExpanded(sorted[0].id)
          refreshChecks(sorted.map(e => e.id))
        }
      })
  }, [])

  useEffect(() => {
    if (exercises.length > 0) refreshChecks(exercises.map(e => e.id))
  }, [exercises.length])

  // ── Open / close modal ──────────────────────────────────────────────────────

  function openModal(exercise) {
    setPainLevel(0)
    setBorgLevel(null)
    setNotes('')
    setSaveError(null)
    // Capture planId at open time — avoids stale-state race on submit
    setModal({ exercise, planId })
  }

  function closeModal() {
    if (submitting) return
    setSaveError(null)
    setModal(null)
  }

  // ── Submit feedback ─────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!modal) return
    setSubmitting(true)
    setSaveError(null)
    const session = getSession()

    try {
      const res = await fetch('/api/logs-exercicios', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id:    session?.id,
          exercicio_id:  modal.exercise.id,
          plano_id:      modal.planId,   // captured at modal open — never stale
          nivel_dor:     painLevel,
          nivel_esforco: borgLevel,
          observacoes:   notes,
        }),
      })

      if (!res.ok) {
        // Parse and surface the real error from the API
        let msg = `Erro ${res.status}`
        try {
          const body = await res.json()
          msg = body.error || body.hint || msg
          console.error('[exercicios] falha ao salvar log:', res.status, body)
        } catch {}
        setSaveError(msg)
        setSubmitting(false)
        return   // ← keep modal open so user can retry
      }
    } catch (err) {
      console.error('[exercicios] erro de rede:', err)
      setSaveError('Sem conexão. Verifique sua internet e tente novamente.')
      setSubmitting(false)
      return   // ← keep modal open
    }

    // Only mark as done locally after confirmed server save
    markDone(modal.exercise.id)
    setCheckedMap(prev => ({ ...prev, [modal.exercise.id]: true }))
    setSaveError(null)
    setModal(null)
    setSubmitting(false)
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <ProtectedRoute requiredRole="patient">
      <Head><title>Exercícios — Dr. Pablo Andrade</title></Head>
      <PatientLayout>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10.5, color: T.green, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 7, fontFamily: T.sans, fontWeight: 600 }}>
            Prescrição
          </div>
          <h1 style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 700, color: T.navy, margin: '0 0 8px', fontFamily: T.sans, letterSpacing: '-0.3px' }}>
            Exercícios Prescritos
            {!loading && exercises.length > 0 && (
              <span style={{ fontSize: 14, color: T.muted, fontFamily: T.sans, fontWeight: 400, marginLeft: 10 }}>
                ({exercises.length})
              </span>
            )}
          </h1>
          <p style={{ fontSize: 14, color: T.muted, fontFamily: T.sans, margin: 0, lineHeight: 1.65 }}>
            Siga as orientações de séries e repetições. Dúvidas? Entre em contato.
          </p>
        </div>

        {loading ? <Skeleton /> : exercises.length === 0 ? <EmptyState /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {exercises.map((ex, i) => {
              const open = expanded === ex.id
              const done = checkedMap[ex.id]
              return (
                <div key={ex.id} style={{
                  background: T.white, borderRadius: 16,
                  border: open
                    ? '2px solid #C9A84C'
                    : done ? '2px solid #C9A84C' : `1.5px solid ${T.border}`,
                  overflow: 'hidden',
                  boxShadow: open
                    ? '0 4px 20px rgba(201,168,76,0.15)'
                    : '0 2px 16px rgba(0,0,0,0.06)',
                  transition: 'all 0.25s ease',
                }}>

                  {/* ── Header: clique para expandir ── */}
                  <button
                    onClick={() => setExpanded(p => p === ex.id ? null : ex.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                      padding: 'clamp(14px,2.5vw,18px) clamp(16px,3vw,22px)',
                      background: open ? '#2C1810' : T.white,
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      transition: 'background 0.2s', minHeight: 52,
                    }}>
                    {/* Número */}
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: open ? '#C9A84C' : T.bg,
                      border: open ? 'none' : `1.5px solid ${T.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}>
                      <span style={{ fontWeight: 700, fontSize: 15, fontFamily: T.sans, color: open ? '#1C1410' : T.dark }}>
                        {i + 1}
                      </span>
                    </div>
                    {/* Título */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 'clamp(14px,2.2vw,16px)', fontWeight: 700, fontFamily: T.sans,
                        color: open ? T.white : T.navy,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{ex.title}</div>
                      {!open && done && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#8B6914', background: '#F5EDD8', padding: '2px 8px', borderRadius: 10, display: 'inline-block', marginTop: 3 }}>
                          Feito hoje ✓
                        </span>
                      )}
                      {!open && !done && (
                        <div style={{ fontSize: 12, color: T.muted, fontFamily: T.sans, marginTop: 3 }}>
                          {[ex.sets && `${ex.sets} séries`, ex.reps && `${ex.reps} reps`, ex.frequency].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>
                    {/* Chevron */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke={open ? '#C9A84C' : '#9ca3af'} strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {/* ── Corpo expandido ── */}
                  {open && (
                    <div style={{ background: T.white, padding: 'clamp(18px,3vw,24px)', borderTop: `1px solid ${T.border}` }}>

                      {/* Vídeo / Imagem placeholder */}
                      <VideoBanner ex={ex} />

                      {/* Pills de prescrição */}
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
                        {[
                          { label: 'Séries',     value: ex.sets      },
                          { label: 'Repetições', value: ex.reps      },
                          { label: 'Frequência', value: ex.frequency },
                        ].filter(item => item.value).map(item => (
                          <div key={item.label} style={{
                            background: '#F5EDD8', borderRadius: 12,
                            padding: '12px 20px', textAlign: 'center',
                            border: `1px solid ${T.border}`, minWidth: 90,
                          }}>
                            <div style={{ fontSize: 10, color: T.muted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4, fontFamily: T.sans, fontWeight: 600 }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 700, color: T.navy, fontFamily: T.sans }}>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Descrição */}
                      {ex.description && (
                        <div style={{ marginBottom: 14, padding: '14px 16px', background: '#FAFAF8', borderRadius: 10, border: `1px solid ${T.border}` }}>
                          <div style={{ fontSize: 10, color: T.muted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 7, fontFamily: T.sans, fontWeight: 600 }}>
                            Como realizar
                          </div>
                          <p style={{ fontSize: 'clamp(14px,1.8vw,15px)', color: T.navy, lineHeight: 1.85, margin: 0, fontFamily: T.sans }}>
                            {ex.description}
                          </p>
                        </div>
                      )}

                      {/* Observações / Atenção */}
                      {ex.observations && (
                        <div style={{ marginBottom: 14, padding: '13px 16px', background: '#fff7ed', borderRadius: 10, borderLeft: '3px solid #f59e0b' }}>
                          <div style={{ fontSize: 10, color: '#92400e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, fontFamily: T.sans, fontWeight: 700 }}>
                            Atenção
                          </div>
                          <p style={{ fontSize: 'clamp(14px,1.8vw,15px)', color: '#7c2d12', lineHeight: 1.8, margin: 0, fontFamily: T.sans }}>
                            {ex.observations}
                          </p>
                        </div>
                      )}

                      {/* Botão de conclusão */}
                      <div style={{ paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
                        {done ? (
                          <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            width: '100%', padding: '14px 20px', borderRadius: 12,
                            background: '#F5EDD8', border: '1.5px solid #E8CFA0',
                            fontSize: 14, fontWeight: 700, color: '#8B6914', fontFamily: T.sans,
                          }}>
                            ✓ Concluído hoje — ótimo trabalho!
                          </div>
                        ) : (
                          <button
                            onClick={() => openModal(ex)}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                              width: '100%', padding: '16px 20px', borderRadius: 12,
                              background: '#C9A84C', border: 'none',
                              color: '#1C1410', fontSize: 15, fontWeight: 700,
                              cursor: 'pointer', fontFamily: T.sans, minHeight: 52,
                              boxShadow: '0 4px 14px rgba(201,168,76,0.35)',
                              transition: 'all 0.2s ease',
                            }}>
                            ✓ Marcar como Concluído
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Nota de rodapé */}
        {!loading && exercises.length > 0 && (
          <div style={{
            marginTop: 20, padding: 'clamp(13px,2.5vw,16px) clamp(16px,3vw,22px)',
            background: T.white, borderRadius: 14,
            border: `1px solid ${T.border}`, borderLeft: '3px solid #C9A84C',
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
          }}>
            <p style={{ fontSize: 13.5, color: T.muted, fontFamily: T.sans, margin: 0, lineHeight: 1.7 }}>
              Dúvidas sobre algum exercício?{' '}
              <a href="tel:+5535998732804" style={{ color: T.green, textDecoration: 'none', fontWeight: 700 }}>
                (35) 99873-2804
              </a>
            </p>
          </div>
        )}

        {/* ── Modal de Feedback ── */}
        {modal && (
          <FeedbackModal
            exercise={modal.exercise}
            painLevel={painLevel}
            setPainLevel={setPainLevel}
            borgLevel={borgLevel}
            setBorgLevel={setBorgLevel}
            notes={notes}
            setNotes={setNotes}
            submitting={submitting}
            saveError={saveError}
            onClose={closeModal}
            onSubmit={handleSubmit}
          />
        )}

      </PatientLayout>
    </ProtectedRoute>
  )
}

// ─── VideoBanner ──────────────────────────────────────────────────────────────

function VideoBanner({ ex }) {
  if (ex.image_url) {
    return (
      <img
        src={ex.image_url}
        alt={ex.title}
        style={{
          width: '100%', display: 'block', borderRadius: 12,
          maxHeight: 200, objectFit: 'cover', marginBottom: 20,
        }}
      />
    )
  }
  return (
    <div style={{
      position: 'relative', width: '100%', paddingBottom: '42%',
      borderRadius: 12, overflow: 'hidden', marginBottom: 20,
      background: 'linear-gradient(135deg, #2C1810 0%, #3D2415 50%, #1C1410 100%)',
    }}>
      {/* dot grid texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.07, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, #C9A84C 1px, transparent 1px)',
        backgroundSize: '18px 18px',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
        {ex.video_url ? (
          <a href={ex.video_url} target="_blank" rel="noreferrer"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(201,168,76,0.2)', border: '2px solid rgba(201,168,76,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#C9A84C">
                <polygon points="6,3 20,12 6,21"/>
              </svg>
            </div>
            <span style={{ fontSize: 12, color: 'rgba(201,168,76,0.8)', fontFamily: "'Montserrat', system-ui, sans-serif", fontWeight: 600 }}>
              Ver demonstração
            </span>
          </a>
        ) : (
          <>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
              stroke="rgba(201,168,76,0.35)" strokeWidth="1.5" strokeLinecap="round">
              <polygon points="6,3 20,12 6,21"/>
            </svg>
            <span style={{ fontSize: 11, color: 'rgba(201,168,76,0.4)', fontFamily: "'Montserrat', system-ui, sans-serif" }}>
              Vídeo do exercício
            </span>
          </>
        )}
      </div>
    </div>
  )
}

// ─── FeedbackModal ────────────────────────────────────────────────────────────

function FeedbackModal({ exercise, painLevel, setPainLevel, borgLevel, setBorgLevel, notes, setNotes, submitting, saveError, onClose, onSubmit }) {
  const pain = PAIN_SCALE[painLevel]
  const pc   = painColors(painLevel)

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(28,20,16,0.6)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Bottom sheet */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 9999,
        background: '#ffffff',
        borderRadius: '22px 22px 0 0',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '0 0 env(safe-area-inset-bottom)',
        animation: 'slideUp 0.3s ease',
        WebkitOverflowScrolling: 'touch',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 4px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: '#E8DDD0' }} />
        </div>

        <div style={{ padding: '12px 20px 36px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1C1410', fontFamily: "'Montserrat', system-ui, sans-serif", margin: '0 0 4px' }}>
                Como foi o exercício?
              </h2>
              <p style={{ fontSize: 13, color: '#6B5C4E', fontFamily: "'Montserrat', system-ui, sans-serif", margin: 0 }}>
                {exercise.title}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ background: '#F5EDD8', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#8B6914' }}>
              ✕
            </button>
          </div>

          {/* ── EVA: escala de dor ── */}
          <div style={{ marginBottom: 26 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#1C1410', fontFamily: "'Montserrat', system-ui, sans-serif", margin: '0 0 4px' }}>
              Qual seu nível de dor agora?
            </p>
            <p style={{ fontSize: 12, color: '#6B5C4E', fontFamily: "'Montserrat', system-ui, sans-serif", margin: '0 0 12px' }}>
              Toque no número que melhor descreve sua dor
            </p>

            {/* Selected display */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderRadius: 12, marginBottom: 12,
              background: pc.bg, border: `1.5px solid ${pc.border}`,
              transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: 28 }}>{pain.e}</span>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: pc.text, lineHeight: 1 }}>{painLevel}</div>
                <div style={{ fontSize: 12, color: pc.text, opacity: 0.8, marginTop: 2 }}>
                  {pain.l || `Nível ${painLevel}`}
                </div>
              </div>
            </div>

            {/* 0–10 grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 3 }}>
              {PAIN_SCALE.map(({ v, e }) => (
                <button key={v} onClick={() => setPainLevel(v)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  padding: '8px 2px', borderRadius: 10, border: '1.5px solid',
                  borderColor: painLevel === v ? painColors(v).border : '#E8DDD0',
                  background: painLevel === v ? painColors(v).bg : '#ffffff',
                  cursor: 'pointer', transition: 'all 0.15s', fontSize: 0,
                }}>
                  <span style={{ fontSize: 'clamp(14px,3.5vw,18px)', lineHeight: 1 }}>{e}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Montserrat', system-ui, sans-serif", color: painLevel === v ? painColors(v).text : '#6B5C4E' }}>
                    {v}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Borg: esforço percebido ── */}
          <div style={{ marginBottom: 26 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#1C1410', fontFamily: "'Montserrat', system-ui, sans-serif", margin: '0 0 4px' }}>
              Quão difícil foi realizar?
            </p>
            <p style={{ fontSize: 12, color: '#6B5C4E', fontFamily: "'Montserrat', system-ui, sans-serif", margin: '0 0 12px' }}>
              Escala de esforço percebido (Borg)
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
              {BORG.map(opt => (
                <button key={opt.v} onClick={() => setBorgLevel(opt.v)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  padding: '12px 4px', borderRadius: 12, border: '1.5px solid',
                  borderColor: borgLevel === opt.v ? '#C9A84C' : '#E8DDD0',
                  background: borgLevel === opt.v ? 'rgba(201,168,76,0.1)' : '#ffffff',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  <span style={{ fontSize: 'clamp(18px,4.5vw,22px)', lineHeight: 1 }}>{opt.e}</span>
                  <span style={{
                    fontSize: 'clamp(9px,2.2vw,11px)', fontWeight: 700, fontFamily: "'Montserrat', system-ui, sans-serif", textAlign: 'center',
                    color: borgLevel === opt.v ? '#8B6914' : '#6B5C4E', lineHeight: 1.2,
                  }}>
                    {opt.l}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Observações ── */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#1C1410', fontFamily: "'Montserrat', system-ui, sans-serif", margin: '0 0 8px' }}>
              Observações <span style={{ fontWeight: 400, color: '#6B5C4E' }}>(opcional)</span>
            </p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Como você se sentiu? Alguma dificuldade ou dúvida?"
              rows={3}
              style={{
                width: '100%', borderRadius: 12, padding: '12px 14px',
                border: '1.5px solid #E8DDD0', fontSize: 14,
                fontFamily: "'Montserrat', system-ui, sans-serif", color: '#1C1410', lineHeight: 1.6,
                resize: 'none', outline: 'none', boxSizing: 'border-box',
                background: '#FAFAF8',
              }}
            />
          </div>

          {/* ── Error message ── */}
          {saveError && (
            <div style={{
              padding: '12px 14px', borderRadius: 10, marginBottom: 4,
              background: '#fef2f2', border: '1px solid #fca5a5',
              fontSize: 13, color: '#991b1b', fontFamily: "'Montserrat', system-ui, sans-serif", lineHeight: 1.5,
            }}>
              ⚠️ {saveError}
            </div>
          )}

          {/* ── Submit ── */}
          <button
            onClick={onSubmit}
            disabled={submitting}
            style={{
              width: '100%', padding: '16px', borderRadius: 12, border: 'none',
              background: submitting ? '#E8DDD0' : '#C9A84C',
              color: submitting ? '#6B5C4E' : '#1C1410',
              fontSize: 16, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: "'Montserrat', system-ui, sans-serif", minHeight: 54,
              boxShadow: submitting ? 'none' : '0 4px 14px rgba(201,168,76,0.35)',
              transition: 'all 0.2s',
            }}>
            {submitting ? 'Salvando…' : saveError ? '↻ Tentar novamente' : '✓ Confirmar conclusão'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
    </>
  )
}

// ─── Skeleton / EmptyState ────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ height: 66, background: '#E8DDD0', borderRadius: 14, animation: `pulse 1.5s ${i * 0.12}s ease-in-out infinite` }} />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px', background: '#ffffff', borderRadius: 16, border: '1px solid #E8DDD0', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: '#F5EDD8', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E8DDD0' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round">
          <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
        </svg>
      </div>
      <div style={{ fontSize: 15, color: '#1C1410', fontFamily: "'Montserrat', system-ui, sans-serif", fontWeight: 700, marginBottom: 6 }}>
        Nenhum exercício prescrito ainda
      </div>
      <div style={{ fontSize: 14, color: '#6B5C4E', fontFamily: "'Montserrat', system-ui, sans-serif", lineHeight: 1.6 }}>
        O Dr. Pablo irá adicionar o seu protocolo em breve.
      </div>
    </div>
  )
}
