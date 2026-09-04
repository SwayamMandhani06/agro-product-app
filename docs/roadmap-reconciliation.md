# AgriTrade Roadmap Reconciliation & Implementation Matrix

**Date:** September 4, 2026  
**Audit Context:** Reconciles the original 17-stage mobile roadmap (`Agro_Product_App_Build_Roadmap.md`), web demo roadmap (`Agro_Product_App_Web_Roadmap.md`), architectural decisions (ADR-004 Supabase Backend), and the actual state of the codebase.

---

## 1. Architectural Pivot Summary

| Original Roadmap Spec | Architectural Reality (ADR-004 & Stage 4B) | Reason & Impact |
|:---|:---|:---|
| **Backend**: Firebase Auth, Firestore, Cloud Functions, FCM | **Backend**: Supabase (PostgreSQL 16) with PostgREST, RLS policies, and WebSocket subscriptions | PostgreSQL provides strict ACID guarantees for transactions, relational foreign keys for orders/products, and native JSONB flexibility for diverse agricultural input specifications. |
| **Mobile-First Prototype** | **Dual-Platform Synchronized Ecosystem** (`apps/mobile` + `apps/web`) | A responsive Next.js 16 web application serves as the primary desktop demonstration product, while Flutter mobile provides the farmer field companion. |
| **Staged Sequential Stubs** | **Feature-Complete Pre-implementations** (Stage 4E) | Features originally planned for Stages 8, 12, and 14 (Wishlist, Reviews, Weather, Mandi Prices, Forum, Notifications) have already been designed and built in Stage 4E with full dual-platform parity. |

---

## 2. Complete Roadmap Stage Reconciliation Matrix

| Stage & Feature Domain | Intended Original Scope | Current Implementation State | Web (`apps/web`) | Mobile (`apps/mobile`) | Backend (`supabase/`) | Parity & Status |
|:---|:---|:---|:---|:---|:---|:---|
| **Stage 0**: Monorepo Restructuring | Scaffold `apps/mobile/` and `apps/web/` | **COMPLETE** | Next.js 16 App Router | Flutter 3.44+ Material 3 | Centralized `supabase/` | ✅ 100% Complete |
| **Stage 1**: Core Infrastructure | Folder architecture, Failure models, DI | **COMPLETE** | Result/Failure types, Zustand | Clean Architecture, Riverpod | Environment config | ✅ 100% Complete |
| **Stage 2**: Design System | Tokens, Typography, Colors, Widgets | **COMPLETE** | Tailwind CSS 4, Lucide icons | `AppColors`, `AppRadius`, `AppTheme` | Design tokens docs | ✅ 100% Complete |
| **Stage 3B**: Farmer Home Dashboard | Greeting, KPI metrics, Mandi ticker, grid | **COMPLETE** | `/home` route | `HomeScreen` + widgets | `mandi_prices` seed | ✅ 100% Complete |
| **Stage 3C**: Product Discovery | Categories, search, filter sheet, details | **COMPLETE** | `/categories`, `/products`, `[id]` | `ProductsScreen`, details | `categories`, `products` | ✅ 100% Complete |
| **Stage 3D**: Cart & Checkout | Item stepper, address pick, COD/Mock pay | **COMPLETE** | `/cart`, `/checkout`, `/confirmed` | `CartScreen`, `CheckoutScreen` | `carts`, `cart_items` | ✅ 100% Complete |
| **Stage 3E**: Orders & Tracking | History list, status timeline, reorder | **COMPLETE** | `/orders`, `/orders/[id]` | `OrdersScreen`, tracking | `orders`, `order_items` | ✅ 100% Complete |
| **Stage 4A**: Authentication Flow | Welcome, Sign in, Sign up, Session | **COMPLETE** | `/welcome`, `/login`, `/signup` | `WelcomeScreen`, Auth router | `profiles` RLS | ✅ 100% Complete |
| **Stage 4B**: Premium Design & Contracts | Emoji removal, restrained tokens, ADR-004 | **COMPLETE** | Lucide SVGs, no emojis | Stitch tokens, Clean Arch | API Contract schemas | ✅ 100% Complete |
| **Stage 4C**: Motion System & Media | Easing curves, photo resolvers, layout | **COMPLETE** | Motion keyframes, Unsplash | `AppMotion` presets | Deterministic URLs | ✅ 100% Complete |
| **Stage 4D**: Backend Sync & SaaS Landing | Supabase schema, concrete repos, landing | **COMPLETE** | `/` SaaS showcase landing page | Dio PostgREST repositories | PostgreSQL 16 schema | ✅ 100% Complete |
| **Stage 4E**: Farmer Intelligence & Community | Wishlist, Reviews, Forum, Alerts, Weather | **COMPLETE** | `/saved`, `/community`, `/mandi`, `/weather`, `/notifications` | `WishlistScreen`, `ReviewsScreen`, `ForumScreen`, `NotificationsScreen` | `20260904000000` migration | ✅ 100% Complete |
| **Stage 5**: Backend Hardening & Data Integrity | Real PostgREST wiring, RLS audit, seam completion | **COMPLETE** | PostgREST repositories, hardened stores | Supabase conditional repositories | Strict RLS & foreign keys | ✅ 100% Complete |
| **Stage 6**: Real-Time Intelligence & Live Operations | Supabase Realtime WSS, APMC mandi terminal, order tracking | **COMPLETE** | Realtime client, live Mandi terminal, operational order timeline, popover alerts | `RealtimeService`, `LiveMandiPricesNotifier`, stream providers | `REPLICA IDENTITY FULL`, `supabase_realtime` pub | ✅ 100% Complete |
| **Stage 7**: Payment Infrastructure & Secure Checkout | Razorpay Test Mode, Demo fallback, COD, secure transactions | **COMPLETE** | Payment abstraction, Razorpay Test SDK, Demo provider, 2-column checkout, receipt | Native payment sheet, Demo provider, Riverpod checkout state, receipt sheet | `payments`, `payment_events`, strict RLS | ✅ 100% Complete |
| **Stage 8**: Logistics & Rural Delivery Integration | Consignment tracking, line-haul corridors, demo logistics simulator, SVG corridor visualizer | **COMPLETE** | `/shipments` operational dashboard, split-panel `/orders/[id]`, SVG corridor visualizer | `Shipment` domain, `DemoLogisticsProvider`, `DeliveryAttemptSheet`, breathing active node timeline | `shipments`, `tracking_events`, `delivery_agents`, `delivery_attempts`, Realtime pub | ✅ 100% Complete |
| **Stage 9**: Advanced Analytics & Decision Intelligence | Spend analytics, category breakdown, deterministic insight engine, savings intelligence, APMC workspace | **COMPLETE** | `/insights` Bloomberg-lite workspace, SVG spending area chart with crosshairs, category bars, detail drawer | `FarmInsightsScreen`, `CustomPainter` sparkline, `InsightDetailSheet`, Riverpod providers | `v_user_spending_summary`, `v_user_category_spending`, `v_commodity_price_trends`, `v_delivery_performance_metrics` | ✅ 100% Complete |
| **Stage 10**: Seller & Cooperative Marketplace | Multi-vendor inventory CRUD, fulfillment, payout tracking | **PLANNED** | `/seller/dashboard`, inventory table | Seller navigation shell | Seller role RLS | ⬜ Planned |
| **Stage 11**: Admin & Platform Operations | Platform moderation, dispute resolution, price controls | **PLANNED** | `/admin/dashboard`, verification queue | Admin monitoring views | Admin role RLS | ⬜ Planned |
| **Stage 12**: Final Production Polish & Deployment | End-to-end portfolio polish, performance optimization, release automation | **PLANNED** | Production showcase deployment | Final mobile packaging | Production hardening | ⬜ Planned |

