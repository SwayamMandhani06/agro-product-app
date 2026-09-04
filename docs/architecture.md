# AgriTrade System Architecture & Backend Foundation (Stage 4B)

## 1. Dual-Platform Synchronized Architecture

AgriTrade operates with two first-class application targets sharing identical domain contracts:

```
                  ┌─────────────────────────────────────────┐
                  │            AgriTrade Core               │
                  │        Domain Models & Contracts        │
                  └────────────────────┬────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
  ┌───────────────────────────┐                 ┌───────────────────────────┐
  │   Flutter Mobile App      │                 │   Next.js 16 Web App      │
  │   (apps/mobile)           │                 │   (apps/web)              │
  │   - Riverpod 2.x State    │                 │   - Zustand State Stores  │
  │   - Clean Architecture    │                 │   - React 19 + Lucide     │
  │   - Material 3 Design     │                 │   - Responsive App Router │
  └─────────────┬─────────────┘                 └─────────────┬─────────────┘
                │                                             │
                └──────────────────────┬──────────────────────┘
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │      Unified Backend Target (Stage 4B)  │
                  │   PostgreSQL + Supabase REST / Realtime │
                  └─────────────────────────────────────────┘
```

---

## 2. Architecture Decision Record (ADR-004): Backend Choice

### Status: Approved

### Context
AgriTrade requires a scalable, relational, enterprise-grade backend for agricultural commerce with:
1. Multi-attribute product catalogs (seeds, fertilizers with specific chemical compositions and units).
2. Transactional order management (atomicity, status tracking, cancellations).
3. Farmer authentication with phone/email support.
4. Geo-tagged mandi commodity pricing.
5. First-class SDK support across both Flutter (`supabase_flutter`) and TypeScript (`@supabase/supabase-js`).

### Decision
We select **Supabase (PostgreSQL 16)** as the unified backend foundation for AgriTrade.

### Rationale
- **PostgreSQL Relational Rigor**: Enforces ACID compliance, foreign keys, row-level security (RLS), and JSONB schema flexibility for variable product specifications.
- **Unified Identity**: Built-in Auth service supporting phone OTP, email/password, and session refresh across mobile and web.
- **REST & Realtime**: Automatic OpenAPI/PostgREST generation for all relational tables, plus WebSocket channels for order status tracking.
- **Zero-Friction Migration**: Existing repository interfaces in Flutter (`ProductRepository`, `OrderRepository`, `AuthRepository`) and Zustand stores in Next.js swap cleanly from local mocks to Supabase clients without changing presentation code.

---

## 3. Relational Database Schema

### 3.1 `profiles`
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'farmer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.2 `categories`
```sql
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  item_count INT DEFAULT 0
);
```

### 3.3 `products`
```sql
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id TEXT REFERENCES public.categories(id),
  seller_name TEXT NOT NULL,
  seller_rating NUMERIC(2,1) DEFAULT 5.0,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  unit TEXT NOT NULL,
  stock_count INT NOT NULL DEFAULT 0,
  in_stock BOOLEAN GENERATED ALWAYS AS (stock_count > 0) STORED,
  rating NUMERIC(2,1) DEFAULT 0.0,
  review_count INT DEFAULT 0,
  delivery_location TEXT NOT NULL,
  highlights JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.4 `orders` & `order_items`
```sql
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'placed',
  total_amount NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) DEFAULT 0.0,
  discount NUMERIC(10,2) DEFAULT 0.0,
  payment_method TEXT NOT NULL,
  delivery_address JSONB NOT NULL,
  delivery_agent_name TEXT,
  delivery_agent_phone TEXT,
  estimated_delivery TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id),
  quantity INT NOT NULL CHECK (quantity > 0),
  price_at_purchase NUMERIC(10,2) NOT NULL
);
```

### 3.5 `mandi_prices`
```sql
CREATE TABLE public.mandi_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop TEXT NOT NULL,
  price TEXT NOT NULL,
  change TEXT NOT NULL,
  trend TEXT NOT NULL CHECK (trend IN ('up', 'down', 'flat')),
  market TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Migration & Integration Strategy (Completed in Stage 4D)

1. **Phase 1 (Completed)**: High-fidelity mock implementations running locally on both Flutter and Next.js, locked to identical entity structures.
2. **Phase 2 (Completed)**: Canonical database schema migration (`supabase/migrations/20260903000000_stage_4d_canonical_schema.sql`), seed script (`supabase/seed.sql`), and environment templates for both mobile (`.env.example`) and web (`.env.example`).
3. **Phase 3 (Completed)**: Concrete repository implementations:
   - **Web**: `SupabaseProductRepository`, `SupabaseOrderRepository`, `SupabaseMandiRepository` in `apps/web/features/*/data/`.
   - **Mobile**: `SupabaseProductRepository`, `SupabaseOrderRepository` in `apps/mobile/lib/features/*/data/` via `BackendConfig` and `Dio` PostgREST.
   - **Offline Fallback**: Both platforms automatically and gracefully fall back to mock data if credentials are not configured or network requests fail.
   - **SaaS Marketing Portal**: Live interactive marketing landing page deployed on Next.js root route (`/`).

---

## 5. Stage 11: Governance, Trust & Platform Operations Architecture

Stage 11 introduces comprehensive marketplace control, dispute mediation, compliance moderation, and immutable auditability:

```
┌────────────────────────────────────────────────────────────────────────┐
│               AgriTrade Platform Governance Subsystem                  │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Seller Verification Engine                                          │
│    - APMC/GSTIN validation & credential checking                       │
│    - State machine: draft -> submitted -> under_review -> verified     │
│    - Risk flags (missing license, mismatched state, counterfeit)      │
│                                                                        │
│ 2. Product Catalog Moderation                                          │
│    - Quality check & chemical safety validation (CIB&RC)               │
│    - State machine: draft -> pending_review -> approved | rejected     │
│                                                                        │
│ 3. SafeHarvest Buyer Protection & Dispute Desk                         │
│    - Order-linked claims (damaged product, SLA delay, wrong batch)     │
│    - State machine: open -> under_review -> awaiting_user -> resolved  │
│    - Integrated message timeline between Farmer, Seller, Admin         │
│                                                                        │
│ 4. Immutable Audit Trail                                               │
│    - Append-only event store in public.audit_logs                      │
│    - Actor, entityType, action, timestamp, and metadata payload        │
│                                                                        │
│ 5. Automated Marketplace Risk Signals                                  │
│    - Real-time rule engine for dispute spikes & unauthorized inputs    │
│    - Severity classification (Critical / High / Medium / Low)          │
└────────────────────────────────────────────────────────────────────────┘
```


