# AgriTrade — Modern Agricultural Marketplace

> A synchronized, production-grade agricultural e-commerce and rural intelligence platform connecting Indian farmers directly with verified agri-input suppliers and manufacturers — eliminating middlemen for transparent market access, certified inputs, and fair pricing.

Originally conceptualized as a Community Engagement Project (CEP) at PCCOE, built from the ground up following Clean Architecture, domain-driven design, and the **Google Stitch** visual design system.

---

## Monorepo Architecture & Platform Strategy

AgriTrade is architected as a synchronized dual-platform agricultural ecosystem:

- **Next.js Web Application (`apps/web`)**: The **primary deployable demonstration platform** and SaaS-grade operational marketplace showcase. Optimized for desktop-first workflows, split-panel shipment tracking, and operational intelligence dashboards.
- **Flutter Mobile Application (`apps/mobile`)**: A native mobile companion and high-fidelity prototype tailored for outdoor agricultural field use, featuring touch-optimized Material 3 components, compact cards, and haptic-friendly interactions. *(Note: Mobile APK distribution and app-store deployment workflows will be finalized in later stages).*
- **Centralized Supabase Backend (`supabase/`)**: PostgreSQL 16 schema, Row Level Security policies, database triggers, and WebSocket Realtime publications.

```text
agro-product-app/
├── apps/
│   ├── mobile/             # Flutter native application (Android companion prototype)
│   │   ├── lib/
│   │   │   ├── core/       # Design system, routing, network, realtime, errors
│   │   │   └── features/   # auth, home, products, cart_checkout, orders, payments, logistics
│   │   └── test/           # 151 automated unit & widget tests (100% pass)
│   └── web/                # Next.js 16 App Router platform (Primary deployment demo)
│       ├── app/            # 40 routes (/home, /products, /seller/*, /admin/*, etc.)
│       ├── components/     # AppShell, DemoPersonaSwitcher, RouteCorridor, StateViews
│       ├── features/       # Zustand stores: auth, cart, orders, payments, logistics, admin
│       ├── lib/            # Realtime subscriptions, Supabase client, order transitions
│       └── types/          # TypeScript domain models mirroring mobile
├── supabase/               # PostgreSQL 16 migrations & RLS security rules
└── docs/                   # Full architectural, payment, logistics, and audit specs
```

---

## Dual Platform Technology Stack

| Capability | Mobile Target (`apps/mobile`) | Web Target (`apps/web`) |
| :--- | :--- | :--- |
| **Role** | Native Field Companion / Prototype | Primary Deployment Showcase / SaaS Web |
| **Framework** | Flutter 3.44.8 / Dart 3.10+ | Next.js 16.3.4 (Turbopack, App Router) |
| **Language** | Dart | TypeScript 5.x |
| **Styling** | Flutter Material 3 + Custom Stitch Tokens | Tailwind CSS 4 + CSS Custom Properties |
| **State Management** | Riverpod 2.x (Notifier, StateProvider) | Zustand 5.x with localStorage persistence |
| **Routing** | GoRouter with Auth Guarding | Next.js App Router with AppShell Guard |
| **Typography** | Plus Jakarta Sans (Google Fonts) | Plus Jakarta Sans (`next/font/google`) |
| **Data Architecture** | Clean Architecture (Domain, Data, Presentation) | Domain Types, Store Layer, Page Primitives |
| **Primary Color** | Forest Green `#0B3D2E` | Forest Green `--color-forest: #0B3D2E` |
| **Accent Color** | Amber `#D97706` | Amber `--color-amber: #D97706` |
| **Canvas Color** | Warm Canvas `#F9F7F2` | Warm Canvas `--color-canvas: #F9F7F2` |
| **Testing & Quality**| `flutter test` (151/151 passed), `flutter analyze` (0 issues), APK build clean | `npm test` (56/56 passed), TypeScript clean, Next.js build clean (40 routes) |

---

## Design System Tokens & Stitch References

