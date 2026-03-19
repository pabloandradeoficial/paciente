import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { C } from '../lib/colors'

const S = {
  sans: 'system-ui, -apple-system, sans-serif',
  serif: "'Georgia', serif",
}

export default function Home() {
  const router = useRouter()
  const go = () => router.push('/login')

  return (
    <>
      <Head>
        <title>Dr. Pablo Andrade | Fisioterapia e Quiropraxia</title>
        <meta name="description" content="Fisioterapia e Quiropraxia em Três Pontas, MG. Acompanhamento individual, plano personalizado e área exclusiva para cada paciente." />
      </Head>
      <div style={{ fontFamily: S.serif, background: C.white, minHeight: '100vh' }}>
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

function Nav({ onLogin }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(26,39,68,0.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : 'none',
      transition: 'all 0.35s ease',
      padding: '0 clamp(1.5rem, 4vw, 3rem)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: C.navy, fontWeight: 700, fontSize: 13, fontFamily: S.sans }}>PA</span>
        </div>
        <div>
          <div style={{ color: C.white, fontWeight: 700, fontSize: 14, fontFamily: S.sans, lineHeight: 1.2 }}>Dr. Pablo Andrade</div>
          <div style={{ color: C.gold, fontSize: 11, fontFamily: S.sans, letterSpacing: '0.5px' }}>Fisioterapia e Quiropraxia</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1.8rem', alignItems: 'center' }}>
        {['Início', 'Como Funciona', 'Sobre', 'Localização'].map(s => (
          <a key={s} href="#" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: 14, fontFamily: S.sans }}>{s}</a>
        ))}
        <button onClick={onLogin} style={{ background: C.gold, color: C.navy, border: 'none', padding: '9px 22px', borderRadius: 7, fontWeight: 700, fontSize: 14, fontFamily: S.sans, cursor: 'pointer' }}>
          Entrar
        </button>
      </div>
    </nav>
  )
}

