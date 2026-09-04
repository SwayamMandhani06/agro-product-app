# AgriTrade — Stage 6 Visual & Interaction QA Audit

**Date:** March 4, 2026  
**Auditor:** AgriTrade Platform Engineering Team  
**Scope:** `apps/web` (Next.js SaaS Portal) & `apps/mobile` (Flutter Native Client)  
**Standard:** Modern Agrarian Fintech + Premium B2B Commerce + Enterprise SaaS  

---

## 1. Executive Summary

Stage 6 delivers an institutional-grade transformation of AgriTrade. Every screen across the web application and native mobile client was subjected to a comprehensive visual and interaction quality audit.

All design violations strictly prohibited by the Stage 6 mandate have been audited and verified absent:
- Zero emojis in UI copy, buttons, or badges.
- Zero cartoon agriculture illustrations or floating blobs.
- Zero neon glows, random gradients, or generic AI landing page layouts.
- Zero janky looping animations or unconstrained snackbar popups.

---

## 2. Route-by-Route Visual Audit (`apps/web`)

| Route | Visual Treatment & Aesthetics | Real-Time & Interaction State | Motion & Responsive Behavior | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/` (Homepage) | Asymmetric editorial layout. High-contrast typography with `#0B3D2E` deep forest green, `#111827` slate text, and restrained `#D97706` amber accents. Product preview terminal mimics real Bloomberg/Linear terminal styling. | Live ticker displays 8 APMC benchmark quotes; simulated active consignment `#ORD-2024-001` with Delhivery Express live telemetry. | Smooth 240ms cubic-bezier transitions; respects `prefers-reduced-motion`; fluid single-column collapse under 768px. | **PASS** |
| `/home` (Farmer Dashboard) | Dense, information-rich card hierarchy. High-contrast weather advisory, AI agronomic recommendations, and immediate APMC mandi price snapshots. | Real-time connection badge in header (`● Live`). Dynamic notification bell counter reacts to incoming events. | Subtle card hover elevation; skeleton shimmer states during async fetch. | **PASS** |
| `/mandi` (Market Intelligence) | Institutional terminal presentation. Monospace numerical pricing (`tabular-nums`), directional indicator glyphs (`▲`/`▼`), and live heartbeat (`● LIVE · Updated Xs ago`). | Real-time price movement highlights row with transient 1.8s `#F0FDF4` tint fade. Arbitrage comparison drawer slides out seamlessly. | Non-blocking filter chips (Soybean, Cotton, Wheat, Mustard, Onion, Chana, Maize, Rice). Zero bright flashing. | **PASS** |
| `/notifications` (Alerts Center) | Clean segmented filter tabs (All, Unread, Orders, Market, Weather, Products, System). Category icons with subtle muted badge backdrops. | Live unread counter in header dropdown and page header. Instant optimistic "Mark as read" and "Mark all as read" with zero jitter. | Micro-animations on read toggle; empty state renders restrained clipboard vector. | **PASS** |
| `/orders` (Consignments) | Dense operational tabular view. Order status badges (`placed`, `processing`, `shipped`, `out_for_delivery`, `delivered`) styled with agrarian neutral tokens. | Live status sync automatically reflects changes emitted across the websocket channel. | Clean pagination, search by order ID, and direct action to live order tracking. | **PASS** |
| `/orders/[id]` (Tracking Timeline) | Multi-stage logistics timeline with carrier metadata (Delhivery Cargo Express, driver name, vehicle number, dispatch timestamp). | Interactive "Simulate Next Delivery Milestone" button pushes real-time status advance and fires background notification. | Step indicators transition with smooth fill; active stage highlighted with restrained forest green border. | **PASS** |
| `/community` (Forum) | Professional agronomic knowledge exchange. Verified grower badges, clean threaded responses, category filters. | Non-disruptive update notification banner ("1 new discussion available · Click to show") prevents reading interruption. Optimistic liking. | Accordion comment drawer; form submission disabled while empty; optimistic like count increment. | **PASS** |
| `/products` (Catalog) | 4-column responsive grid with crisp typography, certified seed germination badges, and clear unit pricing (`₹/bag`, `₹/bottle`). | Filter drawer by category, price range, and in-stock status. Instant debounce on text search. | Image zoom on hover; clean Add-to-Cart optimistic count increment. | **PASS** |
| `/products/[id]` (Product Detail) | Detailed technical specifications table (germination rate, chemical composition, application dosage, safety intervals). | Sticky bottom bar on mobile web; quantity incrementer recalculates farm acre savings dynamically. | Tabbed switching between Specs, Agronomic Advisory, and Verified Reviews. | **PASS** |
| `/saved` (Wishlist) | Clean grid of bookmarked inputs with live stock availability indicators and direct "Move to Cart" actions. | Optimistic bookmark removal and addition with rollback on failure. | Staggered grid reveal; restrained empty state illustration. | **PASS** |
| `/profile` (Account & Farm) | Institutional profile card displaying farmer verification level, active land parcels, and linked cooperatives. | Instant session refresh and clean logout transition. | Accessible form controls and clean keyboard focus rings. | **PASS** |