Both platforms adhere to the **Google Stitch** design specifications (Project `15601137375538914645`):

### Color Tokens

```css
/* Core Palette */
--color-forest:        #0B3D2E;  /* Brand primary: deep agrarian green */
--color-amber:         #D97706;  /* Brand accent: warm harvest amber */
--color-canvas:        #F9F7F2;  /* Brand canvas: off-white background */
--color-slate:         #1E293B;  /* Neutral dark: high-contrast text */
--color-surface-tint:  #E4E2DD;  /* Subtle divider/border tone */

/* Semantic Accents */
--color-success:       #1A7A4A;  /* Certified badge, free delivery */
--color-warning:       #C17900;  /* Low stock, pending dispatch */
--color-error:         #B72B2B;  /* Form errors, order cancellation */
--color-info:          #1B6BAA;  /* Information, order tracking */
```

### Stitch Screen Mapping

| Screen / Flow | Stitch Screen Title | Stitch Screen ID |
| :--- | :--- | :--- |
| **Splash** | AgriTrade Splash Screen | `6831455a4a284ef7b95f228fd20fbb27` |
| **Sign In** | AgriTrade Login Screen | `af256a0b38d24d77b5304c8b889e9fdc` |
| **Farmer Dashboard** | AgriTrade Farmer Home Dashboard | `892ea46f4e4d445d8d2cbec69458cf0d` |
| **Categories** | Browse Categories - Refined | `64c374f703e1416596ac1d253ab86724` |
| **Active Search** | AgriTrade Active Search | `01f28b241ed1472890ce1695aa0ec514` |
| **Cart** | AgriTrade Cart | `a7f9f1c5f5df49cf83fbac7fc65bbbe4` |
| **Select Address** | AgriTrade Select Address - Refined | `3aee1180c92947229284c82fa44e5cbf` |
| **Checkout** | AgriTrade Checkout | `1f9a38333e014c208bd97a5fdf66b791` |
| **Order Confirmed** | AgriTrade Order Confirmed | `d91cd48648154a0488ff56e0d0654cf2` |
| **My Orders** | AgriTrade My Orders - Refined | `7ad8777b56f748caabf7496810184e45` |
| **No Orders State** | AgriTrade No Orders | `f31bfdff0f764f3c8479a562584fee6c` |
| **Order Details** | AgriTrade Order Details | `e24d0f780f4d4c1a9907336f07191628` |
| **Track Order** | AgriTrade Track Order - Refined | `a548142411df4d44818be9be7f855034` |
| **Cancel Order Flow**| AgriTrade Cancel Order Flow | `4ee9e855333d4998a0c78b72fb13395a` |
| **Profile** | AgriTrade Profile | `cabc5489f2bb4777948d4a84cd06c12f` |

---

## Synchronized User Journey

```text
               App Launch / Route Load
                          │
            [Session Restoration Check]
                          │
        ┌─────────────────┴─────────────────┐
        ▼                                   ▼
 [Unauthenticated]                   [Authenticated]
  Welcome Portal                            │
  (3 Value Props)                           │
        │                                   │
 ┌──────┴──────┐                            │
 ▼             ▼                            │
Sign In     Sign Up                         │
 │             │                            │
 └──────┬──────┘                            │
        ▼                                   │
  Authenticate                              │
        │                                   │
        └──────────────► ◄──────────────────┘
                         │
               Farmer Home Dashboard
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
  Category Discovery              Featured Products
         │                               │
         ▼                               ▼
  Product Listing Grid            Product Details
  (Search, Filter, Sort)                 │
         │                               ▼
         └───────────────────────►  Add to Cart
                                         │
                                         ▼
                                     Cart Screen
                                 (Quantity Steppers)
                                         │
                                         ▼
                                   Checkout Screen
                            (Address & Payment Selection)
                                         │
                                         ▼
                                    Place Order
                                         │
                                         ▼
                              Order Confirmed Screen
                                         │
                                         ▼
                                  My Orders List
                            (All / Active / Delivered)
                                         │
                                         ▼
                               Order Details Screen
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
              Order Tracking Timeline              Reorder Items
            (Placed → Out for Delivery)          (Merge into Cart)
                         │
                         ▼
              Farmer Profile & Settings
                         │
                      Sign Out
                         │
                         ▼
                   Welcome Portal
```

