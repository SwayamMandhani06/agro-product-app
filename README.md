# AgriTrade — Modern Agricultural Marketplace

> A production-grade agricultural e-commerce platform connecting Indian farmers directly with verified agri-input suppliers and manufacturers — eliminating middlemen for transparent market access, certified inputs, and fair pricing.

Originally conceptualized as a Community Engagement Project (CEP) at PCCOE, rebuilt from the ground up following Clean Architecture, domain-driven design, and the **Google Stitch** visual design system.

> 📦 **Monorepo Structure:**
> - `apps/mobile/` — Flutter mobile application (Android & iOS)
> - `apps/web/` — Reserved for future Next.js web application (out of current mobile scope)

---

## Implemented User Journey

AgriTrade provides a seamless, end-to-end agricultural commerce experience:

```text
               Farmer Home Dashboard
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
  Category Discovery              Featured Products
         │                               │
         ▼                               ▼
  Product Listing Grid            Product Details
  (Filter & Sort)                        │
         │                               ▼
         └───────────────────────►  Add to Cart
                                         │
                                         ▼
                                     Cart Screen
                                 (Manage Quantities)
                                         │
                                         ▼
                                   Checkout Screen
                            (Address & Payment Selection)
                                         │
                                         ▼
                                 Place Mock Order
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
                        ┌────────────────┴────────────────┐
                        ▼                                 ▼
             Order Tracking Timeline                Reorder Items
          (Placed → Out for Delivery)           (Merge into Cart)
```

---

## Key Features Completed (Through Stage 3E)

### 1. Farmer Home Dashboard (Stage 3B)
* **Personalized Greeting & Context:** Farmer profile banner (`Rahul Sharma`) with location and live cart count badge.
* **Weather & Farm Insights:** Real-time localized weather card with crop-specific advisory alerts.
* **Mandi Market Rates:** Live commodity price ticker across regional APMC markets.
* **Agricultural Category Shortcuts:** Quick access to Seeds, Fertilizers, Pesticides, and Farm Machinery.
* **Featured Agri Products:** Curated products with promotional discount tags, ratings, and quick-add actions.

### 2. Product Discovery Experience (Stage 3C)
* **Visual Category Browsing:** Interactive grid of agricultural categories with dynamic counts and badges.
* **Product Listing Grid:** Responsive two-column product card catalog with high-resolution imagery.
* **Instant Search & Autocomplete:** Real-time search with instant filtering by query, category, and brand.
* **Filter Bottom Sheet:** Multi-attribute filtering across price range slider, star rating thresholds, and in-stock availability.
* **Sort Bottom Sheet:** Sorting by Featured, Price (Low to High), Price (High to Low), and Customer Rating.
* **Product Details Screen:** Detailed specifications, packaging sizes, verified seller credential cards, customer ratings breakdown, and similar products carousel.

### 3. Cart & Checkout Experience (Stage 3D)
* **Reactive Cart Badges:** Real-time badge indicators across the AppBar, Dashboard, and Product Details screens.
* **Cart Management:** Cart item list with thumbnail previews, instant quantity steppers `[-] X [+]`, and item removal.
* **Duplicate Quantity Merging:** Adding existing items from discovery smoothly merges quantities without creating duplicates.
* **Dynamic Bill Summary:** Live subtotal calculation, automated discount breakdown, and green savings banner.
* **Delivery Fee Rules:** Dynamic delivery logic ($₹0$ Free Delivery on orders $\ge ₹1,000$; flat $₹99$ agricultural freight below $₹1,000$).
* **Interactive Bottom Sheets:** Saved delivery address selector with address tags (`Farm`, `Home`) and payment method selector (`Cash on Delivery`, `UPI`, `Net Banking`, `Card`).
* **Order Placement & Confirmation:** Asynchronous checkout simulation, automatic cart clearing, and animated confirmation screen with unique order tracking ID `#AT...`.

### 4. Orders, Details & Tracking (Stage 3E)
* **My Orders Screen:** Tabbed filter chips (`All`, `Active`, `Delivered`, `Cancelled`) with live status chips and pull-to-refresh.
* **Polished Empty State:** Dedicated zero-orders screen featuring minimal iconography, explanatory copy, and a primary "Start Shopping" CTA.
* **Order Details Screen:** Comprehensive post-purchase summary with order ID, creation timestamp, product item breakdown, bill calculation, recipient address, and payment method.
* **Order Status Tracking Timeline:** Vertical 6-stage lifecycle tracking:
  $$\text{Order Placed} \longrightarrow \text{Confirmed} \longrightarrow \text{Packed} \longrightarrow \text{Shipped} \longrightarrow \text{Out for Delivery} \longrightarrow \text{Delivered}$$
  Differentiates completed steps (green check), current active step (icon badge + agent info), and pending stages.
