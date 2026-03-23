import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../components/admin/AdminLayout'
import ProtectedRoute from '../../../components/shared/ProtectedRoute'
import StatusBadge from '../../../components/shared/StatusBadge'
import Toast from '../../../components/shared/Toast'
import { C } from '../../../lib/colors'

export default function PatientDetail() {
  const router   = useRouter()
  const { id }   = router.query
  const [patient, setPatient]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState('dados')
  const [toast, setToast]       = useState(null)

  function showToast(msg, type = 'success') { setToast({ msg, type }) }

  async function loadPatient() {
    if (!id) return
    const res = await fetch(`/api/patients/${id}`)
    const data = await res.json()
    setPatient(data)
    setLoading(false)
  }

  useEffect(() => { loadPatient() }, [id])

  if (loading || !patient) {
    return (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout title="Carregando..." subtitle="">
          <div style={{ padding: 60, textAlign: 'center', color: C.gray400 }}>Carregando paciente...</div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  const activePlan = patient.plans?.find(p => p.is_active) || patient.plans?.[0]

  const tabs = [
    { id: 'dados',       label: 'Dados' },
    { id: 'plano',       label: 'Plano' },
    { id: 'exercicios',  label: 'Exercícios' },
    { id: 'orientacoes', label: 'Orientações' },
    { id: 'materiais',   label: 'Materiais' },
    { id: 'notas',       label: 'Notas Internas' },
    { id: 'acesso',      label: 'Acesso' },
  ]

  return (
    <ProtectedRoute requiredRole="admin">
      <Head><title>{patient.full_name} — Admin</title></Head>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <AdminLayout title={patient.full_name} subtitle={`@${patient.username} · ${patient.phone || 'sem telefone'}`}>

        <button onClick={() => router.push('/admin/pacientes')} style={{ background: 'none', border: 'none', color: C.navy, fontSize: 14, cursor: 'pointer', marginBottom: 20 }}>← Voltar à lista</button>

        {/* Patient header card */}
        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.gray200}`, marginBottom: 24, padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold, fontWeight: 700, fontSize: 18 }}>
              {patient.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.navy }}>{patient.full_name}</div>
              <div style={{ fontSize: 13, color: C.gray400 }}>@{patient.username} · {patient.phone || 'sem telefone'}</div>
            </div>
          </div>
          <StatusBadge active={patient.is_active} />
        </div>

        {/* Tabs — horizontal scroll on mobile */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
          <style>{`.tab-scroll::-webkit-scrollbar{display:none}`}</style>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 16px', borderRadius: 8, border: `1px solid ${tab === t.id ? C.navy : C.gray200}`,
              cursor: 'pointer', fontSize: 13, fontWeight: tab === t.id ? 700 : 400, whiteSpace: 'nowrap', flexShrink: 0,
              background: tab === t.id ? C.navy : C.white,
              color: tab === t.id ? C.white : C.gray500,
              transition: 'all 0.2s ease',
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.gray200}`, padding: 'clamp(18px,3vw,28px)' }}>
          {tab === 'dados'       && <TabDados       patient={patient} onSave={loadPatient} showToast={showToast} />}
          {tab === 'plano'       && <TabPlano       patient={patient} activePlan={activePlan} onSave={loadPatient} showToast={showToast} />}
          {tab === 'exercicios'  && <TabExercicios  activePlan={activePlan} onSave={loadPatient} showToast={showToast} />}
          {tab === 'orientacoes' && <TabOrientacoes activePlan={activePlan} onSave={loadPatient} showToast={showToast} />}
          {tab === 'materiais'   && <TabMateriais   activePlan={activePlan} onSave={loadPatient} showToast={showToast} />}
          {tab === 'notas'       && <TabNotas       patient={patient} onSave={loadPatient} showToast={showToast} />}
          {tab === 'acesso'      && <TabAcesso      patient={patient} onSave={loadPatient} showToast={showToast} />}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

// ── TAB: Dados ─────────────────────────────────────────────
function TabDados({ patient, onSave, showToast }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ full_name: patient.full_name, phone: patient.phone || '', email: patient.email || '', notes: patient.notes || '' })

  async function save() {
    await fetch(`/api/patients/${patient.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setEditing(false); onSave(); showToast('Dados atualizados!')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ margin: 0, color: C.navy, fontSize: 16, fontWeight: 800 }}>Dados do Paciente</h3>
        {!editing
          ? <button onClick={() => setEditing(true)} style={{ padding: '8px 20px', background: C.navy, color: C.white, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, minHeight: 44, transition: 'all 0.2s ease' }}>Editar</button>
          : <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setEditing(false)} style={{ padding: '8px 16px', background: C.gray100, color: C.gray600, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, minHeight: 44, transition: 'all 0.2s ease' }}>Cancelar</button>
              <button onClick={save} style={{ padding: '8px 20px', background: C.green, color: C.white, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, minHeight: 44, transition: 'all 0.2s ease' }}>Salvar</button>
            </div>
        }
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 20 }}>
        {[['Nome completo', 'full_name'], ['Telefone', 'phone'], ['E-mail', 'email']].map(([lbl, key]) => (
          <div key={key}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{lbl}</label>
            {editing
              ? <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', minHeight: 48 }} />
              : <div style={{ fontSize: 14, color: C.gray700, padding: '10px 0', borderBottom: `1px solid ${C.gray100}` }}>{form[key] || '—'}</div>
            }
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Observações Clínicas</label>
        {editing
          ? <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={4} style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', resize: 'vertical', outline: 'none', minHeight: 100 }} />
          : <div style={{ fontSize: 14, color: C.gray700, lineHeight: 1.7 }}>{form.notes || '—'}</div>
        }
      </div>
    </div>
  )
}

// ── TAB: Plano ─────────────────────────────────────────────
function TabPlano({ patient, activePlan, onSave, showToast }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: activePlan?.title || '', description: activePlan?.description || '', welcome_message: activePlan?.welcome_message || '' })

  async function save() {
    if (activePlan) {
      await fetch(`/api/plans/${activePlan.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    } else {
      await fetch('/api/plans', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patient_id: patient.id, ...form }) })
    }
    setEditing(false); onSave(); showToast('Plano salvo!')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ margin: 0, color: C.navy, fontSize: 16, fontWeight: 800 }}>Plano de Tratamento</h3>
        {!editing
          ? <button onClick={() => setEditing(true)} style={{ padding: '8px 20px', background: C.navy, color: C.white, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, minHeight: 44, transition: 'all 0.2s ease' }}>{activePlan ? 'Editar Plano' : 'Criar Plano'}</button>
          : <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setEditing(false)} style={{ padding: '8px 16px', background: C.gray100, color: C.gray600, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, minHeight: 44, transition: 'all 0.2s ease' }}>Cancelar</button>
              <button onClick={save} style={{ padding: '8px 20px', background: C.green, color: C.white, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, minHeight: 44, transition: 'all 0.2s ease' }}>Salvar</button>
            </div>
        }
      </div>
      {editing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[['Título do Plano', 'title'], ['Mensagem de Boas-vindas ao Paciente', 'welcome_message']].map(([lbl, key]) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 6 }}>{lbl}</label>
              <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', minHeight: 48 }} />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 6 }}>Descrição do Plano</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', resize: 'vertical', outline: 'none' }} />
          </div>
        </div>
      ) : activePlan ? (
        <div>
          <div style={{ background: C.navy, borderRadius: 12, padding: 24, marginBottom: 20 }}>
            <div style={{ color: C.gold, fontSize: 12, letterSpacing: '1px', marginBottom: 8, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>Plano Ativo</div>
            <div style={{ color: C.white, fontSize: 20, fontWeight: 700, marginBottom: 8, fontFamily: 'sans-serif' }}>{activePlan.title}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.7, fontFamily: 'sans-serif' }}>{activePlan.description}</div>
          </div>
          {activePlan.welcome_message && (
            <div style={{ background: C.amberLight, borderRadius: 10, padding: '16px 20px', borderLeft: `3px solid ${C.amber}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#92400e', marginBottom: 4, fontFamily: 'sans-serif' }}>MENSAGEM AO PACIENTE</div>
              <div style={{ fontSize: 14, color: '#78350f', lineHeight: 1.7, fontFamily: 'sans-serif' }}>{activePlan.welcome_message}</div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 40, color: C.gray400, fontSize: 15 }}>Nenhum plano cadastrado. Clique em "Criar Plano".</div>
      )}
    </div>
  )
}

// ── TAB: Exercícios ────────────────────────────────────────
function TabExercicios({ activePlan, onSave, showToast }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', sets: 3, reps: '', frequency: 'Diária', observations: '', video_url: '' })

  const exercises = activePlan?.exercises || []

  async function add() {
    if (!activePlan) { showToast('Crie um plano primeiro.', 'error'); return }
    await fetch('/api/exercises', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan_id: activePlan.id, ...form }) })
    setShowForm(false)
    setForm({ title: '', description: '', sets: 3, reps: '', frequency: 'Diária', observations: '', video_url: '' })
    onSave(); showToast('Exercício adicionado!')
  }

  async function remove(exId) {
    await fetch(`/api/exercises/${exId}`, { method: 'DELETE' })
    onSave(); showToast('Exercício removido.')
  }

  const inp = (lbl, key, type = 'text') => (
    <div key={key}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 6 }}>{lbl}</label>
      <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', minHeight: 48 }} />
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ margin: 0, color: C.navy, fontSize: 16, fontWeight: 800 }}>Exercícios Prescritos ({exercises.length})</h3>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 20px', background: C.navy, color: C.white, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, minHeight: 44, transition: 'all 0.2s ease' }}>+ Adicionar</button>
      </div>

      {showForm && (
        <div style={{ background: C.gray50, borderRadius: 12, padding: 24, marginBottom: 24, border: `1px solid ${C.gray200}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 16, marginBottom: 16 }}>
            {inp('Título', 'title')}
            {inp('Frequência', 'frequency')}
            {inp('Séries', 'sets', 'number')}
            {inp('Repetições', 'reps')}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 6 }}>Descrição</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', resize: 'vertical', outline: 'none', minHeight: 100 }} />
          </div>
          {inp('Observações', 'observations')}
          <div style={{ marginTop: 12, marginBottom: 16 }}>{inp('Link do Vídeo (opcional)', 'video_url')}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={add} style={{ padding: '10px 24px', background: C.green, color: C.white, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700, minHeight: 44, transition: 'all 0.2s ease' }}>Salvar Exercício</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 16px', background: C.gray100, color: C.gray600, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, minHeight: 44, transition: 'all 0.2s ease' }}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {exercises.map((ex, i) => (
          <div key={ex.id} style={{ border: `1px solid ${C.gray200}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ background: C.navy, padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.navy, fontWeight: 700, fontSize: 13 }}>{i + 1}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{ex.title}</div>
              </div>
              <button onClick={() => remove(ex.id)} style={{ padding: '4px 12px', background: C.redLight, color: C.red, border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, minHeight: 44 }}>Remover</button>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                {[['Séries', ex.sets], ['Repetições', ex.reps], ['Frequência', ex.frequency]].map(([l, v]) => (
                  <div key={l} style={{ background: C.gray50, borderRadius: 8, padding: '6px 12px', border: `1px solid ${C.gray200}` }}>
                    <div style={{ fontSize: 10, color: C.gray400, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{v}</div>
                  </div>
                ))}
              </div>
              {ex.description && <p style={{ fontSize: 13, color: C.gray600, lineHeight: 1.7, margin: '0 0 8px' }}>{ex.description}</p>}
              {ex.observations && <div style={{ fontSize: 12, color: C.gray400, fontStyle: 'italic' }}>Obs: {ex.observations}</div>}
            </div>
          </div>
        ))}
        {exercises.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', padding: 40, color: C.gray400 }}>Nenhum exercício cadastrado.</div>
        )}
      </div>
    </div>
  )
}

// ── TAB: Orientações ───────────────────────────────────────
function TabOrientacoes({ activePlan, onSave, showToast }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ category: '', content: '' })
  const guidelines = activePlan?.guidelines || []

  async function add() {
    if (!activePlan) { showToast('Crie um plano primeiro.', 'error'); return }
    await fetch('/api/guidelines', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan_id: activePlan.id, ...form }) })
    setShowForm(false); setForm({ category: '', content: '' }); onSave(); showToast('Orientação adicionada!')
  }

  async function remove(gId) {
    await fetch(`/api/guidelines/${gId}`, { method: 'DELETE' }); onSave(); showToast('Orientação removida.')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ margin: 0, color: C.navy, fontSize: 16, fontWeight: 800 }}>Orientações do Dia a Dia ({guidelines.length})</h3>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 20px', background: C.navy, color: C.white, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, minHeight: 44, transition: 'all 0.2s ease' }}>+ Adicionar</button>
      </div>

      {showForm && (
        <div style={{ background: C.gray50, borderRadius: 12, padding: 24, marginBottom: 24, border: `1px solid ${C.gray200}` }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 6 }}>Categoria</label>
            <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Ex: Postura no trabalho" style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', minHeight: 48 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 6 }}>Orientação</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', resize: 'vertical', outline: 'none', minHeight: 100 }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={add} style={{ padding: '10px 24px', background: C.green, color: C.white, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700, minHeight: 44 }}>Salvar</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 16px', background: C.gray100, color: C.gray600, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, minHeight: 44 }}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {guidelines.map(g => (
          <div key={g.id} style={{ border: `1px solid ${C.gray200}`, borderRadius: 12, padding: '18px 22px', borderLeft: `4px solid ${C.gold}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{g.category}</div>
              <button onClick={() => remove(g.id)} style={{ padding: '4px 12px', background: C.redLight, color: C.red, border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, minHeight: 44 }}>Remover</button>
            </div>
            <div style={{ fontSize: 14, color: C.gray600, lineHeight: 1.8 }}>{g.content}</div>
          </div>
        ))}
        {guidelines.length === 0 && !showForm && <div style={{ textAlign: 'center', padding: 40, color: C.gray400 }}>Nenhuma orientação cadastrada.</div>}
      </div>
    </div>
  )
}