---

## 3. Detailed Audit of Completed vs Seamed Features

### Wishlist / Saved Items
- **Mobile**: Full Clean Architecture (`WishlistScreen`, `wishlistProvider`, `MockWishlistRepository`, `SupabaseWishlistRepository`).
- **Web**: `/saved` page with `useWishlistStore`.
- **Backend**: `public.wishlists` table with `(user_id, product_id)` unique constraint and RLS policies.
- **Seam to Harden**: Connect Web `useWishlistStore` to `SupabaseWishlistRepository` when backend credentials are present, falling back to localStorage. In Mobile, wire `wishlistRepositoryProvider` conditionally.

### Product Reviews & Ratings
- **Mobile**: `ReviewSummaryCard` (rating + 5-to-1 breakdown bars), `ReviewCard`, `WriteReviewSheet` modal, `MockReviewRepository`, `SupabaseReviewRepository`.
- **Web**: Rating summary card, verified farmer review list, write review modal on `/products/[id]`.
- **Backend**: `public.reviews` table with 1.0–5.0 range check and RLS policies.
- **Seam to Harden**: Ensure Web review repository submits directly to Supabase when configured, and wire Mobile `reviewRepositoryProvider` conditionally.

### Notification Center & Real-Time Alerts
- **Mobile**: `NotificationsScreen` with 5 category filters (`orders`, `prices`, `products`, `weather`, `system`), `MockNotificationRepository`, `SupabaseNotificationRepository`.
- **Web**: `/notifications` page with category tabs, unread indicators, mark-all-read action.
- **Backend**: `public.notifications` table with RLS policies and `is_read` index.
- **Seam to Harden**: Wire Web `useNotificationStore` to query Supabase `notifications` table, and wire Mobile `notificationRepositoryProvider` conditionally.

