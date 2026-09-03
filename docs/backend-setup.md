# Backend Setup Guide — AgriTrade Stage 4D

## Overview

AgriTrade uses **Supabase** (PostgreSQL 16 hosted) as its canonical backend.
Both the Flutter mobile app and the Next.js web app consume the same
Supabase PostgREST API, sharing one canonical data contract.

> **Important**: The backend is optional for local development.
> When Supabase credentials are not configured, both platforms
> fall back seamlessly to built-in mock data.

---

## Prerequisites

| Tool         | Version   | Purpose                          |
|--------------|-----------|----------------------------------|
| Node.js      | ≥ 18      | Supabase CLI & web app           |
| Supabase CLI | ≥ 1.150   | Local dev & migration management |
| PostgreSQL   | 16+       | Production database              |

---

## 1. Create a Supabase Project

1. Visit [supabase.com/dashboard](https://supabase.com/dashboard)
2. Create a new project (e.g., `agritrade-prod`)
3. Note down:
   - **Project URL**: `https://<ref>.supabase.co`
   - **Anon/Public Key**: Found in **Settings → API**

---

## 2. Run Database Migrations

The canonical schema is defined in:

```
supabase/migrations/20260903000000_stage_4d_canonical_schema.sql
```

### Option A: Supabase CLI (recommended)

```bash
# Link to your project
supabase link --project-ref <your-project-ref>

# Apply all migrations
supabase db push
```

### Option B: SQL Editor

1. Open **Supabase Dashboard → SQL Editor**
2. Paste the contents of the migration file
3. Run the query

### Tables Created

| Table            | Purpose                              |
|------------------|--------------------------------------|
| `profiles`       | User profiles linked to auth.users   |
| `categories`     | Product categories (6 seeded)        |
| `products`       | Product catalogue (24 seeded)        |
| `product_images` | Product image gallery                |
| `carts`          | User shopping carts                  |
| `cart_items`     | Items within carts                   |
| `addresses`      | Saved delivery addresses             |
| `orders`         | Placed orders with status tracking   |
| `order_items`    | Individual items within orders       |
| `mandi_prices`   | APMC mandi commodity rates (8 seeded)|

---

## 3. Seed Sample Data

The seed file populates initial categories, products, and mandi prices:

```bash
# Via Supabase CLI
supabase db seed

# Or manually via SQL Editor — paste contents of:
# supabase/seed.sql
```

Seeded data includes:
- **6 categories**: Seeds, Fertilizers, Crop Protection, Farm Tools, Irrigation, Animal Care
- **24 products**: Real agricultural products with specifications and highlights
- **8 mandi prices**: APMC commodity rates for major Indian markets

---

## 4. Configure Environment Variables

### Flutter Mobile (`apps/mobile`)

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cd apps/mobile
cp .env.example .env
```

Edit `.env`:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

The app reads these via `flutter_dotenv` at startup.
When both values are present, `BackendConfig.isConfigured` returns `true`
and repositories use Supabase PostgREST. Otherwise, mock data is used.

### Next.js Web (`apps/web`)

Copy `.env.example` to `.env.local`:

```bash
cd apps/web
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 5. Row-Level Security (RLS)

All tables have RLS enabled with the following policies:

| Table     | SELECT   | INSERT   | UPDATE   | DELETE   |
|-----------|----------|----------|----------|----------|
| categories| Public   | —        | —        | —        |
| products  | Public   | —        | —        | —        |
| orders    | Own user | Own user | Own user | —        |
| addresses | Own user | Own user | Own user | Own user |
| carts     | Own user | Own user | Own user | Own user |
| mandi_prices| Public | —        | —        | —        |

> **Note**: For development without authentication, the anon key has
> read access to public tables. Order operations require a valid JWT.

---

## 6. Architecture: Repository Fallback Pattern

```
┌─────────────────────────────────────────────┐
│              Provider Layer                  │
│  (Riverpod / Zustand)                       │
├─────────────────────────────────────────────┤
│         if (BackendConfig.isConfigured)      │
│         ┌───────────────┐                   │
│    YES  │  Supabase     │                   │
│    ───▶ │  Repository   │                   │
│         └───────────────┘                   │
│         ┌───────────────┐                   │
│    NO   │  Mock         │                   │
│    ───▶ │  Repository   │                   │
│         └───────────────┘                   │
├─────────────────────────────────────────────┤
│         Domain Interface                     │
│  (ProductRepository / OrderRepository)       │
└─────────────────────────────────────────────┘
```

This ensures:
- **CI/CD**: Tests always pass without external dependencies
- **Local dev**: Runs offline with realistic mock data
- **Production**: Seamlessly switches to live Supabase data

---

## 7. Verification

### Web

```bash
cd apps/web
npm run lint    # Should pass with 0 errors
npm run build   # Should compile all 15 routes
```

### Mobile

```bash
cd apps/mobile
flutter analyze          # 0 issues expected
flutter test             # All tests pass
flutter build apk --debug  # APK builds successfully
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `SUPABASE_URL` not found | Ensure `.env` file exists and `flutter_dotenv` loads it in `main.dart` |
| `401 Unauthorized` | Check that `SUPABASE_ANON_KEY` is correct and RLS policies allow the operation |
| Products show mock data despite config | Verify the `categories` and `products` tables are seeded |
| Build fails with type errors | Run `flutter pub get` / `npm install` to ensure dependencies are up to date |
