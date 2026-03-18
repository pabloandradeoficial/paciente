import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { C } from '../lib/colors'

export default function Home() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Dr. Pablo Andrade | Fisioterapia e Quiropraxia</title>
      </Head>
      <div style={{ fontFamily: "'Georgia', serif", background: C.white, minHeight: '100vh' }}>
        <Nav onLogin={() => router.push('/login')} />
        <Hero onLogin={() => router.push('/login')} />
        <HowItWorks />
        <Benefits />
        <About />
        <Location />
        <Footer />
      </div>
    </>
  )
}

function Nav({ onLogin }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(26,39,68,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(8px)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 2rem', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: 70,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: C.gold,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: C.navy, fontWeight: 700, fontSize: 13, fontFamily: 'sans-serif' }}>PA</span>
        </div>
        <div>
          <div style={{ color: C.white, fontWeight: 700, fontSize: 14, fontFamily: 'sans-serif', lineHeight: 1.2 }}>Dr. Pablo Andrade</div>
          <div style={{ color: C.gold, fontSize: 11, fontFamily: 'sans-serif' }}>Fisioterapia e Quiropraxia</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {['Início', 'Como Funciona', 'Sobre', 'Localização'].map(s => (
          <a key={s} href="#" style={{
            color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
            fontSize: 14, fontFamily: 'sans-serif',
          }}>{s}</a>
        ))}
        <button onClick={onLogin} style={{
          background: C.gold, color: C.navy, border: 'none',
          padding: '8px 20px', borderRadius: 6, fontWeight: 700,
          fontSize: 14, fontFamily: 'sans-serif', cursor: 'pointer',
        }}>Entrar</button>
      </div>
    </nav>
  )
}

