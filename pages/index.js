import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { C } from '../lib/colors'

const T = {
  sans: "'Montserrat', system-ui, sans-serif",
  serif: "'Montserrat', sans-serif",
  green: '#22c55e',
  navy: '#111827',
  navyDeep: '#0d1117',
  cream: '#f5f5f0',
  phone: '(35) 99873-2804',
  rSm: 8, rMd: 12, rLg: 18, rXl: 24,
  shadowSm: '0 2px 12px rgba(17,24,39,0.07)',
  shadowMd: '0 8px 28px rgba(17,24,39,0.12)',
  shadowLg: '0 20px 56px rgba(17,24,39,0.18)',
  shadowGold: '0 8px 32px rgba(34,197,94,0.28)',
}

const eyebrow = {
  color: T.green, fontSize: 11, fontFamily: T.sans,
  letterSpacing: '2.5px', textTransform: 'uppercase',
  display: 'block', marginBottom: 12,
}

export default function Home() {
  const router = useRouter()
  const go = () => router.push('/login')
  return (
    <>
      <Head>
        <title>Dr. Pablo Andrade | Fisioterapia e Quiropraxia</title>
        <meta name="description" content="Fisioterapia e Quiropraxia em Três Pontas, MG. Acompanhamento individual e área exclusiva para cada paciente." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; overflow-x: hidden; }
        img { max-width: 100%; }
        /* Nav links hidden on mobile */
        .nav-links { display: flex; }
        @media (max-width: 640px) {
          .nav-links { display: none; }
          .hero-stats { gap: 0 !important; }
          .hero-stats > div { padding: 0 14px !important; }
          .two-col { flex-direction: column !important; }
          .two-col-rev { flex-direction: column-reverse !important; }
          .mobile-center { text-align: center !important; }
          .mobile-full { width: 100% !important; flex: none !important; max-width: 100% !important; min-width: 0 !important; }
          .mobile-hide { display: none !important; }
        }
      `}</style>
      <div style={{ fontFamily: T.serif, background: C.white, minHeight: '100vh', overflowX: 'hidden' }}>
        <Nav onLogin={go} />
        <Hero onLogin={go} />
        <HowItWorks />
        <PatientArea />
        <Clinic />
        <About onLogin={go} />
        <Location />
        <CTA onLogin={go} />
        <Footer />
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════
   NAV — mobile hamburger
══════════════════════════════════════════════ */
function Nav({ onLogin }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled || menuOpen ? 'rgba(17,24,39,0.98)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(34,197,94,0.18)' : 'none',
        transition: 'all 0.35s ease',
        padding: '0 clamp(1rem, 4vw, 3rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: T.navy, fontWeight: 800, fontSize: 13, fontFamily: T.sans }}>PA</span>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 13, fontFamily: T.sans, lineHeight: 1.2 }}>Dr. Pablo Andrade</div>
            <div style={{ color: T.green, fontSize: 10, fontFamily: T.sans, letterSpacing: '0.5px' }}>Fisioterapia e Quiropraxia</div>
          </div>
        </div>

        {/* Desktop links */}
        <div className="nav-links" style={{ gap: '1.4rem', alignItems: 'center' }}>
          {['Início', 'Como Funciona', 'Sobre', 'Localização'].map(s => (
            <a key={s} href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13, fontFamily: T.sans, fontWeight: 500 }}>{s}</a>
          ))}
          <button onClick={onLogin} style={{ background: T.green, color: T.navy, border: 'none', padding: '8px 22px', borderRadius: T.rSm, fontWeight: 800, fontSize: 13, fontFamily: T.sans, cursor: 'pointer' }}>
            Entrar
          </button>
        </div>

        {/* Mobile: Entrar button + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onLogin} style={{ background: T.green, color: T.navy, border: 'none', padding: '8px 18px', borderRadius: T.rSm, fontWeight: 700, fontSize: 13, fontFamily: T.sans, cursor: 'pointer', display: 'none' }}
            className="mobile-show">
            Entrar
          </button>
          {/* Hamburger — visible only on mobile via inline responsive trick */}
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', flexDirection: 'column', gap: 5 }}
            aria-label="Menu">
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 22, height: 2, background: '#fff', borderRadius: 2, transition: 'all 0.3s',
                transform: menuOpen && i === 0 ? 'rotate(45deg) translate(5px,5px)' : menuOpen && i === 2 ? 'rotate(-45deg) translate(5px,-5px)' : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 199, background: 'rgba(17,24,39,0.98)', backdropFilter: 'blur(16px)', padding: '20px 1.5rem 28px', borderBottom: `1px solid rgba(34,197,94,0.2)` }}>
          {['Início', 'Como Funciona', 'Sobre', 'Localização'].map(s => (
            <a key={s} href="#" onClick={() => setMenuOpen(false)} style={{ display: 'block', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 16, fontFamily: T.sans, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{s}</a>
          ))}
          <button onClick={() => { setMenuOpen(false); onLogin() }} style={{ marginTop: 20, width: '100%', background: T.green, color: T.navy, border: 'none', padding: '14px', borderRadius: T.rMd, fontWeight: 700, fontSize: 15, fontFamily: T.sans, cursor: 'pointer' }}>
            Entrar na Minha Área
          </button>
          <a href={`tel:+553599873-2804`} style={{ display: 'block', textAlign: 'center', marginTop: 14, color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: T.sans, textDecoration: 'none' }}>
            {T.phone}
          </a>
        </div>
      )}
    </>
  )
}

/* ══════════════════════════════════════════════
   HERO
══════════════════════════════════════════════ */
function Hero({ onLogin }) {
  return (
    <div style={{ minHeight: '100svh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(96px, 14vw, 140px) clamp(1.25rem, 5vw, 4rem) clamp(56px, 8vw, 96px)' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <img src="/consultorio.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 70%', filter: 'brightness(0.52)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(10,15,30,0.92) 0%, rgba(13,17,23,0.85) 50%, rgba(17,24,39,0.75) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to top, rgba(13,17,23,0.7) 0%, transparent 100%)' }} />
      </div>

      <div style={{ maxWidth: 820, textAlign: 'center', position: 'relative', zIndex: 2, width: '100%' }}>
        {/* Eyebrow */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.13)', border: '1px solid rgba(34,197,94,0.38)', borderRadius: 28, padding: '6px 16px', marginBottom: 28 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.green, flexShrink: 0 }} />
          <span style={{ color: T.green, fontSize: 10, fontFamily: T.sans, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Fisioterapia · Quiropraxia · Três Pontas, MG</span>
        </div>

        <h1 style={{ color: '#fff', fontSize: 'clamp(2.2rem, 8vw, 4.5rem)', lineHeight: 1.1, margin: '0 0 20px', fontWeight: 800, letterSpacing: '-1px' }}>
          Seu tratamento,<br />
          <em style={{ color: T.green, fontStyle: 'italic', textShadow: '0 0 40px rgba(34,197,94,0.4)' }}>acompanhado com precisão</em>
        </h1>

        <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 'clamp(15px, 2vw, 18px)', maxWidth: 480, margin: '0 auto 52px', lineHeight: 1.9, fontFamily: T.sans }}>
          Uma área exclusiva e personalizada para cada paciente — exercícios, orientações e materiais sempre atualizados.
        </p>

        {/* CTA principal — mais forte, mais espaçoso */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <button onClick={onLogin} style={{
            background: T.green, color: T.navy, border: 'none',
            padding: 'clamp(16px,2.5vw,20px) clamp(40px,7vw,64px)',
            borderRadius: T.rMd, fontSize: 'clamp(16px,2vw,18px)',
            fontWeight: 800, fontFamily: T.sans, cursor: 'pointer', letterSpacing: '0.3px',
            boxShadow: '0 12px 48px rgba(34,197,94,0.55), 0 4px 16px rgba(0,0,0,0.25)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            minHeight: 56, width: 'clamp(200px, 80%, 400px)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 64px rgba(34,197,94,0.65), 0 6px 20px rgba(0,0,0,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 12px 48px rgba(34,197,94,0.55), 0 4px 16px rgba(0,0,0,0.25)' }}>
            Acessar Minha Área →
          </button>
          <a href={`tel:+5535998732804`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(13px,1.6vw,14px)', fontFamily: T.sans, textDecoration: 'none' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.68 19.79 19.79 0 01.06 1.1 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
            Ligar: {T.phone}
          </a>
        </div>

        {/* Stats — hidden on very small screens, shown from 480px */}
        <div className="hero-stats" style={{ display: 'flex', justifyContent: 'center', marginTop: 60, paddingTop: 36, borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: 0 }}>
          {[['100%', 'Personalizado'], ['24h', 'Acesso'], ['Seguro', 'Por Paciente'], ['Sempre', 'Atualizado']].map(([val, lbl], i, arr) => (
            <div key={lbl} style={{ textAlign: 'center', padding: '0 clamp(12px, 3vw, 32px)', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <div style={{ color: T.green, fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: 700, fontFamily: T.sans }}>{val}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, fontFamily: T.sans, marginTop: 4, letterSpacing: '0.8px', textTransform: 'uppercase' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   HOW IT WORKS
══════════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    { num: '01', title: 'Consulta e Avaliação', desc: 'O Dr. Pablo realiza sua avaliação completa e define o protocolo de tratamento personalizado.' },
    { num: '02', title: 'Acesso Criado', desc: 'Você recebe login e senha exclusivos para acessar sua área individual na plataforma.' },
    { num: '03', title: 'Seu Plano Digital', desc: 'Exercícios, orientações e materiais adicionados e atualizados conforme sua evolução.' },
    { num: '04', title: 'Acompanhamento Contínuo', desc: 'Acesse quando quiser, pelo celular ou computador, seguindo seu protocolo com clareza.' },
  ]
  return (
    <section style={{ padding: 'clamp(64px, 10vw, 112px) clamp(1.25rem, 5vw, 4rem)', background: T.cream }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span style={eyebrow}>Processo</span>
          <h2 style={{ color: T.navy, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.3px' }}>Como funciona</h2>
          <p style={{ color: C.gray500, fontSize: 'clamp(15px,1.8vw,17px)', fontFamily: T.sans, maxWidth: 440, margin: '0 auto', lineHeight: 1.75 }}>Simples para o paciente. Poderoso para o fisioterapeuta.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))', gap: 20 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ padding: 'clamp(28px,4vw,44px) clamp(20px,3vw,32px)', background: C.white, borderRadius: T.rLg, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid rgba(17,24,39,0.05)', borderTop: '3px solid #22c55e', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '50%', background: T.navy, marginBottom: 20, boxShadow: '0 4px 16px rgba(34,197,94,0.3)' }}>
                <span style={{ color: T.green, fontWeight: 700, fontSize: 15, fontFamily: T.sans }}>{s.num}</span>
              </div>
              <h3 style={{ color: T.navy, fontSize: 'clamp(15px,1.6vw,17px)', margin: '0 0 8px', fontWeight: 600, fontFamily: T.sans }}>{s.title}</h3>
              <p style={{ color: C.gray500, fontSize: 'clamp(13px,1.4vw,14.5px)', lineHeight: 1.8, fontFamily: T.sans, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   PATIENT AREA
══════════════════════════════════════════════ */
function PatientArea() {
  const items = [
    { num: '01', title: 'Exercícios Prescritos', desc: 'Séries, repetições, frequência e observações detalhadas para cada exercício.' },
    { num: '02', title: 'Orientações do Dia a Dia', desc: 'Cuidados posturais, hábitos e recomendações específicas para sua recuperação.' },
    { num: '03', title: 'Materiais Complementares', desc: 'PDFs, vídeos e links selecionados para apoiar seu tratamento.' },
    { num: '04', title: 'Acesso Individual e Seguro', desc: 'Apenas você acessa sua área, com privacidade total garantida.' },
    { num: '05', title: 'Sempre Atualizado', desc: 'O Dr. Pablo atualiza seu plano conforme sua evolução. Em tempo real.' },
    { num: '06', title: 'Disponível no Celular', desc: 'Acesse exercícios e orientações de qualquer lugar, a qualquer hora.' },
  ]
  return (
    <section style={{ padding: 'clamp(64px, 10vw, 112px) clamp(1.25rem, 5vw, 4rem)', background: C.white }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span style={eyebrow}>Sua área exclusiva</span>
          <h2 style={{ color: T.navy, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.3px' }}>O que você encontra no portal</h2>
          <p style={{ color: C.gray500, fontSize: 'clamp(15px,1.8vw,17px)', fontFamily: T.sans, maxWidth: 480, margin: '0 auto', lineHeight: 1.75 }}>Tudo organizado para seguir seu tratamento com clareza.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))', gap: 18 }}>
          {items.map((item, i) => (
            <div key={i} style={{ padding: 'clamp(22px,3vw,30px) clamp(18px,2.5vw,28px)', border: `1px solid ${C.gray200}`, borderRadius: T.rLg, background: C.white, transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.14)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: T.rSm, background: T.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: T.green, fontFamily: T.sans, fontWeight: 700, fontSize: 11 }}>{item.num}</span>
                </div>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(34,197,94,0.3), transparent)' }} />
              </div>
              <h3 style={{ color: T.navy, fontSize: 'clamp(14px,1.5vw,16px)', margin: '0 0 8px', fontFamily: T.sans, fontWeight: 600 }}>{item.title}</h3>
              <p style={{ color: C.gray500, fontSize: 'clamp(13px,1.3vw,14px)', lineHeight: 1.8, fontFamily: T.sans, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   CLINIC — consultório foto
══════════════════════════════════════════════ */
function Clinic() {
  const points = [
    'Equipado para fisioterapia ortopédica e quiropraxia',
    'Atendimento 100% individual e personalizado',
    'Ambiente projetado para conforto e recuperação',
    'Privacidade e exclusividade em cada sessão',
  ]
  return (
    <section style={{ padding: 'clamp(64px, 10vw, 112px) clamp(1.25rem, 5vw, 4rem)', background: T.cream }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div className="two-col" style={{ display: 'flex', gap: 'clamp(32px, 6vw, 72px)', alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Image */}
          <div className="mobile-full" style={{ flex: '0 0 clamp(280px, 46%, 500px)', position: 'relative' }}>
            <div className="mobile-hide" style={{ position: 'absolute', top: -18, left: -18, width: 72, height: 72, border: `1.5px solid ${T.green}`, borderRadius: T.rMd, opacity: 0.4, zIndex: 0 }} />
            <div className="mobile-hide" style={{ position: 'absolute', bottom: -14, right: -14, width: 48, height: 48, background: T.green, borderRadius: T.rSm, opacity: 0.18, zIndex: 0 }} />
            <div style={{ borderRadius: T.rXl, overflow: 'hidden', boxShadow: T.shadowLg, position: 'relative', zIndex: 2 }}>
              <img src="/consultorio.jpg" alt="Consultório Dr. Pablo Andrade"
                style={{ width: '100%', height: 'clamp(240px, 42vw, 480px)', objectFit: 'cover', objectPosition: 'center 42%', display: 'block' }} />
            </div>
          </div>

          {/* Text */}
          <div className="mobile-full" style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
            <span style={eyebrow}>Estrutura</span>
            <h2 style={{ color: T.navy, fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800, margin: '0 0 18px', lineHeight: 1.2, letterSpacing: '-0.3px' }}>
              Um ambiente preparado<br />para o seu atendimento
            </h2>
            <p style={{ color: C.gray600, fontSize: 'clamp(14px,1.6vw,16px)', lineHeight: 2.0, fontFamily: T.sans, marginBottom: 26 }}>
              O consultório foi projetado para oferecer conforto, privacidade e todos os recursos necessários. Cada detalhe reflete o mesmo cuidado que o Dr. Pablo dedica ao tratamento de cada paciente.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {points.map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: T.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.green }} />
                  </div>
                  <span style={{ fontSize: 'clamp(13px,1.4vw,15px)', color: C.gray700, fontFamily: T.sans, lineHeight: 1.65 }}>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   ABOUT — fisioterapeuta
══════════════════════════════════════════════ */
function About({ onLogin }) {
  const specialties = ['Reabilitação Ortopédica', 'Quiropraxia', 'Fisioterapia Esportiva', 'Coluna e Postura', 'Pós-Operatório']
  return (
    <section style={{ padding: 'clamp(64px, 10vw, 112px) clamp(1.25rem, 5vw, 4rem)', background: T.navy, position: 'relative', overflow: 'hidden' }}>
      <div className="mobile-hide" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '36%', opacity: 0.06, pointerEvents: 'none' }}>
        <img src="/consultorio.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'left center' }} />
      </div>

      <div style={{ maxWidth: 1040, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div className="two-col" style={{ display: 'flex', gap: 'clamp(36px, 6vw, 80px)', alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Photo — centered on mobile */}
          <div className="mobile-full mobile-center" style={{ flex: '0 0 auto', textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ position: 'absolute', inset: -5, borderRadius: 22, border: '1px solid rgba(34,197,94,0.22)', zIndex: 0 }} />
              <div style={{ width: 'clamp(180px, 24vw, 248px)', height: 'clamp(230px, 30vw, 316px)', borderRadius: 18, overflow: 'hidden', border: `2.5px solid ${T.green}`, boxShadow: '0 24px 64px rgba(0,0,0,0.4)', position: 'relative', zIndex: 1 }}>
                <img src="/pablo.jpg" alt="Dr. Pablo Andrade"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 12%', display: 'block' }} />
              </div>
              <div style={{ position: 'absolute', bottom: -8, right: -8, width: 26, height: 26, borderRadius: '50%', background: T.green, opacity: 0.6, zIndex: 2 }} />
            </div>
            <div style={{ marginTop: 18, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: T.rMd, padding: '11px 18px', display: 'inline-block' }}>
              <div style={{ color: T.green, fontWeight: 700, fontSize: 14.5, fontFamily: T.sans }}>Dr. Pablo Andrade</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11.5, fontFamily: T.sans, marginTop: 2 }}>Fisioterapeuta · Quiropraxista</div>
            </div>
          </div>

          {/* Text */}
          <div className="mobile-full" style={{ flex: 1, minWidth: 0 }}>
            <span style={{ ...eyebrow, color: T.green }}>Quem vai acompanhar seu tratamento</span>
            <h2 style={{ color: '#fff', fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800, margin: '0 0 18px', lineHeight: 1.2, letterSpacing: '-0.3px' }}>
              Cuidado com propósito<br />e precisão
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 'clamp(14px,1.5vw,15.5px)', lineHeight: 1.9, fontFamily: T.sans, marginBottom: 20 }}>
              Especializado em fisioterapia ortopédica e quiropraxia, com foco no acompanhamento individualizado. Acredito que um tratamento de excelência vai além da clínica — ele deve fazer parte da rotina do paciente.
            </p>
            <blockquote style={{ margin: '0 0 26px', padding: '18px 22px', borderLeft: '4px solid #22c55e', background: 'rgba(34,197,94,0.08)', borderRadius: `0 ${T.rSm}px ${T.rSm}px 0` }}>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(13px,1.4vw,15px)', lineHeight: 1.85, fontFamily: T.serif, fontStyle: 'italic', margin: 0 }}>
                "Seu acompanhamento será conduzido com atenção, clareza e foco em um plano organizado para a sua evolução."
              </p>
            </blockquote>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 28 }}>
              {specialties.map(esp => (
                <span key={esp} style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '5px 12px', color: T.green, fontSize: 11.5, fontFamily: T.sans, transition: 'all 0.2s ease' }}>{esp}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <button onClick={onLogin} style={{ background: T.green, color: T.navy, border: 'none', padding: '12px 30px', borderRadius: T.rMd, fontSize: 14, fontWeight: 700, fontFamily: T.sans, cursor: 'pointer', boxShadow: T.shadowGold }}>
                Acessar Minha Área
              </button>
              <a href={`tel:+5535998732804`} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: T.sans, textDecoration: 'none' }}>
                {T.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   LOCATION
══════════════════════════════════════════════ */
function Location() {
  return (
    <section style={{ padding: 'clamp(64px, 10vw, 112px) clamp(1.25rem, 5vw, 4rem)', background: T.cream }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <span style={eyebrow}>Localização</span>
          <h2 style={{ color: T.navy, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 400, margin: '0 0 10px', letterSpacing: '-0.3px' }}>Onde nos encontrar</h2>
          <p style={{ color: C.gray500, fontSize: 'clamp(14px,1.6vw,16px)', fontFamily: T.sans }}>Dr. Pablo Andrade · Fisioterapia e Quiropraxia · Três Pontas, MG</p>
        </div>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
          {[['Localização', 'Três Pontas, MG'], ['Telefone', T.phone], ['Especialidade', 'Fisioterapia e Quiropraxia']].map(([label, info]) => (
            <div key={label} style={{ background: C.white, padding: 'clamp(14px,2vw,18px) clamp(18px,3vw,28px)', borderRadius: T.rLg, boxShadow: T.shadowSm, textAlign: 'center', minWidth: 0, flex: '1 1 160px', maxWidth: 240, border: `1px solid ${C.gray200}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.green, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, fontFamily: T.sans }}>{label}</div>
              {label === 'Telefone'
                ? <a href={`tel:+5535998732804`} style={{ color: T.navy, fontFamily: T.sans, fontSize: 'clamp(13px,1.4vw,15px)', fontWeight: 600, textDecoration: 'none' }}>{info}</a>
                : <div style={{ color: T.navy, fontFamily: T.sans, fontSize: 'clamp(13px,1.4vw,15px)', fontWeight: 600 }}>{info}</div>
              }
            </div>
          ))}
        </div>
        <div style={{ borderRadius: T.rXl, overflow: 'hidden', boxShadow: T.shadowLg, border: `1px solid ${C.gray200}` }}>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3756.3!2d-45.5!3d-21.37!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x6b373ad9a0cbf4ee!2sDr.+Pablo+Andrade+%7C+Fisioterapia+e+Quiropraxia+em+Tr%C3%AAs+Pontas!5e0!3m2!1spt-BR!2sbr!4v1"
            width="100%" height="380" style={{ border: 0, display: 'block' }} allowFullScreen="" loading="lazy" title="Localização Dr. Pablo Andrade" />
        </div>
        <div style={{ textAlign: 'center', marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://www.google.com/maps/place/Dr.+Pablo+Andrade+%7C+Fisioterapia+e+Quiropraxia+em+Tr%C3%AAs+Pontas/data=!4m2!3m1!1s0x0:0x6b373ad9a0cbf4ee" target="_blank" rel="noreferrer"
            style={{ display: 'inline-block', background: T.navy, color: '#fff', padding: '12px 28px', borderRadius: T.rMd, fontSize: 14, fontFamily: T.sans, fontWeight: 600, boxShadow: T.shadowMd, textDecoration: 'none' }}>
            Abrir no Google Maps
          </a>
          <a href={`tel:+5535998732804`}
            style={{ display: 'inline-block', background: T.green, color: T.navy, padding: '12px 28px', borderRadius: T.rMd, fontSize: 14, fontFamily: T.sans, fontWeight: 700, boxShadow: T.shadowGold, textDecoration: 'none' }}>
            Ligar: {T.phone}
          </a>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   CTA FINAL
══════════════════════════════════════════════ */
function CTA({ onLogin }) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <img src="/pablo.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 18%', filter: 'brightness(0.42)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13,17,23,0.94) 0%, rgba(17,24,39,0.86) 55%, rgba(31,41,55,0.94) 100%)' }} />
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${T.green}, transparent)`, opacity: 0.5 }} />

      <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(72px, 10vw, 112px) clamp(1.25rem, 5vw, 4rem)', textAlign: 'center' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <span style={{ ...eyebrow, marginBottom: 14 }}>Área do Paciente</span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(30px, 6vw, 52px)', fontWeight: 800, margin: '0 0 18px', lineHeight: 1.15, letterSpacing: '-0.4px' }}>
            Acesse sua área exclusiva
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(14px,1.8vw,17px)', lineHeight: 1.85, fontFamily: T.sans, marginBottom: 40 }}>
            Seus exercícios e orientações estão disponíveis. Acesse com o login e senha fornecidos pelo Dr. Pablo.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onLogin} style={{
            background: T.green, color: T.navy, border: 'none',
            padding: 'clamp(18px,2.8vw,24px) clamp(48px,8vw,80px)',
            borderRadius: T.rMd, fontSize: 'clamp(17px,2.2vw,21px)',
            fontWeight: 800, fontFamily: T.sans, cursor: 'pointer', letterSpacing: '0.3px',
            boxShadow: '0 12px 40px rgba(34,197,94,0.45)',
            minHeight: 60, transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 18px 56px rgba(34,197,94,0.6)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(34,197,94,0.45)' }}>
              Entrar na Minha Área
            </button>
            <a href={`tel:+5535998732804`} style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', padding: 'clamp(13px,2vw,17px) clamp(20px,3vw,32px)', borderRadius: T.rMd, fontSize: 'clamp(13px,1.5vw,15px)', fontFamily: T.sans, textDecoration: 'none', backdropFilter: 'blur(6px)' }}>
              {T.phone}
            </a>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, fontFamily: T.sans, marginTop: 20 }}>
            Não possui acesso? Ligue ou entre em contato com o fisioterapeuta.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ background: T.navyDeep, padding: 'clamp(32px,5vw,48px) clamp(1.25rem, 5vw, 4rem)', borderTop: `1px solid rgba(34,197,94,0.14)` }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div style={{ color: T.green, fontWeight: 800, fontSize: 15, fontFamily: T.sans, marginBottom: 4 }}>Dr. Pablo Andrade</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12.5, fontFamily: T.sans }}>Fisioterapia e Quiropraxia · Três Pontas, MG</div>
          <a href={`tel:+5535998732804`} style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: T.sans, textDecoration: 'none', marginTop: 4, display: 'block' }}>{T.phone}</a>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11.5, fontFamily: T.sans, textAlign: 'right' }}>
          © 2025 Dr. Pablo Andrade.<br />Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