* **Delivery Agent Details:** Displays assigned logistics partner name and contact number when an order is out for delivery.
* **Cancellation Flow:** Modal bottom sheet allowing active order cancellation with reason selection and status updates.
* **Reorder Integration:** One-tap reorder action that pushes all ordered products back into the active cart, preserves stock constraints, increments existing quantities, and provides instant "View Cart" navigation.

---

## Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Core Framework** | Flutter 3.x (Dart 3.x) targeting Android & iOS |
| **State Management** | Flutter Riverpod 2 (`StateNotifier`, `Provider`, `FutureProvider`, `ProviderScope`) |
| **Routing** | GoRouter 14 (`StatefulShellRoute.indexedStack`, nested routes, deep-link safe) |
| **Visual Authority** | Google Stitch Design System (Project ID: `15601137375538914645`) |
| **Design System** | Modern Agrarian Palette (`#0B3D2E` Forest Green, `#D97706` Amber, `#F9F7F2` Canvas), Material 3, Plus Jakarta Sans |
| **Image Caching** | `cached_network_image` with local fallbacks |
| **Functional Architecture** | `fpdart` (`Either<Failure, T>`), Repository Pattern with clean abstractions |
| **Formatting** | `intl` (Indian Rupee `₹`, standard date-time representations) |

---

## Repository Architecture

```text
agro-product-app/
│
├── apps/
│   ├── mobile/                      # Production Flutter Application
│   │   ├── android/                 # Native Android project configuration
│   │   ├── ios/                     # Native iOS project configuration
│   │   ├── lib/
│   │   │   ├── core/
│   │   │   │   ├── design_system/   # Design tokens (AppColors, AppTypography, AppSpacing, AppRadius)
│   │   │   │   ├── di/              # Firebase bootstrap and service locator overrides
│   │   │   │   ├── error/           # Sealed Failure hierarchy
│   │   │   │   ├── routing/         # GoRouter routing, paths, and shell navigation
│   │   │   │   └── widgets/         # Reusable core widgets (AppButton, AppCard, AppLoading)
│   │   │   │
│   │   │   └── features/
│   │   │       ├── home/            # Farmer Dashboard, Greeting Header, Mandi Rates
│   │   │       ├── products/        # Categories, Product Listing, Search, Product Details
│   │   │       ├── cart_checkout/   # Cart, Checkout, Order Confirmation, CartItem, Order entities
│   │   │       ├── orders/          # My Orders, Order Details, Tracking Timeline, OrderCard
│   │   │       ├── weather/         # Weather domain & data abstractions
│   │   │       ├── mandi_prices/    # APMC market rates domain & data abstractions
│   │   │       ├── profile/         # Profile management
│   │   │       └── auth/            # Authentication contracts
│   │   │
│   │   ├── test/                    # 77 automated unit & widget test suites
│   │   ├── pubspec.yaml             # Mobile dependencies and asset declarations
│   │   └── analysis_options.yaml    # Strict linting rules
│   │
│   └── web/                         # Reserved for future Next.js application
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Flutter SDK $\ge 3.24.0$
- Dart SDK $\ge 3.5.0$
- Android Studio / VS Code with Flutter extension
- Android SDK $\ge 34$ / iOS Xcode $\ge 15$

### Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/SwayamMandhani06/agro-product-app.git
cd agro-product-app

# 2. Navigate to the mobile workspace
cd apps/mobile

# 3. Install dependencies
flutter pub get

# 4. Run the mobile application on a connected device or emulator
flutter run
```

---

## Testing & Verification

The codebase maintains 100% test passing rates with strict analyzer hygiene:

```bash
cd apps/mobile

# 1. Static code analysis
flutter analyze
# Output: No issues found! (0 errors, 0 warnings, 0 hints)

# 2. Run automated unit and widget tests
flutter test
# Output: All 77 tests passed!

# 3. Verify Android debug build pipeline
flutter build apk --debug
# Output: Built build/app/outputs/flutter-apk/app-debug.apk
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
Stage 3E — Orders, Order Details & Tracking               ✅ Complete (Active Branch)
─────────────────────────────────────────────────────────────────────────────
Stage 4  — Real Authentication & User Profiles            ⬜ Planned / Next
Stage 5  — Live Firestore Backend & Real-time Sync        ⬜ Planned
Stage 6  — Payment Gateway Integration (Razorpay/UPI)      ⬜ Planned
Stage 7  — Real-time Courier & Logistics Tracking APIs     ⬜ Planned
Stage 8  — Seller & Manufacturer Portal                   ⬜ Planned
```

---

## Branching Strategy

```text
main                       — Production releases (stable)
develop                    — Active integration branch
stage-3-orders-tracking    — Stage 3E Orders & Tracking feature branch
```

---

## License

Private — Developed for AgriTrade agricultural commerce initiatives. All rights reserved.