---

## 3. Mobile Visual & Interaction Audit (`apps/mobile`)

| Screen | Design System Conformance | Real-Time Behavior | Outdoor Readability & Touch Target | Status |
| :--- | :--- | :--- | :--- | :--- |
| `MandiPricesScreen` | Native Material 3 with customized AgriTrade theme tokens. Compact commodity cards with clean spacing and subtle dividers. | Real-time `LIVE` connection badge in AppBar. `LiveMandiPricesNotifier` updates prices as ticks arrive without rebuild jitter. | 48dp touch targets on crop filter chips. High-contrast numbers readable in direct sunlight. | **PASS** |
| `OrderTrackingScreen` | Linear timeline view with completed, current, and upcoming logistics checkpoints. Carrier phone and name displayed cleanly. | Real-time `OrderSubscription` updates state immediately when status transitions occur. | Restrained colors; no celebratory confetti or oversized success icons. | **PASS** |
| `NotificationsScreen` | Clean list with read/unread visual indicators. Filterable by category. | Real-time `NotificationSubscription` stream listener prepends new items dynamically. | Swipe actions and clear "Mark all read" header action. | **PASS** |
| `HomeScreen` | High-density dashboard with greeting, weather hero, AI prompt card, and live Mandi horizontal carousel. | Synchronized with `dashboardMandiPricesProvider` and reactive unread notification count. | Pull-to-refresh with customized forest-green indicator. | **PASS** |

---

## 4. Connection State & Degraded Mode Verification

1. **Online State (`connected`):**
   - Web: Header displays subtle `● Live` pill with green dot.
   - Mobile: AppBar displays `LIVE` badge.
2. **Offline State (`offline`):**
   - Web: Non-intrusive banner appears: `"You're offline. Showing the latest available information."` with `WifiOff` icon.
   - Mobile: Restrained banner displayed under AppBar.
3. **Reconnecting State (`reconnecting`):**
   - Web & Mobile: Status indicator displays `Reconnecting...` in amber.
4. **Reconnected State (`connected` after `offline`):**
   - Web & Mobile: Non-intrusive confirmation toast: `"Connection restored"` for 3 seconds then fades out.

---

## 5. Visual QA Sign-Off

- **No Emojis:** Verified 0 occurrences in production code and UI copy.
- **No Cartoon Graphics:** All visual elements utilize SVG icons (`lucide-react` / `Material Symbols`) or photography resolved via `ProductImageResolver`.
- **Typography:** Outfit / Inter / Roboto typography applied across headers, tables, and buttons.
- **Motion Restraint:** All transitions configured between 160ms and 240ms with `cubic-bezier(0.2, 0, 0, 1)`.