function Hero({ onLogin }) {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(80px, 12vw, 120px) clamp(1.5rem, 5vw, 4rem) 5rem' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <img src="/consultorio.jpg" alt="Consultório Dr. Pablo Andrade" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(16,25,52,0.94) 0%, rgba(20,30,60,0.88) 45%, rgba(26,39,68,0.72) 100%)' }} />
      </div>

      <div style={{ maxWidth: 860, textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.35)', borderRadius: 24, padding: '7px 18px', marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold, flexShrink: 0 }} />
          <span style={{ color: C.gold, fontSize: 12, fontFamily: S.sans, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Fisioterapia e Quiropraxia — Três Pontas, MG</span>
        </div>

        <h1 style={{ color: C.white, fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', lineHeight: 1.15, margin: '0 0 20px', fontWeight: 400, letterSpacing: '-0.5px' }}>
          Seu tratamento,<br />
          <span style={{ color: C.gold, fontStyle: 'italic' }}>acompanhado com precisão</span>
        </h1>

        <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 'clamp(16px, 2vw, 19px)', maxWidth: 580, margin: '0 auto 44px', lineHeight: 1.85, fontFamily: S.sans }}>
          Uma área exclusiva e personalizada para cada paciente — exercícios, orientações e materiais sempre atualizados, direto do fisioterapeuta para você.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onLogin} style={{ background: C.gold, color: C.navy, border: 'none', padding: '15px 40px', borderRadius: 9, fontSize: 16, fontWeight: 700, fontFamily: S.sans, cursor: 'pointer' }}>
            Acessar Minha Área
          </button>
          <button style={{ background: 'rgba(255,255,255,0.08)', color: C.white, border: '1px solid rgba(255,255,255,0.3)', padding: '15px 36px', borderRadius: 9, fontSize: 16, fontFamily: S.sans, cursor: 'pointer' }}>
            Saiba Mais
          </button>
        </div>

        <div style={{ display: 'flex', gap: 0, justifyContent: 'center', marginTop: 64, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 36 }}>
          {[['100%', 'Personalizado'], ['24h', 'Acesso Digital'], ['Seguro', 'Por Paciente'], ['Sempre', 'Atualizado']].map(([num, label], i) => (
            <div key={label} style={{ textAlign: 'center', padding: '0 28px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
              <div style={{ color: C.gold, fontSize: 22, fontWeight: 700, fontFamily: S.sans }}>{num}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: S.sans, marginTop: 4, letterSpacing: '0.8px', textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HowItWorks() {
  const steps = [
    { num: '01', title: 'Consulta e Avaliação', desc: 'O Dr. Pablo realiza sua avaliação completa e define o protocolo de tratamento personalizado.' },
    { num: '02', title: 'Acesso Criado', desc: 'Você recebe login e senha exclusivos para acessar sua área individual na plataforma.' },
    { num: '03', title: 'Seu Plano Digital', desc: 'Exercícios, orientações e materiais são adicionados e atualizados conforme sua evolução.' },
    { num: '04', title: 'Acompanhamento Contínuo', desc: 'Acesse quando quiser, pelo celular ou computador, seguindo seu protocolo com clareza.' },
  ]
  return (
    <section style={{ padding: 'clamp(72px, 10vw, 110px) clamp(1.5rem, 5vw, 4rem)', background: '#f4f2ec' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ color: C.gold, fontSize: 11, fontFamily: S.sans, letterSpacing: '2.5px', textTransform: 'uppercase' }}>Processo</span>
          <h2 style={{ color: C.navy, fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 400, margin: '10px 0 12px', letterSpacing: '-0.3px' }}>Como funciona</h2>
          <p style={{ color: C.gray500, fontSize: 17, fontFamily: S.sans, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>Simples para o paciente, poderoso para o fisioterapeuta</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '40px 28px 36px', background: C.white, borderRadius: 18, boxShadow: '0 2px 20px rgba(26,39,68,0.07)', border: '1px solid rgba(26,39,68,0.05)' }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', color: C.gold, fontWeight: 700, fontSize: 17, fontFamily: S.sans }}>{s.num}</div>
              <h3 style={{ color: C.navy, fontSize: 17, margin: '0 0 10px', fontWeight: 600, fontFamily: S.sans }}>{s.title}</h3>
              <p style={{ color: C.gray500, fontSize: 14, lineHeight: 1.8, fontFamily: S.sans, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PatientArea() {
  const items = [
    { mark: '01', title: 'Exercícios Prescritos', desc: 'Séries, repetições, frequência e observações para cada exercício do seu plano.' },
    { mark: '02', title: 'Orientações do Dia a Dia', desc: 'Cuidados posturais, hábitos e recomendações específicas para a sua recuperação.' },
    { mark: '03', title: 'Materiais Complementares', desc: 'PDFs, vídeos e links selecionados pelo fisioterapeuta para apoiar seu tratamento.' },
    { mark: '04', title: 'Acesso Individual e Seguro', desc: 'Apenas você acessa sua área. Login criado pelo fisioterapeuta, com privacidade total.' },
    { mark: '05', title: 'Sempre Atualizado', desc: 'O Dr. Pablo atualiza seu plano quando necessário. Você vê as mudanças na hora.' },
    { mark: '06', title: 'Disponível no Celular', desc: 'Acesse seus exercícios e orientações de qualquer lugar, a qualquer hora.' },
  ]
  return (
    <section style={{ padding: 'clamp(72px, 10vw, 110px) clamp(1.5rem, 5vw, 4rem)', background: C.white }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ color: C.gold, fontSize: 11, fontFamily: S.sans, letterSpacing: '2.5px', textTransform: 'uppercase' }}>Sua área exclusiva</span>
          <h2 style={{ color: C.navy, fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 400, margin: '10px 0 12px', letterSpacing: '-0.3px' }}>O que você encontra no portal</h2>
          <p style={{ color: C.gray500, fontSize: 17, fontFamily: S.sans, maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>Tudo o que precisa para seguir seu tratamento, organizado e acessível</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {items.map((item, i) => (
            <div key={i} style={{ padding: '30px 28px', border: `1px solid ${C.gray200}`, borderRadius: 14, background: C.white }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <span style={{ color: C.gold, fontFamily: S.sans, fontWeight: 700, fontSize: 12 }}>{item.mark}</span>
              </div>
              <h3 style={{ color: C.navy, fontSize: 17, margin: '0 0 8px', fontFamily: S.sans, fontWeight: 600 }}>{item.title}</h3>
              <p style={{ color: C.gray500, fontSize: 14, lineHeight: 1.8, fontFamily: S.sans, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Clinic() {
  return (
    <section style={{ padding: 'clamp(72px, 10vw, 110px) clamp(1.5rem, 5vw, 4rem)', background: '#f4f2ec' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 'clamp(32px, 6vw, 72px)', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 clamp(280px, 45%, 520px)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -16, left: -16, width: 64, height: 64, border: `2px solid ${C.gold}`, borderRadius: 8, opacity: 0.45, zIndex: 0 }} />
          <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 64px rgba(26,39,68,0.18)', position: 'relative', zIndex: 2 }}>
            <img src="/consultorio.jpg" alt="Consultório Dr. Pablo Andrade" style={{ width: '100%', height: 'clamp(280px, 40vw, 480px)', objectFit: 'cover', objectPosition: 'center 40%', display: 'block' }} />
          </div>
          <div style={{ position: 'absolute', bottom: -12, right: -12, width: 40, height: 40, background: C.gold, borderRadius: 6, opacity: 0.22, zIndex: 1 }} />
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <span style={{ color: C.gold, fontSize: 11, fontFamily: S.sans, letterSpacing: '2.5px', textTransform: 'uppercase' }}>Estrutura</span>
          <h2 style={{ color: C.navy, fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 400, margin: '12px 0 22px', lineHeight: 1.25, letterSpacing: '-0.3px' }}>
            Um ambiente preparado<br />para o seu atendimento
          </h2>
          <p style={{ color: C.gray600, fontSize: 16, lineHeight: 1.9, fontFamily: S.sans, marginBottom: 20 }}>
            O consultório foi pensado para oferecer conforto, privacidade e os recursos necessários para o seu tratamento. Do ambiente ao equipamento, cada detalhe foi cuidado para que você tenha a melhor experiência.
          </p>
          <p style={{ color: C.gray600, fontSize: 16, lineHeight: 1.9, fontFamily: S.sans, marginBottom: 32 }}>
            A estrutura reflete o mesmo cuidado que o Dr. Pablo traz para cada atendimento — organização, atenção e um espaço exclusivo para a sua recuperação.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['Ambiente equipado para fisioterapia e quiropraxia', 'Atendimento individual e personalizado', 'Estrutura preparada para sua recuperação'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold }} />
                </div>
                <span style={{ fontSize: 15, color: C.gray700, fontFamily: S.sans, lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function About({ onLogin }) {
  return (
    <section style={{ padding: 'clamp(72px, 10vw, 110px) clamp(1.5rem, 5vw, 4rem)', background: C.navy, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '40%', opacity: 0.07, pointerEvents: 'none' }}>
        <img src="/consultorio.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'left center' }} />
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 'clamp(40px, 7vw, 80px)', alignItems: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
        <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{ width: 'clamp(200px, 28vw, 260px)', height: 'clamp(250px, 35vw, 330px)', borderRadius: 20, overflow: 'hidden', border: `3px solid ${C.gold}`, boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
              <img src="/pablo.jpg" alt="Dr. Pablo Andrade" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', display: 'block' }} />
            </div>
            <div style={{ position: 'absolute', bottom: -10, right: -10, width: 32, height: 32, borderRadius: '50%', background: C.gold, opacity: 0.55 }} />
          </div>
          <div style={{ marginTop: 20 }}>
            <div style={{ color: C.gold, fontWeight: 700, fontSize: 17, fontFamily: S.sans }}>Dr. Pablo Andrade</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: S.sans, marginTop: 4 }}>Fisioterapeuta · Quiropraxista</div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <span style={{ color: C.gold, fontSize: 11, fontFamily: S.sans, letterSpacing: '2.5px', textTransform: 'uppercase' }}>Quem vai acompanhar seu tratamento</span>
          <h2 style={{ color: C.white, fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 400, margin: '12px 0 22px', lineHeight: 1.25, letterSpacing: '-0.3px' }}>
            Cuidado com propósito<br />e precisão
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 16, lineHeight: 1.9, fontFamily: S.sans, marginBottom: 18 }}>
            Especializado em fisioterapia ortopédica e quiropraxia, com foco no acompanhamento individualizado de cada paciente. Acredito que um tratamento de excelência vai além da clínica — ele deve fazer parte da rotina do paciente.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.9, fontFamily: S.sans, marginBottom: 32, fontStyle: 'italic', borderLeft: `3px solid ${C.gold}`, paddingLeft: 20 }}>
            "Seu acompanhamento será conduzido com atenção, clareza e foco em um plano organizado para a sua evolução."
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
            {['Reabilitação Ortopédica', 'Quiropraxia', 'Fisioterapia Esportiva', 'Coluna e Postura', 'Pós-Operatório'].map(esp => (
              <div key={esp} style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.28)', borderRadius: 20, padding: '5px 13px', color: C.gold, fontSize: 12, fontFamily: S.sans }}>{esp}</div>
            ))}
          </div>
          <button onClick={onLogin} style={{ background: C.gold, color: C.navy, border: 'none', padding: '13px 32px', borderRadius: 9, fontSize: 15, fontWeight: 700, fontFamily: S.sans, cursor: 'pointer' }}>
            Acessar Minha Área
          </button>
        </div>
      </div>
    </section>
  )
}

function Location() {
  return (
    <section style={{ padding: 'clamp(72px, 10vw, 110px) clamp(1.5rem, 5vw, 4rem)', background: '#f4f2ec' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ color: C.gold, fontSize: 11, fontFamily: S.sans, letterSpacing: '2.5px', textTransform: 'uppercase' }}>Localização</span>
          <h2 style={{ color: C.navy, fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 400, margin: '10px 0 14px', letterSpacing: '-0.3px' }}>Onde nos encontrar</h2>
          <p style={{ color: C.gray500, fontSize: 16, fontFamily: S.sans }}>Dr. Pablo Andrade | Fisioterapia e Quiropraxia — Três Pontas, MG</p>
        </div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          {[['Localização', 'Três Pontas, MG'], ['Telefone', '(35) 9 9999-9999'], ['Especialidade', 'Fisioterapia e Quiropraxia']].map(([label, info]) => (
            <div key={label} style={{ background: C.white, padding: '16px 28px', borderRadius: 14, boxShadow: '0 2px 16px rgba(26,39,68,0.07)', textAlign: 'center', minWidth: 190, border: `1px solid ${C.gray200}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 7, fontFamily: S.sans }}>{label}</div>
              <div style={{ color: C.navy, fontFamily: S.sans, fontSize: 15, fontWeight: 600 }}>{info}</div>
            </div>
          ))}
        </div>
        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 40px rgba(26,39,68,0.14)', border: `1px solid ${C.gray200}` }}>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3756.3!2d-45.5!3d-21.37!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x6b373ad9a0cbf4ee!2sDr.+Pablo+Andrade+%7C+Fisioterapia+e+Quiropraxia+em+Tr%C3%AAs+Pontas!5e0!3m2!1spt-BR!2sbr!4v1"
            width="100%" height="400" style={{ border: 0, display: 'block' }} allowFullScreen="" loading="lazy" title="Dr. Pablo Andrade — Localização" />
        </div>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="https://www.google.com/maps/place/Dr.+Pablo+Andrade+%7C+Fisioterapia+e+Quiropraxia+em+Tr%C3%AAs+Pontas/data=!4m2!3m1!1s0x0:0x6b373ad9a0cbf4ee" target="_blank" rel="noreferrer"
            style={{ display: 'inline-block', background: C.navy, color: C.white, padding: '12px 32px', borderRadius: 9, fontSize: 14, fontFamily: S.sans, fontWeight: 600 }}>
            Abrir no Google Maps
          </a>
        </div>
      </div>
    </section>
  )
}

function CTA({ onLogin }) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <img src="/pablo.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(16,25,52,0.96) 0%, rgba(20,32,64,0.90) 60%, rgba(26,39,68,0.95) 100%)' }} />
      </div>
      <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(72px, 10vw, 110px) clamp(1.5rem, 5vw, 4rem)', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <span style={{ color: C.gold, fontSize: 11, fontFamily: S.sans, letterSpacing: '2.5px', textTransform: 'uppercase' }}>Área do Paciente</span>
          <h2 style={{ color: C.white, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 400, margin: '12px 0 20px', lineHeight: 1.2, letterSpacing: '-0.3px' }}>
            Acesse sua área exclusiva
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, lineHeight: 1.85, fontFamily: S.sans, marginBottom: 40 }}>
            Seus exercícios, orientações e materiais estão disponíveis. Acesse com o login e senha fornecidos pelo Dr. Pablo.
          </p>
          <button onClick={onLogin} style={{ background: C.gold, color: C.navy, border: 'none', padding: '16px 48px', borderRadius: 10, fontSize: 17, fontWeight: 700, fontFamily: S.sans, cursor: 'pointer', boxShadow: '0 8px 32px rgba(201,168,76,0.3)' }}>
            Entrar na Minha Área
          </button>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: S.sans, marginTop: 20 }}>
            Acesso criado pelo fisioterapeuta. Não possui acesso? Entre em contato.
          </p>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#0e1628', padding: '44px clamp(1.5rem, 5vw, 4rem)', textAlign: 'center', borderTop: '1px solid rgba(201,168,76,0.12)' }}>
      <div style={{ color: C.gold, fontWeight: 700, fontSize: 17, fontFamily: S.sans, marginBottom: 8 }}>Dr. Pablo Andrade</div>
      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontFamily: S.sans }}>Fisioterapia e Quiropraxia · Três Pontas, MG</div>
      <div style={{ color: 'rgba(255,255,255,0.22)', fontSize: 12, fontFamily: S.sans, marginTop: 20 }}>© 2025 Dr. Pablo Andrade. Todos os direitos reservados.</div>
    </footer>
  )
}