---

## Functional & Business Parity Matrix

| Business Rule / Feature | Mobile (`apps/mobile`) | Web (`apps/web`) | Status |
| :--- | :--- | :--- | :--- |
| **Demo Farmer Login** | `farmer@agritrade.in` / `farmer123` | `farmer@agritrade.in` / `farmer123` | ✅ Parity |
| **Quick Demo Fill Action**| One-tap helper chip | One-tap helper pill | ✅ Parity |
| **Delivery Threshold** | Free ($\ge ₹1,000$), $₹99$ otherwise | Free ($\ge ₹1,000$), $₹99$ otherwise | ✅ Parity |
| **Savings Calculation** | `(originalPrice - price) * qty` | `(originalPrice - price) * qty` | ✅ Parity |
| **Cart Quantity Stepper**| `[-] Qty [+]` with minimum 1 | `[-] Qty [+]` with minimum 1 | ✅ Parity |
| **Duplicate Cart Items** | Merges quantity on re-add | Merges quantity on re-add | ✅ Parity |
| **Order Status Lifecycle** | 6 stages (Placed $\to$ Delivered) | 6 stages (Placed $\to$ Delivered) | ✅ Parity |
| **Order Cancellation** | Active orders only with dialog | Active orders only with dialog | ✅ Parity |
| **Reorder Action** | Pushes all items to active cart | Pushes all items to active cart | ✅ Parity |
| **Address Tags** | `Farm`, `Home` with default tag | `Farm`, `Home` with default tag | ✅ Parity |
| **Payment Options** | UPI, Card, Net Banking, COD | UPI, Card, Net Banking, COD | ✅ Parity |
| **Navigation Model** | 5-tab Bottom Navigation Bar | Responsive Header (desktop) + Bottom Bar (mobile) | ✅ Parity |
| **Route Protection** | GoRouter redirect to `/welcome` | Client-side AppShell redirect to `/welcome` | ✅ Parity |

---

## Development & Execution Guide

### 1. Flutter Mobile Application

#### Prerequisites
- Flutter SDK 3.x stable
- Android SDK (API 35+)
- Android Emulator AVD (`Pixel_8_API35`)

#### Running Mobile Locally
```bash
# Navigate to mobile app
cd apps/mobile

# Check connected devices / emulators
flutter devices

# Launch Android emulator (Pixel_8_API35)
flutter emulators --launch Pixel_8_API35

# Run the app on the emulator
flutter run -d emulator-5554

# Run static analysis
flutter analyze

# Run all automated tests
flutter test

# Build debug APK
flutter build apk --debug
```

### 2. Next.js Responsive Web Application

#### Prerequisites
- Node.js 18.x or 20.x+
- npm 9.x+

#### Running Web Locally
```bash
# Navigate to web app
cd apps/web

# Install dependencies (already populated)
npm install

# Start development server on localhost:3000
npm run dev

# Run ESLint validation
npm run lint

# Build production bundle
npm run build

# Start production server
npm start
```

---

## Quality Assurance & Verification Results

### Mobile Verification
```bash
cd apps/mobile

$ flutter analyze
Analyzing mobile...
No issues found! (0 errors, 0 warnings)

$ flutter test
00:07 +125: All tests passed!

$ flutter build apk --debug
Built build\app\outputs\flutter-apk\app-debug.apk
```