function Hero({ onLogin }) {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 2rem 4rem' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <img src="/consultorio.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,39,68,0.92) 0%, rgba(26,39,68,0.80) 60%, rgba(26,39,68,0.88) 100%)' }} />
      </div>
      <div style={{ maxWidth: 900, textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'inline-block', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 20, padding: '6px 16px', marginBottom: 24 }}>
          <span style={{ color: C.gold, fontSize: 13, fontFamily: 'sans-serif', letterSpacing: '1px' }}>FISIOTERAPIA E QUIROPRAXIA</span>
        </div>
        <h1 style={{ color: C.white, fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.2, margin: '0 0 24px', fontWeight: 400 }}>
          Seu tratamento,<br />
          <span style={{ color: C.gold, fontStyle: 'italic' }}>acompanhado com precisão</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.80)', fontSize: 18, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.8, fontFamily: 'sans-serif' }}>
          Uma área exclusiva e personalizada para cada paciente, com exercícios, orientações e materiais — sempre atualizados, sempre acessíveis.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onLogin} style={{ background: C.gold, color: C.navy, border: 'none', padding: '14px 36px', borderRadius: 8, fontSize: 16, fontWeight: 700, fontFamily: 'sans-serif', cursor: 'pointer' }}>
            Acessar Minha Área
          </button>
          <button style={{ background: 'transparent', color: C.white, border: '1px solid rgba(255,255,255,0.4)', padding: '14px 36px', borderRadius: 8, fontSize: 16, fontFamily: 'sans-serif', cursor: 'pointer' }}>
            Saiba Mais
          </button>
        </div>
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 60, flexWrap: 'wrap' }}>
          {[['100%', 'Personalizado'], ['24h', 'Acesso Digital'], ['Seguro', 'Por Paciente']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ color: C.gold, fontSize: 24, fontWeight: 700, fontFamily: 'sans-serif' }}>{num}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'sans-serif', marginTop: 4 }}>{label}</div>
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
    { num: '03', title: 'Seu Plano Digital', desc: 'Exercícios, orientações e materiais são adicionados à sua área e atualizados conforme sua evolução.' },
    { num: '04', title: 'Acompanhamento Contínuo', desc: 'Acesse quando quiser, pelo celular ou computador, e siga seu protocolo com clareza e segurança.' },
  ]
  return (
    <section style={{ padding: '100px 2rem', background: C.cream, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
        <img src="/consultorio.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ color: C.gold, fontSize: 12, fontFamily: 'sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>Processo</span>
          <h2 style={{ color: C.navy, fontSize: 36, fontWeight: 400, margin: '12px 0 16px' }}>Como Funciona</h2>
          <p style={{ color: C.gray500, fontSize: 17, fontFamily: 'sans-serif', maxWidth: 500, margin: '0 auto' }}>Um processo simples para uma experiência de tratamento completa</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '40px 24px', background: C.white, borderRadius: 16, boxShadow: '0 4px 24px rgba(26,39,68,0.08)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: C.gold, fontWeight: 700, fontSize: 18, fontFamily: 'sans-serif' }}>{s.num}</div>
              <h3 style={{ color: C.navy, fontSize: 18, margin: '0 0 12px', fontWeight: 600, fontFamily: 'sans-serif' }}>{s.title}</h3>
              <p style={{ color: C.gray500, fontSize: 14, lineHeight: 1.8, fontFamily: 'sans-serif', margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  const items = [
    { mark: '01', title: 'Totalmente Personalizado', desc: 'Cada paciente tem sua própria área com conteúdo exclusivo criado pelo fisioterapeuta.' },
    { mark: '02', title: 'Acesso pelo Celular', desc: 'Interface otimizada para smartphone — consulte seus exercícios onde estiver.' },
    { mark: '03', title: 'Sempre Atualizado', desc: 'O Dr. Pablo atualiza seu plano sem burocracia, e você vê as mudanças imediatamente.' },
    { mark: '04', title: 'Privado e Seguro', desc: 'Seus dados são protegidos. Nenhum outro paciente acessa suas informações.' },
    { mark: '05', title: 'Tudo em Um Lugar', desc: 'Exercícios, orientações, vídeos e PDFs organizados em um único portal.' },
    { mark: '06', title: 'Orientações Detalhadas', desc: 'Cada exercício com séries, repetições, frequência e observações do fisioterapeuta.' },
  ]
  return (
    <section style={{ padding: '100px 2rem', background: C.white }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ color: C.gold, fontSize: 12, fontFamily: 'sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>Vantagens</span>
          <h2 style={{ color: C.navy, fontSize: 36, fontWeight: 400, margin: '12px 0' }}>Por que nossa plataforma</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {items.map((item, i) => (
            <div key={i} style={{ padding: '32px', border: `1px solid ${C.gray200}`, borderRadius: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <span style={{ color: C.gold, fontFamily: 'sans-serif', fontWeight: 700, fontSize: 13 }}>{item.mark}</span>
              </div>
              <h3 style={{ color: C.navy, fontSize: 18, margin: '0 0 10px', fontFamily: 'sans-serif' }}>{item.title}</h3>
              <p style={{ color: C.gray500, fontSize: 14, lineHeight: 1.8, fontFamily: 'sans-serif', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section style={{ padding: '100px 2rem', background: C.navy, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '35%', opacity: 0.18 }}>
        <img src="/consultorio.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'left center' }} />
      </div>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
        <div style={{ flex: '0 0 300px', textAlign: 'center' }}>
          <div style={{ width: 220, height: 280, borderRadius: 16, overflow: 'hidden', margin: '0 auto 16px', border: `3px solid ${C.gold}`, background: C.navyLight }}>
            <img src="/pablo.jpg" alt="Dr. Pablo Andrade" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
          </div>
          <div style={{ color: C.gold, fontWeight: 700, fontSize: 18, fontFamily: 'sans-serif' }}>Dr. Pablo Andrade</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'sans-serif', marginTop: 4 }}>Fisioterapeuta e Quiropraxista</div>
        </div>
        <div style={{ flex: 1, minWidth: 280 }}>
          <span style={{ color: C.gold, fontSize: 12, fontFamily: 'sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>Sobre</span>
          <h2 style={{ color: C.white, fontSize: 36, fontWeight: 400, margin: '12px 0 24px' }}>Cuidado com propósito e precisão</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, lineHeight: 1.9, fontFamily: 'sans-serif', marginBottom: 20 }}>
            Especializado em fisioterapia ortopédica e quiropraxia, com foco no acompanhamento individualizado de cada paciente. Acredito que um tratamento de excelência vai além da clínica — ele deve fazer parte da rotina do paciente.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, lineHeight: 1.9, fontFamily: 'sans-serif', marginBottom: 32 }}>
            Por isso criei este portal: para que você tenha suas orientações, exercícios e materiais sempre disponíveis, atualizados e organizados — transformando sua prescrição em uma experiência digital exclusiva.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['Reabilitação Ortopédica', 'Quiropraxia', 'Fisioterapia Esportiva', 'Coluna e Postura', 'Pós-Operatório'].map(esp => (
              <div key={esp} style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 6, padding: '6px 14px', color: C.gold, fontSize: 13, fontFamily: 'sans-serif' }}>{esp}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Location() {
  return (
    <section style={{ padding: '100px 2rem', background: C.cream }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ color: C.gold, fontSize: 12, fontFamily: 'sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>Localização</span>
          <h2 style={{ color: C.navy, fontSize: 36, fontWeight: 400, margin: '12px 0 16px' }}>Onde nos encontrar</h2>
          <p style={{ color: C.gray500, fontSize: 16, fontFamily: 'sans-serif' }}>Dr. Pablo Andrade | Fisioterapia e Quiropraxia — Três Pontas, MG</p>
        </div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          {[['Localização', 'Três Pontas, MG'], ['Telefone', '(35) 9 9999-9999'], ['Especialidade', 'Fisioterapia e Quiropraxia']].map(([label, info]) => (
            <div key={label} style={{ background: C.white, padding: '16px 24px', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center', minWidth: 180 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6, fontFamily: 'sans-serif' }}>{label}</div>
              <div style={{ color: C.navy, fontFamily: 'sans-serif', fontSize: 15, fontWeight: 600 }}>{info}</div>
            </div>
          ))}
        </div>
        <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 32px rgba(26,39,68,0.12)', border: `1px solid ${C.gray200}` }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3756.3!2d-45.5!3d-21.37!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x6b373ad9a0cbf4ee!2sDr.+Pablo+Andrade+%7C+Fisioterapia+e+Quiropraxia+em+Tr%C3%AAs+Pontas!5e0!3m2!1spt-BR!2sbr!4v1"
            width="100%" height="400"
            style={{ border: 0, display: 'block' }}
            allowFullScreen="" loading="lazy"
            title="Dr. Pablo Andrade — Localização"
          />
        </div>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="https://www.google.com/maps/place/Dr.+Pablo+Andrade+%7C+Fisioterapia+e+Quiropraxia+em+Tr%C3%AAs+Pontas/data=!4m2!3m1!1s0x0:0x6b373ad9a0cbf4ee"
            target="_blank" rel="noreferrer"
            style={{ display: 'inline-block', background: C.navy, color: C.white, padding: '12px 32px', borderRadius: 8, fontSize: 14, fontFamily: 'sans-serif', fontWeight: 600 }}>
            Abrir no Google Maps
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: C.navy, padding: '40px 2rem', textAlign: 'center' }}>
      <div style={{ color: C.gold, fontWeight: 700, fontSize: 18, fontFamily: 'sans-serif', marginBottom: 8 }}>Dr. Pablo Andrade</div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'sans-serif' }}>Fisioterapia e Quiropraxia · Três Pontas, MG</div>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'sans-serif', marginTop: 16 }}>© 2025 Dr. Pablo Andrade. Todos os direitos reservados.</div>
    </footer>
  )
}