### Community Farmer Forum
- **Mobile**: `ForumScreen` with topic filters, upvoting, threaded replies, `MockCommunityRepository`, `SupabaseCommunityRepository`.
- **Web**: `/community` page with topic filters, upvote toggle, collapsible comment threads, new post modal.
- **Backend**: `public.community_posts` and `public.community_comments` with category check constraints and RLS.
- **Seam to Harden**: Ensure post submissions on Web and Mobile persist to Supabase when configured.

### Weather & Agronomic Spray Advisories
- **Mobile**: `WeatherScreen` with 5-day forecast, `WeatherHeroCard` on home dashboard, spray condition advisories.
- **Web**: `/weather` route with weather parameter cards, agro-advisories, and spray window indicators.
- **Backend**: Weather domain models and mock data repositories.

### Mandi APMC Price Discovery
- **Mobile**: `MandiPricesScreen` with 7-day sparkline charts, market distance comparisons, trend diff badges.
- **Web**: `/mandi` route with commodity search, price range filter, arrivals, and min/max/modal pricing.
- **Backend**: `public.mandi_prices` table with real Indian commodity rates (Soybean, Cotton, Wheat, Mustard, etc.).

---

## 4. Completed: STAGE 8 — Logistics, Delivery Operations & Shipment Intelligence

**Status**: ✅ COMPLETED (Branch: `stage-8-logistics-operations`)

### Deliverables Achieved in Stage 8:
1. **Canonical PostgreSQL Migration (`20260904220000_stage_8_logistics_operations.sql`)**:
   - Schema tables: `delivery_agents`, `shipments`, `tracking_events`, `delivery_attempts`.
   - Strict Row Level Security policies with user isolation.
   - Production performance indexes and `supabase_realtime` publication.
2. **Provider Abstraction & Free-Tier Deterministic Simulation**:
   - `LogisticsProvider` contract with `DemoLogisticsProvider` simulator.
   - `LogisticsApiAdapter` boundary for future Shiprocket / Delhivery Rural live connections.
   - Zero paid map or SMS subscriptions required.
3. **Web Operational Command Experience (`apps/web`)**:
   - `/orders/[id]`: Upgraded into a split-panel view (Left: Granular milestone tracking; Right: Delivery Intelligence card with ETA, carrier, location, agent card, and demo simulation controls).
   - `/shipments`: Brand new desktop-first logistics operations dashboard with 4 metric cards, topological SVG route corridor visualizer, search, status filters, and interactive slide-over detail drawer.
   - Navigation: Added `/shipments` ("Logistics") to `NAV_LINKS`.
4. **Mobile Native Material 3 Tracking Experience (`apps/mobile`)**:
   - Enhanced `OrderTrackingScreen` with shipment header, waybill code, delivery agent card with direct contact button, and delivery issue notice.
   - `OrderTrackingTimeline` upgraded with gentle `_BreathingNode` scale animation on the active milestone.
   - `DeliveryAttemptSheet` supporting realistic rural exceptions (monsoon showers, tractor diversions, locked farm gates, survey number clarification).
5. **Real-time Synchronization**:
   - Supabase Realtime channel listening for `shipments` updates and `tracking_events` inserts across Web and Mobile.

---

## 5. Active & Reconciled Canonical Roadmap

- **Completed Stages:**
  - Stage 1–4E: Core infrastructure, design system, catalog, cart, auth, motion, and farmer intelligence.
  - Stage 5: Backend hardening, PostgREST direct integration, and RLS data integrity.
  - Stage 6: Real-time intelligence, live Mandi terminal, operational order tracking, and notification synchronization.
  - Stage 7: Payment infrastructure, Razorpay test mode, COD, and transaction receipts.
  - Stage 8: Logistics partner integration, rural delivery operations, and shipment intelligence.
- **Upcoming Stages:**
  - **Stage 9: Seller & Cooperative Marketplace** (Multi-vendor inventory CRUD, lot certificates, consignment dispatch, payouts).
  - **Stage 10: Admin & Platform Operations** (Dispute resolution, input certification verification, platform audit).
  - **Stage 11: Final Production Polish & Portfolio Deployment** (Performance optimization, release automation, end-to-end showcase).

### Architecture Alignment Rules
- The canonical backend is **Supabase / PostgreSQL 16**. Firebase/Firestore are deprecated and not used.
- Web (`apps/web`) and Mobile (`apps/mobile`) share identical domain entities, shipment states, and API contracts, but maintain platform-native UI layouts.
- Logistics systems strictly operate via `DemoLogisticsProvider` in free-tier demo mode, with clean adapter boundaries for future courier APIs. Real paid logistics or maps APIs are prohibited.
