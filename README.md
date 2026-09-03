# AgriTrade — Modern Agricultural Marketplace

> A production-grade agricultural e-commerce platform connecting Indian farmers directly with verified agri-input suppliers and manufacturers — eliminating middlemen for transparent market access, certified inputs, and fair pricing.

Originally conceptualized as a Community Engagement Project (CEP) at PCCOE, rebuilt from the ground up following Clean Architecture, domain-driven design, and the **Google Stitch** visual design system.

> 📦 **Monorepo Structure:**
> - `apps/mobile/` — Flutter mobile application (Android & iOS)
> - `apps/web/` — Reserved for future Next.js web application (out of current mobile scope)

---

## Implemented User Journey

AgriTrade provides a seamless, end-to-end agricultural commerce and authenticated farmer experience:

```text
               Application Launch (Splash Screen)
                               │
                [Session Restoration Check]
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
     [Unauthenticated]                     [Authenticated]
      Welcome Screen                              │
      (Value Props)                               │
            │                                     │
     ┌──────┴──────┐                              │
     ▼             ▼                              │
  Sign In       Sign Up                           │
     │             │                              │
     └──────┬──────┘                              │
            ▼                                     │
      Authenticate & Persist                      │
            │                                     │
            └─────────────────► ◄─────────────────┘
                                │
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
                               │
                               ▼
                    Farmer Profile & Settings
                               │
                            Sign Out
                               │
                               ▼
                         Welcome Screen
```

---

## Key Features Completed

### 1. Authentication, Session Management & App Entry (Stage 4A)
* **Google Stitch Splash Screen:** Matching Stitch `6831455a4a284ef7b95f228fd20fbb27` with deep agrarian forest green background (`#0B3D2E`), centralized AgriTrade branding, and animated pulsing dots loading indicator.
* **Welcome Screen:** Unauthenticated entry portal featuring certified farm inputs, transparent wholesale pricing, and doorstep delivery value propositions with dual "Sign In" and "Create Account" actions.
* **Sign In Screen:** Matching Stitch `af256a0b38d24d77b5304c8b889e9fdc` with clean card surface, phone/email input, password visibility toggle, validation, error banner, and one-tap demo farmer credentials helper (`farmer@agritrade.in` / `farmer123`).
* **Create Account Screen:** Full registration experience supporting farmer name, mobile/email, password rules, and confirmation matching.
* **Clean Architecture Domain:** Decoupled `AppUser` entity and `AuthRepository` interface allowing drop-in replacement with `FirebaseAuthRepository` in future stages.
* **Persistent Session Management:** Hive-backed session storage (`HiveAuthSessionStorage`) preserving session tokens across app restarts, with in-memory fallback (`InMemoryAuthSessionStorage`) for ultra-fast, isolated unit testing.
* **Riverpod Auth State Management:** Reactive `AuthState` sealed hierarchy (`AuthInitializing`, `Authenticated`, `Unauthenticated`, `AuthLoading`, `AuthError`) and `AuthNotifier`.
* **Route Protection & GoRouter Redirection:** Zero-flicker launch checking, strict redirection of unauthenticated traffic to `/welcome`, and preservation of deep links.
* **Sign Out Integration:** Profile screen identity summary with verified farmer badge and clean sign out action returning the user to the Welcome portal.

### 2. Farmer Home Dashboard (Stage 3B)
* **Personalized Greeting & Context:** Farmer profile banner (`Rahul Sharma`) with location and live cart count badge.
* **Weather & Farm Insights:** Real-time localized weather card with crop-specific advisory alerts.
* **Mandi Market Rates:** Live commodity price ticker across regional APMC markets.
* **Agricultural Category Shortcuts:** Quick access to Seeds, Fertilizers, Pesticides, and Farm Machinery.
* **Featured Agri Products:** Curated products with promotional discount tags, ratings, and quick-add actions.