### Web Verification
```bash
cd apps/web

$ npm test
> node --test test/*.test.mjs
# 24 tests passed (analytics.test.mjs, logistics.test.mjs, payment.test.mjs, realtime.test.mjs)

$ npm run lint
> eslint
# 0 errors, 0 warnings

$ npm run build
▲ Next.js 16.3.4 (Turbopack)
✓ Compiled successfully
✓ Generating static pages (22/22)
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /cart
├ ○ /categories
├ ○ /checkout
├ ○ /checkout/confirmed
├ ○ /community
├ ○ /home
├ ○ /insights
├ ○ /login
├ ○ /mandi
├ ○ /notifications
├ ○ /orders
├ ƒ /orders/[id]
├ ƒ /orders/[id]/receipt
├ ○ /products
├ ƒ /products/[id]
├ ○ /profile
├ ○ /saved
├ ○ /shipments
├ ○ /signup
├ ○ /weather
└ ○ /welcome
```

---

## Project Status & Roadmap

```text
Stage 0  — Monorepo Restructuring & Git Setup             ✅ Complete
Stage 1  — Core Infrastructure & Clean Architecture        ✅ Complete
Stage 2  — Modern Agrarian Design System                  ✅ Complete
Stage 3A — Navigation Shell & Core AgriTrade Widgets       ✅ Complete
Stage 3B — Farmer Home Dashboard                          ✅ Complete (Commit: 97fd4bb)
Stage 3C — Product Discovery Experience                   ✅ Complete (Commit: d41bd83)
Stage 3D — Cart & Checkout Experience                     ✅ Complete (Commit: 0f60322)
Stage 3E — Orders, Order Details & Tracking               ✅ Complete (Commit: 86a7951)
Stage 4A — Auth, Session Management & App Entry Flow      ✅ Complete (Commit: 0e7da3e)
Stage 3QA— Mobile Visual QA & Web Parity Implementation    ✅ Complete (Branch: stage-3-visual-qa-web-parity)
Stage 4B — Premium Visual Redesign & Backend Foundation    ✅ Complete (Branch: stage-4b-premium-ui-backend-foundation)
Stage 4C — Premium Product Experience & Dashboard Evolution ✅ Complete (Branch: stage-4c-premium-product-experience)
Stage 4D — Shared Backend Integration, Sync & SaaS Homepage ✅ Complete (Branch: stage-4d-shared-backend-sync)
Stage 4E — Farmer Intelligence, Engagement & Community    ✅ Complete (Branch: stage-4e-farmer-intelligence-engagement)
Stage 5  — Real Data Integration, Backend Hardening & Web Elevation ✅ Complete (Branch: stage-5-backend-hardening)
Stage 6  — Real-Time Intelligence & Live Operations       ✅ Complete (Commit: 459f670)
Stage 7  — Payment Infrastructure, Secure Checkout & Transaction Experience ✅ Complete (Branch: stage-7-payment-infrastructure)
Stage 8  — Logistics Operations, Rural Intelligence & Consignment Tracking ✅ Complete (Branch: stage-8-logistics-operations)
Stage 9  — Advanced Analytics, Farm Insights & Decision Intelligence ✅ Complete (Branch: stage-9-analytics-intelligence)
─────────────────────────────────────────────────────────────────────────────
Stage 10 — Seller & Cooperative Marketplace Portal          ✅ Complete (Branch: stage-10-marketplace-cooperative)
Stage 11 — Admin Operations, Trust, Governance & Platform Control ✅ Complete (Branch: stage-11-admin-trust-operations)
─────────────────────────────────────────────────────────────────────────────
Stage 12 — Production Readiness, System Hardening & Cross-Platform Parity ✅ Complete (Branch: stage-12-production-readiness)
```

---

## Design System & Architecture Documentation

Detailed architectural and design specifications are maintained in the [`docs/`](./docs) directory:

