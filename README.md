# Dr. Pablo Andrade — Portal Clínico

Sistema web completo de acompanhamento de pacientes.

---

## Passo a Passo para Colocar no Ar

### PARTE 1 — Criar conta no Supabase (banco de dados)

1. Acesse **https://supabase.com** e crie uma conta gratuita
2. Clique em **"New Project"**
3. Dê um nome: `pablo-andrade-fisio`
4. Escolha a região: **South America (São Paulo)**
5. Crie uma senha forte para o banco e salve
6. Aguarde o projeto criar (1-2 minutos)

**Pegar as credenciais:**
- Vá em **Settings → API**
- Copie o **Project URL** (começa com https://xxx.supabase.co)
- Copie o **anon public key** (chave longa)
- Copie o **service_role key** (chave secreta — nunca exponha)

---

### PARTE 2 — Criar o banco de dados

1. No Supabase, clique em **SQL Editor** no menu lateral
2. Clique em **"New query"**
3. Abra o arquivo `supabase-schema.sql` deste projeto
4. Copie todo o conteúdo e cole no editor
5. Clique em **"Run"**
6. Deve aparecer "Success" para cada tabela criada

---

### PARTE 3 — Subir o código no GitHub

1. Crie uma conta em **https://github.com** (se não tiver)
2. Crie um novo repositório: **"pablo-andrade-fisio"** (privado)
3. No seu computador, abra o terminal na pasta do projeto e execute:

```bash
git init
git add .
git commit -m "primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/pablo-andrade-fisio.git
git push -u origin main
```

**Sobre as imagens:**
Coloque os arquivos das fotos dentro da pasta `public/`:
- `public/pablo.jpg` → sua foto profissional
- `public/consultorio.jpg` → foto do consultório

---

### PARTE 4 — Deploy no Netlify

1. Acesse **https://netlify.com** e crie uma conta gratuita
2. Clique em **"Add new site" → "Import an existing project"**
3. Conecte com o GitHub e selecione o repositório `pablo-andrade-fisio`
4. Configurações de build (já estão no netlify.toml, mas confirme):
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Antes de fazer o deploy, vá em **Site configuration → Environment variables**
6. Adicione as variáveis uma a uma:

| Chave | Valor |
|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxx.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | sua-anon-key |
| `SUPABASE_SERVICE_ROLE_KEY` | sua-service-role-key |
| `ADMIN_USERNAME` | pabloandradefisio |
| `ADMIN_PASSWORD` | 4784768As@ |
| `ADMIN_NAME` | Dr. Pablo Andrade |

7. Clique em **"Deploy site"**
8. Aguarde 2-3 minutos — o site vai gerar uma URL tipo `abc123.netlify.app`

---

### PARTE 5 — Domínio personalizado (opcional)

Para usar um domínio como `pabloandrade.com.br`:
1. No Netlify: **Domain management → Add custom domain**
2. Siga as instruções para apontar o DNS

---

## Como usar o sistema

### Fazer login como administrador
- Acesse seu site → clique em **"Entrar"**
- Usuário: `pabloandradefisio`
- Senha: `4784768As@`

### Cadastrar um novo paciente
1. Acesse o painel admin → **Pacientes → Novo Paciente**
2. Preencha nome, telefone e crie um login e senha
3. Salve
4. Vá na página do paciente → aba **Plano** → crie o plano
5. Aba **Exercícios** → adicione os exercícios
6. Aba **Orientações** → adicione as orientações
7. Entregue ao paciente: **link do site + login + senha**

### O paciente acessa
- Entra no site → clica em **"Entrar"**
- Coloca o login e senha que você criou
- Vê apenas o próprio conteúdo

---

## Estrutura de Arquivos

```
pages/
  index.js              → Site público
  login.js              → Tela de login
  admin/
    index.js            → Dashboard admin
    pacientes/
      index.js          → Lista de pacientes
      novo.js           → Cadastrar paciente
      [id].js           → Detalhes do paciente (todas as abas)
  paciente/
    index.js            → Área do paciente - início
    exercicios.js       → Exercícios prescritos
    orientacoes.js      → Orientações do dia a dia
    materiais.js        → Materiais complementares
  api/
    auth/login.js       → Autenticação
    patients/           → CRUD de pacientes
    plans/              → CRUD de planos
    exercises/          → CRUD de exercícios
    guidelines/         → CRUD de orientações
    materials/          → CRUD de materiais
    notes/              → Notas internas
components/
  admin/AdminLayout.js  → Layout do painel admin
  patient/PatientLayout.js → Layout da área do paciente
  shared/               → Componentes reutilizáveis
lib/
  supabase.js           → Cliente Supabase
  auth.js               → Gerenciamento de sessão
  colors.js             → Paleta de cores
public/
  pablo.jpg             ← COLOQUE SUA FOTO AQUI
  consultorio.jpg       ← COLOQUE A FOTO DO CONSULTÓRIO AQUI
supabase-schema.sql     → Execute no Supabase SQL Editor
netlify.toml            → Configuração do deploy
```

---

## Tecnologias Usadas

- **Next.js 14** — Framework React (frontend + API)
- **Supabase** — Banco de dados PostgreSQL + autenticação
- **bcryptjs** — Hash seguro de senhas
- **Netlify** — Hospedagem e deploy automático

---

## Suporte

Qualquer dúvida no processo de configuração, consulte:
- Supabase docs: https://supabase.com/docs
- Netlify docs: https://docs.netlify.com
- Next.js docs: https://nextjs.org/docs