### 3. Product Discovery Experience (Stage 3C)
* **Visual Category Browsing:** Interactive grid of agricultural categories with dynamic counts and badges.
* **Product Listing Grid:** Responsive two-column product card catalog with high-resolution imagery.
* **Instant Search & Autocomplete:** Real-time search with instant filtering by query, category, and brand.
* **Filter Bottom Sheet:** Multi-attribute filtering across price range slider, star rating thresholds, and in-stock availability.
* **Sort Bottom Sheet:** Sorting by Featured, Price (Low to High), Price (High to Low), and Customer Rating.
* **Product Details Screen:** Detailed specifications, packaging sizes, verified seller credential cards, customer ratings breakdown, and similar products carousel.

### 4. Cart & Checkout Experience (Stage 3D)
* **Reactive Cart Badges:** Real-time badge indicators across the AppBar, Dashboard, and Product Details screens.
* **Cart Management:** Cart item list with thumbnail previews, instant quantity steppers `[-] X [+]`, and item removal.
* **Duplicate Quantity Merging:** Adding existing items from discovery smoothly merges quantities without creating duplicates.
* **Dynamic Bill Summary:** Live subtotal calculation, automated discount breakdown, and green savings banner.
* **Delivery Fee Rules:** Dynamic delivery logic ($₹0$ Free Delivery on orders $\ge ₹1,000$; flat $₹99$ agricultural freight below $₹1,000$).
* **Interactive Bottom Sheets:** Saved delivery address selector with address tags (`Farm`, `Home`) and payment method selector (`Cash on Delivery`, `UPI`, `Net Banking`, `Card`).
* **Order Placement & Confirmation:** Asynchronous checkout simulation, automatic cart clearing, and animated confirmation screen with unique order tracking ID `#AT...`.

### 5. Orders, Details & Tracking (Stage 3E)
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
| :--- | :--- |
| **Framework** | Flutter 3.x (Dart 3.x) |
| **Architecture** | Clean Architecture (Domain, Data, Presentation) |
| **State Management** | Flutter Riverpod (StateNotifier, StateProvider, Provider) |
| **Navigation & Routing** | GoRouter with StatefulShellRoute and Auth Guarding |
| **Functional Error Handling** | `fpdart` (`Either<Failure, T>`, `Result<T>`) |
| **Design System** | Google Stitch Design Tokens (Forest Green `#0B3D2E`, Amber `#D97706`, Canvas `#F9F7F2`) |
| **Persistence** | Hive Key-Value Store (`hive_flutter`) with Session Storage |
| **Analytics & Core** | Firebase Core & Firebase Analytics (safely conditioned) |
| **Testing** | Flutter Test (Unit, Provider, Widget, and Navigation Integration) |

---

## Quality Assurance & Verification

The codebase maintains 100% test passing rates with strict analyzer hygiene:

```bash
cd apps/mobile

# 1. Static code analysis
flutter analyze
# Output: No issues found! (0 errors, 0 warnings, 0 hints)

# 2. Run automated unit and widget tests
flutter test
# Output: All 94 tests passed! (77 baseline + 17 Stage 4A auth tests)

# 3. Verify Android debug build pipeline
flutter build apk --debug
# Output: Built build/app/outputs/flutter-apk/app-debug.apk in 42.9s
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
Stage 4A — Auth, Session Management & App Entry Flow      ✅ Complete (Active Branch: stage-4a-authentication)
─────────────────────────────────────────────────────────────────────────────
Stage 4B — Live Phone OTP Authentication & Supabase/Firebase ⬜ Planned / Next
Stage 4C — Farmer Profile & Farm Land Parcel Management   ⬜ Planned
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
stage-4a-authentication    — Stage 4A Authentication feature branch
stage-3-orders-tracking    — Stage 3E Orders & Tracking branch
```

---

## License

Private — Developed for AgriTrade agricultural commerce initiatives. All rights reserved.