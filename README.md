# Agro Product App

> Agricultural e-commerce platform connecting Indian farmers directly with verified sellers — eliminating middlemen for fairer pricing and transparent market access.

Originally conceptualized as a Community Engagement Project (CEP) at PCCOE, now being rebuilt from the ground up as a production-grade Flutter application following Clean Architecture principles.

---

## What It Does

The app serves three distinct user roles:

| Role | Responsibilities |
|------|----------------|
| **Farmer** | Browse and purchase agricultural products (seeds, fertilizers, pesticides, equipment), track orders, manage addresses, wishlist, and view personalized AI recommendations |
| **Seller** | List and manage product inventory, fulfill orders, monitor sales analytics |
| **Admin** | Verify sellers, moderate products, oversee platform health, manage mandi price data |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **UI Framework** | Flutter (Dart 3.x) |
| **State Management** | Riverpod 2 — `Notifier`, `AsyncNotifier`, `StreamProvider` |
| **Routing** | go_router with role-based redirect guards |
| **Backend** | Firebase — Auth, Firestore, Cloud Messaging, Analytics, Crashlytics, Remote Config |
| **Image Storage** | Cloudinary (free tier, unsigned upload preset) |
| **AI Recommendations** | Gemini API via Google AI Studio (Flash model) |
| **Weather** | OpenWeatherMap free tier |
| **Mandi Prices** | data.gov.in / eNAM open government API |
| **Payments** | Razorpay (test mode) |
| **Localization** | easy_localization — English, Hindi, Marathi |
| **Offline Cache** | Hive |
| **HTTP Client** | Dio with connectivity pre-flight checks |
| **Error Handling** | fpdart `Either<Failure, T>` — no exceptions escape the data layer |

---

## Architecture

Feature-first Clean Architecture — every feature lives in its own isolated slice:

```
lib/
├── core/
│   ├── design_system/   # Modern Agrarian design tokens, typography, shadows, motion, theme
│   ├── di/              # Riverpod DI providers, Firebase bootstrap, Remote Config
│   ├── error/           # Sealed Failure hierarchy + exception → failure mapper
│   ├── localization/    # Supported locales (en / hi / mr)
│   ├── network/         # Dio client wrapper + .env config reader
│   ├── routing/         # go_router config, route constants, auth redirect (Stage 4)
│   └── widgets/         # Reusable design-system components (buttons, cards, inputs, glass, etc.)
└── features/
    ├── auth/            # domain / data / presentation
    ├── onboarding/
    ├── products/
    ├── cart_checkout/
    ├── orders/
    ├── wishlist/
    ├── addresses/
    ├── reviews/
    ├── search/
    ├── seller/
    ├── admin/
    ├── recommendations/
    ├── weather/
    ├── mandi_prices/
    ├── notifications/
    └── forum/
```

**Layer rules (strictly enforced):**
- `domain/` — pure Dart; zero Firebase or HTTP imports; defines entities and repository interfaces
- `data/` — implements repository interfaces; all Firebase / HTTP / Hive access lives here
- `presentation/` — screens and Riverpod providers; communicates only through domain interfaces

---

## Getting Started

### Prerequisites

