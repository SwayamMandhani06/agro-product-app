# AgriTrade — Production Hardening & Architectural Governance

**Document Version:** 1.0 (Stage 12 Release Candidate)  
**Date:** September 4, 2026  
**Scope:** `apps/web` (Next.js 16 App Router), `apps/mobile` (Flutter 3.44+ Material 3), `supabase` (PostgreSQL 16)

---

## 1. Executive Summary

This document specifies the engineering standards, security guardrails, performance benchmarks, and accessibility compliance implemented in **Stage 12: Production Readiness**.

Through 12 iterative stages of engineering, AgriTrade has transformed from an early concept into an enterprise-grade agricultural commerce platform. The system supports full cross-platform parity across buyers (farmers), sellers, cooperatives, and administrators.

---

## 2. Accessibility & Usability (WCAG 2.1 AA Compliance)

### 2.1 Color Contrast & Visual Legibility
- **Text Contrast**: All core text styles adhere to minimum 4.5:1 contrast against surface backgrounds.
  - Primary text: `neutral900` (`#1A1A1A` on `#FFFFFF` -> 16.1:1 ratio)
  - Secondary text: `neutral700` (`#4A4A4A` on `#FFFFFF` -> 9.7:1 ratio)
  - Primary Brand Button: `stitchForestGreen` (`#1E5631` with `#FFFFFF` text -> 7.8:1 ratio)
- **Status Badges**: Never rely on color alone. Every badge pairs a distinctive background/foreground color with a semantic icon and clear textual status (e.g., `CheckCircle` for Delivered, `Clock` for Pending, `AlertTriangle` for Disputed).

### 2.2 Touch Targets & Ergonomics
- **Mobile Touch Targets**: All interactive elements (buttons, quantity selectors, filter chips, navigation tabs) maintain a minimum hit area of **48x48 logical pixels** per Material 3 guidelines.
- **Web Touch & Focus Rings**:
  - Minimum clickable area of 40px on desktop and 48px on responsive mobile breakpoints.
  - Visible `outline` with `ring-2 ring-emerald-500 ring-offset-2` for all interactive elements during keyboard tab navigation.

### 2.3 Semantic HTML & Screen Reader Support
- **Heading Hierarchy**: Exactly one `<h1>` per page, followed by sequential `<h2>`, `<h3>` headings without skipping levels.
- **ARIA Attributes**:
  - Interactive widgets (modals, dropdowns, persona switchers) feature proper `aria-haspopup`, `aria-expanded`, and `aria-label` attributes.
  - Image assets include informative `alt` text; decorative icons are marked with `aria-hidden="true"`.
  - Live announcements (`aria-live="polite"`) implemented for cart updates and Mandi ticker price shifts.

---

## 3. Performance Architecture & Network Optimization

### 3.1 Web Optimization (`apps/web`)
- **Server Components by Default**: Informational pages (`/welcome`, `/about`, static shells) utilize Next.js Server Components, transmitting zero client-side JavaScript for pure markup.
- **Dynamic Imports & Code Splitting**: Heavier interactive panels (admin analytics charts, dispute image zoom, complex filter sheets) are dynamically imported with custom skeleton loaders.
- **Image Optimization**: WebP formats with responsive `srcset` and intrinsic dimensions prevent layout shifts (CLS < 0.05).
- **Core Web Vitals Targets**:
  - **LCP (Largest Contentful Paint)**: < 1.8s on simulated 4G networks
  - **FID / INP (Interaction to Next Paint)**: < 100ms
  - **CLS (Cumulative Layout Shift)**: < 0.02

### 3.2 Mobile Optimization (`apps/mobile`)
- **List Virtualization**: `ListView.builder` and `GridView.builder` throughout catalog, orders, and Mandi screens ensure only visible items are rendered, keeping RAM usage under 110MB on 2GB low-spec Android devices.
- **Repaint Boundaries**: Critical high-frequency animated elements (shimmer skeletons, ticker badges) are wrapped in `RepaintBoundary` widgets to isolate canvas painting.
- **Image Caching**: Cached network images with local disk fallback and memory LRU eviction.

---

## 4. Security & Data Protection Guardrails

### 4.1 Authentication & Session Management
- **Token Security**: Auth sessions use HTTP-only, secure, SameSite cookies on Web and encrypted local storage (`flutter_secure_storage` abstraction) on Mobile.
- **Multi-Role RBAC**: Centralized role-permission evaluation matrix (`hasPermission(role, action)`) prevents privilege escalation.
- **Route Protection**: Next.js middleware and `RoleGuard` wrappers intercept unauthorized URL navigation, redirecting to login while preserving target redirect parameters.

### 4.2 Database Security (Supabase Row-Level Security)
- **RLS Enabled on All Tables**: 100% of tables in `public` schema have RLS enabled.
- **Strict Isolation Policies**:
  - Buyers can only read and write their own cart items, addresses, and orders (`auth.uid() = user_id`).
  - Sellers can only read orders containing items from their seller inventory and modify inventory records belonging to their store.
  - Cooperative Managers can create and edit campaigns for their cooperative entity.
  - Platform Admins possess elevated governance permissions guarded by database role claims.
- **Input Sanitization**: Parameterized queries through PostgREST prevent SQL injection vulnerabilities.

---

## 5. Offline Resilience & Fault Tolerance

### 5.1 Universal State Views
Both Web and Mobile maintain identical visual state transitions:
1. **Loading State**: Content-shaped shimmer skeletons matching final layouts (never generic spinners that cause layout reflow).
2. **Empty State**: Contextual illustrations, friendly explanations, and clear primary calls-to-action (e.g., "Your cart is empty" -> "Explore Products").
3. **Error State**: Resilient error messaging with descriptive explanations and a primary "Retry" button.
4. **Offline Mode**: Non-intrusive top banner notifying users that they are viewing cached data with a one-tap "Reconnect" trigger.

### 5.2 Optimistic UI & Reconnection Handling
- Realtime WebSocket connections handle network drops gracefully with exponential backoff retry (1s, 2s, 4s, 8s max 30s).
- Optimistic state mutations (e.g., cart quantity adjustments, toggle saved items) update local UI immediately and rollback transparently if network persistence fails.

---

## 6. Audit & Verification Compliance

| Audit Domain | Target Standard | Implementation & Evidence |
|:---|:---|:---|
| **Web Unit & Integration Tests** | 100% Passing | 9 test suites, 56 tests passing via `node --test` |
| **Mobile Unit & Widget Tests** | 100% Passing | 15 test suites, 151 tests passing via `flutter test` |
| **Dart Static Analysis** | 0 warnings / errors | `flutter analyze` clean (0 issues found) |
| **TypeScript Type Checking** | 0 type errors | `tsc --noEmit` clean across all 40 web routes |
| **Cross-Platform Lifecycle** | Identical state machine | `order-transitions.ts` & `order_transitions.dart` |