- [**Multi-Persona Demo & Evaluation Guide**](./docs/demo-guide.md) — Step-by-step evaluator instructions for all 4 canonical personas (Farmer, Seller, Coop Manager, Admin), demo credentials, and interactive persona switcher.
- [**Production Hardening & Architectural Governance**](./docs/production-hardening.md) — WCAG 2.1 AA accessibility standards, performance optimizations, security guardrails, and universal state views.
- [**Stage 12 Cross-Platform Integration Audit**](./docs/stage-12-integration-audit.md) — Complete audit of authentication, marketplace domains, canonical 13-state order lifecycle, and transition validation matrices.
- [**Stage 12 Visual Quality Assurance & Parity Report**](./docs/stage-12-visual-qa.md) — Dual-platform visual audit covering design tokens, responsive layouts, content skeletons, and state views.
- [**Role & Permission Model**](./docs/role-permission-model.md) — Multi-persona security architecture (Farmer, Seller, Coop Manager, Admin), 22 granular permissions, lifecycle state machines, append-only audit trail invariants, and risk rule engine.
- [**Analytics Architecture & Decision Intelligence**](./docs/analytics-architecture.md) — Pure deterministic aggregation pipeline, explainable rules-based FarmInsightEngine, Bloomberg-lite workspace, and zero paid API guarantee.
- [**Stage 9 Visual Quality Audit**](./docs/stage-9-visual-qa.md) — Comprehensive visual QA audit across Web `/insights` and Flutter mobile `FarmInsightsScreen`.
- [**Logistics Architecture & Rural Delivery Operations**](./docs/logistics-architecture.md) — Consignment tracking lifecycle, DemoLogisticsProvider simulation, topological SVG route corridor, delivery attempt exception management, and courier API boundaries.
- [**Stage 8 Visual Quality Audit**](./docs/stage-8-visual-qa.md) — Comprehensive visual audit across 26 screens enforcing the "Modern Agrarian Fintech + Professional SaaS" aesthetic.
- [**Payment Architecture**](./docs/payment-architecture.md) — Platform-neutral payment abstractions, Razorpay Test Mode, offline Demo sandbox, COD reconciliation, and printable tax invoices.
- [**Repository Integration Audit**](./docs/repository-integration.md) — Git recovery audit, canonical integration strategy, commit lineage, verification logs, and manual PR procedures.
- [**Roadmap Reconciliation**](./docs/roadmap-reconciliation.md) — Canonical reconciliation of roadmap stages vs. actual dual-platform implementation state.
- [**Backend Setup Guide**](./docs/backend-setup.md) — Comprehensive guide for Supabase project setup, PostgreSQL 16 migrations, seed scripts, RLS policies, and dual-platform environment variables.
- [**Motion System Specification**](./docs/motion-system.md) — 6-tier duration tokens, cubic-bezier easing curves, reduced-motion accessibility, Web CSS keyframes, and Flutter `AppMotion` presets.
- [**Platform Design Parity Specification**](./docs/platform-design-parity.md) — 1-to-1 token translation table across Web CSS and Flutter Material 3.
- [**UI Quality Checklist**](./docs/ui-quality-checklist.md) — Strict forbidden anti-patterns and mandatory enterprise SaaS standards.
- [**Design System Specification**](./docs/design-system.md) — Typography, restrained radius (≤12px), semantic color tokens, Lucide icon system, and design principles.
- [**System Architecture & ADR-004**](./docs/architecture.md) — Dual-target synchronization, Supabase PostgreSQL schema, RLS policies, and migration roadmap.
- [**Platform-Neutral API Contracts**](./docs/api-contract.md) — Canonical entity schemas shared by Mobile and Web.

---

## Branching Strategy

```text
main                                    — Production releases (stable canonical release)
develop                                 — Active integration base (all feature branches base off develop)
stage-12-production-readiness           — Active feature branch for Stage 12 Production Hardening
```

### Standardized Contribution Workflow:
```text
develop
   ↓
feature/stage-X
   ↓
Pull Request
   ↓
develop
   ↓
Pull Request (at stable milestones)
   ↓
main
```


---

## License

Private — Developed for AgriTrade agricultural commerce initiatives. All rights reserved.