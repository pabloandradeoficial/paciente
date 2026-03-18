import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Dr. Pablo Andrade | Fisioterapia e Quiropraxia — Portal exclusivo para pacientes." />
        <meta property="og:title" content="Dr. Pablo Andrade | Fisioterapia e Quiropraxia" />
        <meta property="og:description" content="Acesse seu plano de tratamento personalizado." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