// ── TAB: Materiais ─────────────────────────────────────────
function TabMateriais({ activePlan, onSave, showToast }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', type: 'pdf', external_url: '' })
  const materials = activePlan?.materials || []

  async function add() {
    if (!activePlan) { showToast('Crie um plano primeiro.', 'error'); return }
    await fetch('/api/materials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan_id: activePlan.id, ...form }) })
    setShowForm(false); setForm({ title: '', type: 'pdf', external_url: '' }); onSave(); showToast('Material adicionado!')
  }

  async function remove(mId) {
    await fetch(`/api/materials/${mId}`, { method: 'DELETE' }); onSave(); showToast('Material removido.')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ margin: 0, color: C.navy, fontSize: 16, fontWeight: 800 }}>Materiais Complementares ({materials.length})</h3>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 20px', background: C.navy, color: C.white, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, minHeight: 44, transition: 'all 0.2s ease' }}>+ Adicionar</button>
      </div>

      {showForm && (
        <div style={{ background: C.gray50, borderRadius: 12, padding: 24, marginBottom: 24, border: `1px solid ${C.gray200}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 6 }}>Título</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', minHeight: 48 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 6 }}>Tipo</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, background: C.white, outline: 'none', minHeight: 48 }}>
                <option value="pdf">PDF</option>
                <option value="video">Vídeo</option>
                <option value="image">Imagem</option>
                <option value="link">Link</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 6 }}>URL / Link</label>
            <input value={form.external_url} onChange={e => setForm({ ...form, external_url: e.target.value })} placeholder="https://..." style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', minHeight: 48 }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={add} style={{ padding: '10px 24px', background: C.green, color: C.white, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700, minHeight: 44 }}>Salvar</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 16px', background: C.gray100, color: C.gray600, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, minHeight: 44 }}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {materials.map(m => (
          <div key={m.id} style={{ border: `1px solid ${C.gray200}`, borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: C.gold, fontSize: 11, fontWeight: 700 }}>{m.type.toUpperCase()}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{m.title}</div>
              <div style={{ fontSize: 12, color: C.gray400, marginTop: 2 }}>{m.external_url || m.file_url || '—'}</div>
            </div>
            <button onClick={() => remove(m.id)} style={{ padding: '6px 12px', background: C.redLight, color: C.red, border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, minHeight: 44 }}>Remover</button>
          </div>
        ))}
        {materials.length === 0 && !showForm && <div style={{ textAlign: 'center', padding: 40, color: C.gray400 }}>Nenhum material cadastrado.</div>}
      </div>
    </div>
  )
}

// ── TAB: Notas Internas ────────────────────────────────────
function TabNotas({ patient, onSave, showToast }) {
  const [note, setNote] = useState('')
  const notes = patient.admin_notes || []

  async function add() {
    if (!note.trim()) return
    await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patient_id: patient.id, note }) })
    setNote(''); onSave(); showToast('Nota salva!')
  }

  return (
    <div>
      <h3 style={{ margin: '0 0 24px', color: C.navy, fontSize: 16, fontWeight: 800 }}>Notas Internas (visíveis apenas para você)</h3>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Adicionar nota clínica interna..." rows={3} style={{ flex: 1, padding: '10px 14px', border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, resize: 'vertical', outline: 'none', minHeight: 100 }} />
        <button onClick={add} style={{ padding: '10px 20px', background: C.navy, color: C.white, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, alignSelf: 'flex-end', whiteSpace: 'nowrap', minHeight: 44 }}>Salvar</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {notes.map(n => (
          <div key={n.id} style={{ background: C.amberLight, border: `1px solid ${C.amber}30`, borderRadius: 10, padding: '14px 18px' }}>
            <div style={{ fontSize: 11, color: '#92400e', marginBottom: 6, fontFamily: 'sans-serif' }}>{n.created_at?.slice(0, 10)}</div>
            <div style={{ fontSize: 14, color: '#78350f', lineHeight: 1.7, fontFamily: 'sans-serif' }}>{n.note}</div>
          </div>
        ))}
        {notes.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: C.gray400 }}>Nenhuma nota interna.</div>}
      </div>
    </div>
  )
}

// ── TAB: Acesso ────────────────────────────────────────────
function TabAcesso({ patient, onSave, showToast }) {
  const [newPass, setNewPass] = useState('')

  async function reset() {
    if (!newPass || newPass.length < 4) { showToast('Senha muito curta (mínimo 4 caracteres).', 'error'); return }
    await fetch(`/api/patients/${patient.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: newPass }) })
    setNewPass(''); showToast('Senha redefinida com sucesso!')
  }

  return (
    <div>
      <h3 style={{ margin: '0 0 24px', color: C.navy, fontSize: 16, fontWeight: 800 }}>Gerenciamento de Acesso</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 24 }}>
        <div style={{ background: C.gray50, borderRadius: 12, padding: 24, border: `1px solid ${C.gray200}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 16 }}>Credenciais Atuais</div>
          {[['Login (username)', patient.username], ['Senha', '••••••••']].map(([l, v]) => (
            <div key={l} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gray400, marginBottom: 4 }}>{l}</div>
              <div style={{ fontSize: 15, color: C.gray800, fontFamily: 'monospace', background: C.white, padding: '8px 12px', borderRadius: 6, border: `1px solid ${C.gray200}` }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ background: C.gray50, borderRadius: 12, padding: 24, border: `1px solid ${C.gray200}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 16 }}>Redefinir Senha</div>
          <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Nova senha..." style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.gray200}`, borderRadius: 8, fontSize: 14, boxSizing: 'border-box', marginBottom: 12, outline: 'none', minHeight: 48 }} />
          <button onClick={reset} style={{ width: '100%', padding: 10, background: C.amber, color: '#78350f', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Redefinir Senha</button>
        </div>
      </div>
    </div>
  )
}
