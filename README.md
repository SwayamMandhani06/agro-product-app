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
│   ├── design_system/   # (Stage 2) colour tokens, typography, spacing, theme
│   ├── di/              # Riverpod DI providers, Firebase bootstrap, Remote Config
│   ├── error/           # Sealed Failure hierarchy + exception → failure mapper
│   ├── localization/    # Supported locales (en / hi / mr)
│   ├── network/         # Dio client wrapper + .env config reader
│   ├── routing/         # go_router config, route constants, auth redirect (Stage 4)
│   └── widgets/         # (Stage 2) shared design-system widgets
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

## Current Status — Stage 1 Complete

> **Development follows a 17-stage build roadmap. Only completed stages are described below.**

### ✅ Stage 0 — Git & GitHub Setup
Repository initialized with `main` / `develop` / `stage-N-*` branching strategy.

### ✅ Stage 1 — Flutter Project, Clean Architecture Skeleton & Core Infra

Everything in Stage 1 is wired and verified (`flutter analyze` clean, 6/6 tests pass, web debug build succeeds):

- **Full project scaffold** — all 17 feature directories with `domain/`, `data/`, `presentation/` layers
- **Firebase initialized** — `firebase_core` init, `firebase_analytics` router observer, `firebase_crashlytics` fatal/non-fatal error handlers, `firebase_remote_config` with feature-flag defaults
- **Firebase configured for:** Android ✅ · Web ✅ · Windows ✅ · iOS ⏳ · macOS ⏳
- **Dependency injection** — Riverpod `ProviderScope` at root; `appProviderOverrides()` for test swapping
- **Error handling** — sealed `Failure` hierarchy (`NetworkFailure`, `ServerFailure`, `AuthFailure`, `NotFoundFailure`, `UnknownFailure`); `Either<Failure, T>` as the universal repository return type; exception-to-failure mapper covering Dio and Firebase exceptions
- **Network layer** — Dio client with `connectivity_plus` pre-flight guard; typed `.env` config reader
- **Routing** — go_router with `FirebaseAnalyticsObserver`; route constants for all 17 features; auth/role redirect deferred to Stage 4
- **Localization** — `easy_localization` with EN / HI / MR locales; translation assets scaffolded
- **Plug-in seams** (interfaces + mock implementations, Riverpod-swappable):
  - `WeatherRepository` / `MockWeatherRepository`
  - `MandiPriceRepository` / `MockMandiPriceRepository`
  - `RecommendationRepository` / `MockRecommendationRepository`
  - `PaymentGateway` / `MockPaymentGateway`

---

## Roadmap

| Stage | Feature | Status |
|-------|---------|--------|
| 0 | Git & GitHub setup | ✅ Complete |
| 1 | Flutter project, Clean Architecture skeleton & core infra | ✅ Complete |
| 2 | Design system | ⬜ Next |
| 3 | Screen designs (Stitch) | ⬜ |
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
