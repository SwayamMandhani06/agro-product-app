# AgriTrade — Modern Agricultural Marketplace & Rural Logistics Ecosystem

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4_Turbopack-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Flutter](https://img.shields.io/badge/Flutter-3.44.8_Dart_3-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_16-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](./LICENSE)

> A synchronized, production-grade agricultural e-commerce and rural market intelligence platform connecting Indian farmers directly with certified input suppliers, APMC mandis, and agricultural cooperatives — eliminating middlemen markups, providing transparent commodity benchmarks, and securing farm-gate deliveries.

---

## Key Features

- **Multi-Persona Agricultural Portal**: Tailored workflows and role-guarded portals for **Growers/Farmers**, **Input Suppliers & Manufacturers**, **Cooperative FPOs**, and **Platform Admins**.
- **Live Mandi Intelligence**: Interactive APMC benchmark tickers, multi-commodity price charts (Soybean, Cotton, Wheat, Mustard), and 7-day trend visualizations.
- **Direct-to-Farm Input Marketplace**: Categorized seed lots, certified bio-fertilizers, and crop protection inputs with batch test certificates and bulk volume discounts.
- **Kisan Escrow & Secure Multi-Rail Payments**: Support for UPI, Net Banking, Debit/Credit Cards, Cash on Delivery (COD), and Razorpay Sandbox integration with automated tax receipt generation.
- **Rural Logistics & Consignment Telematics**: 6-stage consignment tracking lifecycle from farm-gate order placement to rural hub dispatch and OTP-verified delivery.
- **Collective Buying Campaigns**: Cooperative pool-purchasing modules enabling smallholder farmers to aggregate input demand and unlock tier-discounted factory rates.
- **Modern Agrarian Design System**: Dual-theme UI featuring **Harvest Cream** (light modern agrarian aesthetic) as default and **Forest Dark** mode, fluid responsive layouts across all mobile and desktop viewports, and accessible typography.

---

## Monorepo Architecture

The repository is structured as a clean dual-platform monorepo:

```text
agro-product-app/
├── apps/
│   ├── web/                # Next.js 16 App Router platform (Primary SaaS & deployment showcase)
│   │   ├── app/            # 40 routes (/home, /products, /checkout, /seller, /admin, etc.)
│   │   ├── components/     # AppShell, Navbar, DemoPersonaSwitcher, ReceiptModal
│   │   ├── features/       # Zustand domain stores: auth, cart, orders, payments, logistics
│   │   └── lib/            # Mock datasets, image resolvers, and Realtime providers
│   └── mobile/             # Flutter native application (Android companion prototype)
│       ├── lib/
│       │   ├── core/       # Design system tokens, routing, network, errors
│       │   └── features/   # auth, home, products, cart_checkout, orders, payments
│       └── test/           # 151 automated unit and widget tests
├── supabase/               # PostgreSQL 16 migrations, RLS policies, and seed data
└── docs/                   # Full architectural, role-permission, and payment specifications
```

---

## Technology Stack

| Domain | Web Platform (`apps/web`) | Mobile Companion (`apps/mobile`) |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.4 (Turbopack, App Router) | Flutter 3.44.8 / Dart 3.10+ |
| **Language** | TypeScript 5.x | Dart 3.x |
| **Styling** | Vanilla CSS Tokens + CSS Custom Properties | Material 3 + Agrarian Stitch Design System |
| **State Management** | Zustand 5.x (with localStorage persistence) | Riverpod 2.x |
| **Navigation** | Next.js App Router with role-based routing | GoRouter with dynamic redirect guards |
| **Icons & Typography** | Lucide React · Plus Jakarta Sans | Lucide Icons · Plus Jakarta Sans |
| **Backend & DB** | Supabase (PostgreSQL 16, WebSocket Realtime) | Supabase Flutter SDK |
| **Testing** | Node.js Test Runner (56 unit & integration tests) | Flutter Test (151 unit & widget tests) |

---

## Multi-Persona Demo Accounts

For immediate evaluation, the application provides built-in demo credentials and one-tap login chips on the `/login` page:

| Persona Role | Demo Email | Password | Access / Primary Dashboard |
| :--- | :--- | :--- | :--- |
| **Farmer / Grower** | `farmer@agritrade.in` | `farmer123` | `/home` — Catalog, Mandi rates, active orders |
| **Commercial Seller** | `seller@agritrade.in` | `seller123` | `/seller/dashboard` — Inventory, batch fulfillment, payouts |
| **Cooperative FPO** | `coop@agritrade.in` | `coop123` | `/cooperative/campaigns` — Bulk pool orders, volume tiers |
| **Platform Admin** | `admin@agritrade.in` | `admin123` | `/admin` — Supplier verification, disputes, audit logs |

---

## Getting Started

### 1. Web Application (`apps/web`)

#### Prerequisites
- **Node.js**: v18.x or v20.x+
- **npm**: v9.x+

#### Installation & Development
```bash
# Navigate to web application directory
cd apps/web

# Install project dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

#### Verification & Production Build
```bash
# Execute automated test suite (56 tests)
npm test

# Build production bundle
npm run build

# Start production server
npm start
```

---

### 2. Mobile Companion Application (`apps/mobile`)

#### Prerequisites
- **Flutter SDK**: 3.x stable
- **Android Studio / Android SDK**: API 34+
- Android Emulator or physical Android device

#### Execution
```bash
# Navigate to mobile directory
cd apps/mobile

# Get Flutter dependencies
flutter pub get

# Run static analysis
flutter analyze

# Run mobile automated test suite (151 tests)
flutter test

# Launch on connected device / emulator
flutter run
```

---

## Deployment Guide (Vercel)

The Next.js web application is pre-configured for seamless deployment to **Vercel**:

1. Fork or import this repository into your GitHub account.
2. In the Vercel Dashboard, create a **New Project** and select this repository.
3. Configure the **Build & Development Settings**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
4. Deploy. Vercel will automatically build the 40 App Router routes with Turbopack.

---

## Documentation

Comprehensive architecture, security, and integration specifications are available in the [`docs/`](./docs) directory:

- [**Multi-Persona Evaluation Guide**](./docs/demo-guide.md): Detailed walkthroughs for each canonical persona.
- [**Role & Permission Security Architecture**](./docs/role-permission-model.md): 22 granular permissions and lifecycle state machines.
- [**Payment & Invoicing Architecture**](./docs/payment-architecture.md): Kisan Escrow, Razorpay sandbox, and GST tax invoice layout.
- [**Logistics & Consignment Tracking**](./docs/logistics-architecture.md): Rural hub telematics and topological SVG route corridors.
- [**Backend Setup & Supabase Migrations**](./docs/backend-setup.md): Database schema, RLS policies, and WebSocket Realtime setup.

---

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.