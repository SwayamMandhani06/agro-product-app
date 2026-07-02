# Agro Product App

An agricultural e-commerce mobile app connecting farmers directly with verified sellers for seeds, fertilizers, pesticides, and equipment — cutting out middlemen for fairer pricing and better market access.

Originally conceptualized as a Community Engagement Project (CEP) at PCCOE, now being rebuilt as a production-oriented mobile application with a proper Clean Architecture codebase.

## Tech Stack

- **Frontend:** Flutter (Dart)
- **State Management:** Riverpod (`Notifier`, `AsyncNotifier`, `StreamProvider`)
- **Architecture:** Feature-first Clean Architecture (`domain` / `data` / `presentation` per feature)
- **Backend:** Firebase (Auth, Firestore, Cloud Messaging, Analytics, Crashlytics, Remote Config)
- **Image Storage:** Cloudinary (free tier)
- **AI Recommendations:** Gemini API via Google AI Studio
- **Weather:** OpenWeatherMap API
- **Mandi Prices:** data.gov.in / eNAM open data
- **Payments:** Razorpay (test mode)
- **Routing:** go_router
- **Localization:** easy_localization (English, Hindi, Marathi)
- **Offline cache:** Hive

## Roles

- **Farmer** — buys agricultural products, tracks orders, manages profile/addresses/wishlist
- **Seller** — lists products, manages inventory, fulfills orders
- **Admin** — verifies sellers, moderates products, oversees platform data

## Getting Started

1. Clone the repo and run `flutter pub get`
2. Copy `.env.example` to `.env` and fill in the required API keys (see file for the full list)
3. Run `flutterfire configure` to connect your own Firebase project (Spark/free plan)
4. `flutter run`

## Progress

- [ ] Stage 0 — Git & GitHub setup
- [ ] Stage 1 — Flutter project, Clean Architecture skeleton & core infra
- [ ] Stage 2 — Design system
- [ ] Stage 3 — Screen designs in Stitch
- [ ] Stage 4 — `features/auth`
- [ ] Stage 5 — `features/products` (+ search history, recently viewed)
- [ ] Stage 6 — `features/cart_checkout`
- [ ] Stage 7 — `features/orders`
- [ ] Stage 8 — `features/wishlist`, `features/addresses`, `features/reviews`
- [ ] Stage 9 — `features/seller`
- [ ] Stage 10 — `features/admin`
- [ ] Stage 11 — `features/recommendations` (Gemini)
- [ ] Stage 12 — `features/weather` & `features/mandi_prices`
- [ ] Stage 13 — Voice search & full multilingual polish
- [ ] Stage 14 — Notifications, community forum, offline mode
- [ ] Stage 15 — Testing & QA
- [ ] Stage 16 — Deployment prep

## Branching Strategy

- `main` — always stable, deployable
- `develop` — integration branch
- `stage-N-<name>` — one branch per roadmap stage, PR'd into `develop` after manual testing, tagged as `vX.Y-<name>` on merge

## Folder Structure

```
lib/
 ├── core/              # design system, DI, error handling, network, routing, localization
 └── features/
     ├── auth/
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

Each feature follows `domain/` (entities, repository interfaces, use cases) → `data/` (Firestore/API implementations) → `presentation/` (screens, Riverpod providers).
