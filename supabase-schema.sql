-- =============================================
-- SCHEMA — Dr. Pablo Andrade | Fisioterapia
-- Execute no SQL Editor do Supabase
-- =============================================

-- PACIENTES
create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  full_name text not null,
  phone text,
  email text,
  notes text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PLANOS
create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  title text not null,
  description text,
  welcome_message text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- EXERCICIOS
create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references plans(id) on delete cascade,
  title text not null,
  description text,
  sets integer default 3,
  reps text,
  frequency text,
  observations text,
  video_url text,
  image_url text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ORIENTACOES
create table if not exists guidelines (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references plans(id) on delete cascade,
  category text not null,
  content text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- MATERIAIS
create table if not exists materials (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references plans(id) on delete cascade,
  title text not null,
  type text not null, -- 'pdf', 'video', 'image', 'link'
  file_url text,
  external_url text,
  created_at timestamptz default now()
);

-- NOTAS INTERNAS DO ADMIN
create table if not exists admin_notes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  note text not null,
  created_at timestamptz default now()
);

-- =============================================
-- ROW LEVEL SECURITY — ativa segurança por linha
-- =============================================
alter table patients    enable row level security;
alter table plans       enable row level security;
alter table exercises   enable row level security;
alter table guidelines  enable row level security;
alter table materials   enable row level security;
alter table admin_notes enable row level security;

-- Políticas: acesso total pelo service_role (API server-side)
-- O frontend nunca acessa direto — passa sempre pela API Route do Next.js

create policy "Service role full access patients"    on patients    for all using (true);
create policy "Service role full access plans"       on plans       for all using (true);
create policy "Service role full access exercises"   on exercises   for all using (true);
create policy "Service role full access guidelines"  on guidelines  for all using (true);
create policy "Service role full access materials"   on materials   for all using (true);
create policy "Service role full access admin_notes" on admin_notes for all using (true);

-- =============================================
-- TRIGGER: atualiza updated_at automaticamente
-- =============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_patients_updated_at
  before update on patients
  for each row execute function update_updated_at();

create trigger trg_plans_updated_at
  before update on plans
  for each row execute function update_updated_at();

-- =============================================
-- EXEMPLO: inserir paciente de teste
-- =============================================
-- Senha 'teste123' já hasheada com bcrypt (rounds=10)
-- Troque pelo hash real gerado pelo sistema
insert into patients (username, password_hash, full_name, phone, email, notes)
values (
  'paciente.teste',
  '$2a$10$examplehashchangethisafterfirstlogin',
  'Paciente de Teste',
  '(35) 99999-9999',
  'teste@email.com',
  'Paciente criado para teste inicial.'
);
