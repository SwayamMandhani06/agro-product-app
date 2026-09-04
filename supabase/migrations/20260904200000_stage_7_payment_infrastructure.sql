-- ============================================================
-- AGRITRADE — STAGE 7: PAYMENT INFRASTRUCTURE & SECURE TRANSACTIONS
-- Migration: 20260904200000_stage_7_payment_infrastructure.sql
-- ============================================================

-- 1. Payments Table
create table if not exists public.payments (
  id text primary key,
  order_id text not null references public.orders(id) on delete cascade,
  user_id text not null references public.profiles(id) on delete cascade,
  provider text not null check (provider in ('razorpay_test', 'cod', 'demo')),
  provider_payment_id text,
  provider_order_id text,
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'INR',
  method text not null check (method in ('upi', 'card', 'cod', 'netbanking', 'demo')),
  status text not null check (status in ('created', 'pending', 'processing', 'authorized', 'paid', 'failed', 'cancelled', 'refunded')),
  metadata jsonb not null default '{}'::jsonb,
  failure_code text,
  failure_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for efficient querying
create index if not exists idx_payments_order_id on public.payments(order_id);
create index if not exists idx_payments_user_id on public.payments(user_id);
create index if not exists idx_payments_status on public.payments(status);
create index if not exists idx_payments_created_at on public.payments(created_at desc);

-- 2. Payment Events Table (Audit Log / Webhook Ledger)
create table if not exists public.payment_events (
  id text primary key default gen_random_uuid()::text,
  payment_id text not null references public.payments(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_payment_events_payment_id on public.payment_events(payment_id);
create index if not exists idx_payment_events_created_at on public.payment_events(created_at desc);

-- 3. Row Level Security (RLS)
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;

-- Payments RLS Policies:
-- Users can read their own payments
create policy "Users can view their own payments"
  on public.payments
  for select
  using (auth.uid() = user_id);

-- Users can insert payments for their own orders
create policy "Users can create payments for their own orders"
  on public.payments
  for insert
  with check (auth.uid() = user_id);

-- Payment Events RLS Policies:
-- Users can view audit events for their own payments
create policy "Users can view audit events for their own payments"
  on public.payment_events
  for select
  using (
    exists (
      select 1 from public.payments
      where public.payments.id = public.payment_events.payment_id
        and public.payments.user_id = auth.uid()
    )
  );

-- 4. Enable Supabase Realtime Replication for payments
alter table public.payments replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'payments'
  ) then
    alter publication supabase_realtime add table public.payments;
  end if;
end $$;