- Flutter SDK ≥ 3.5.0
- A Firebase project on the free **Spark plan**
- [FlutterFire CLI](https://firebase.flutter.dev/docs/cli/) (`dart pub global activate flutterfire_cli`)

### Setup

```bash
# 1. Clone and install packages
git clone https://github.com/SwayamMandhani06/agro-product-app.git
cd agro-product-app
flutter pub get

# 2. Configure environment variables
cp .env.example .env
# Edit .env and fill in your keys (see .env.example for the full list)

# 3. Connect Firebase (generates lib/firebase_options.dart)
flutterfire configure

# 4. Run
flutter run
```

> **Note:** `lib/firebase_options.dart` and `.env` are gitignored. Both must be created locally before running the app. The `firebase_options.example.dart` template is included for reference.

### Running Tests

```bash
flutter test
```

### Static Analysis

```bash
flutter analyze
```

---

## Current Status — Stage 2 Complete

> **Development follows a 17-stage build roadmap. Only completed stages are described below.**

### ✅ Stage 0 — Git & GitHub Setup
Repository initialized with `main` / `develop` / `stage-N-*` branching strategy.

### ✅ Stage 1 — Flutter Project, Clean Architecture Skeleton & Core Infra
- Scaffolded all 17 feature folders with `domain/`, `data/`, `presentation/` layers
- Firebase initialized (Analytics, Crashlytics, Remote Config defaults)
- Dependency injection via Riverpod `ProviderScope` and override points
- Sealed `Failure` hierarchy + `Either<Failure, T>` return pattern
- Dio client with `connectivity_plus` pre-flight checks
- `easy_localization` (EN, HI, MR) and `go_router` routing infrastructure
- Swappable repository plugin seams (Weather, Mandi, Recommendations, Payment)

### ✅ Stage 2 — Modern Agrarian Design System
- **Design Tokens:** Deep forest green palette (`#012D1D`/`#00160C`), warm bone background (`#FFF8F5`), tonal surfaces, warm amber accent (`#FE932C`), *Plus Jakarta Sans* typography scale, 4-point spacing grid, component border radii, brand-tinted soft shadows, and motion curves/durations
- **Core Widgets:** `AppButton` (4 variants, loading morph, press animation), `AppTextField` (focus glow, floating labels, refined error states), `AppCard` (5 surface variants), `AppGlass` (restrained backdrop blur & borders), `AppChip` (semantic status dots & selection), `AppDialog` & sheets, `AppLoading` (warm shimmer skeletons & spinners), `AppEmptyState` & `AppErrorState` (tonal circular containers & CTAs), `AppIcon` & `AppBadge`
- **Theme:** Comprehensive Material 3 `AppTheme.light` wired to `MaterialApp.router`
- **Interactive Showcase:** `DesignSystemPreviewScreen` (`/design-system-preview`) displaying all tokens and interactive component states

---

## Roadmap

| Stage | Feature | Status |
|-------|---------|--------|
| 0 | Git & GitHub setup | ✅ Complete |
| 1 | Flutter project, Clean Architecture skeleton & core infra | ✅ Complete |
| 2 | Design system | ✅ Complete |
| 3 | Screen designs (Stitch) | ⬜ Next |
| 4 | `features/auth` | ⬜ |
| 5 | `features/products` + search history + recently viewed | ⬜ |
| 6 | `features/cart_checkout` | ⬜ |
| 7 | `features/orders` | ⬜ |
| 8 | `features/wishlist`, `features/addresses`, `features/reviews` | ⬜ |
| 9 | `features/seller` | ⬜ |
| 10 | `features/admin` | ⬜ |
| 11 | `features/recommendations` (Gemini) | ⬜ |
| 12 | `features/weather` & `features/mandi_prices` (real APIs) | ⬜ |
| 13 | Voice search & full multilingual polish | ⬜ |
| 14 | Notifications, community forum, offline mode | ⬜ |
| 15 | Testing & QA | ⬜ |
| 16 | Deployment prep | ⬜ |

---

## Branching Strategy

```
main          — always stable, deployable
develop       — integration branch
stage-N-name  — one branch per roadmap stage
```

Feature branches are PR'd into `develop` after manual testing, then `develop` is merged into `main` at milestone completions. Each completed stage is tagged `vX.Y-stage-name`.

---

## Environment Variables

Copy `.env.example` to `.env` and populate before running:

| Variable | Purpose |
|----------|---------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary image upload |
| `CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned preset |
| `GEMINI_API_KEY` | Gemini AI recommendations (Stage 11) |
| `OPENWEATHER_API_KEY` | Weather data (Stage 12) |
| `RAZORPAY_KEY_ID` | Payment gateway test mode (Stage 6) |
| `MANDI_API_KEY` | Government mandi price API (Stage 12) |

Firebase keys are handled separately by `flutterfire configure` and are **never stored in `.env`**.

---

## License

Private — not open for redistribution.