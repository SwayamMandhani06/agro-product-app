# AgriTrade Motion Design System Specification

## 1. Motion Philosophy

In AgriTrade, animation is a functional affordance, never decorative noise.
Animations must feel:
- **Subtle**: Quiet, refined, supporting task completion.
- **Fast**: Immediate response to user intent without lingering.
- **Intentional**: Clarifying spatial relationships, state transitions, and hierarchy.
- **Responsive**: Supporting device frame rates (60Hz / 120Hz ProMotion) and honoring accessibility settings (`prefers-reduced-motion`).

---

## 2. Shared Timing & Duration Tokens

Both platforms share the same conceptual timing scale:

| Token | Duration | Use Case | Web CSS Variable | Flutter `AppMotion` |
|---|---|---|---|---|
| **Instant** | 0ms | Immediate state resets, accessibility bypass | `--motion-instant` | `AppMotion.instant` |
| **Micro** | 100ms | Button press feedback, checkbox toggle | `--motion-micro` | `AppMotion.micro` |
| **Fast** | 150ms | Hover elevation, color transitions, chip active | `--motion-fast` | `AppMotion.fast` |
| **Base** | 200ms | Input focus rings, dropdown menus, tab active line | `--motion-base` | `AppMotion.base` |
| **Normal** | 250ms - 300ms | Card slide-in, modal sheet entry, skeleton fade | `--motion-normal` | `AppMotion.normal` |
| **Slow** | 350ms - 400ms | Full page transitions, bottom sheet expand | `--motion-slow` | `AppMotion.page` |

---

## 3. Shared Easing Families

| Easing Family | Curve Description | Web CSS Value | Flutter Curve |
|---|---|---|---|
| **Standard** | Balanced acceleration & deceleration | `cubic-bezier(0.2, 0.0, 0.0, 1.0)` | `Curves.easeInOutCubic` |
| **Decelerate** | Fast entry, gentle settling (elements entering view) | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` | `Curves.easeOutCubic` |
| **Accelerate** | Elements exiting view swiftly | `cubic-bezier(0.4, 0.0, 1.0, 1.0)` | `Curves.easeInCubic` |
| **Emphasized** | Hero elements, sheet reveals, drawer panels | `cubic-bezier(0.05, 0.7, 0.1, 1.0)` | `Curves.easeOutExpo` |

---

## 4. Web Motion Primitives (`apps/web`)

### 4.1 Page Entrance
- Initial state: `opacity: 0; transform: translateY(8px);`
- Final state: `opacity: 1; transform: translateY(0);`
- Duration: `200ms` with `--ease-decelerate`.

### 4.2 Dashboard Card Stagger
- Cards stagger entry with subtle 40ms–60ms offsets (`.stagger-1`, `.stagger-2`, `.stagger-3`, `.stagger-4`).
- Avoid long cascading delays that impede perceived load speed.

### 4.3 Button Feedback
- Hover: Elevation shadow shift + background tone transition (`150ms ease`).
- Active / Click: Scale down to `0.98` (`100ms ease`).

### 4.4 Modal / Sheet Dialogs
- Backdrop: `opacity: 0 → 1` (`150ms`).
- Dialog panel: `opacity: 0 → 1; transform: scale(0.97) translateY(8px) → scale(1.0) translateY(0);` (`200ms ease-out`).

### 4.5 Accessibility (`prefers-reduced-motion`)
All animations are overridden with `animation-duration: 0.01ms !important` and `transition-duration: 0.01ms !important` when the user enables reduced motion preferences in their OS.

---

## 5. Flutter Motion Primitives (`apps/mobile`)

### 5.1 Native Animation Hierarchy
- **State Changes**: `AnimatedSwitcher` with `FadeTransition` for clean swaps between loading, empty, and populated data states.
- **Card Tap**: `InkResponse` / `InkWell` combined with subtle scale `0.98` or border highlight.
- **Sheet & Dialogs**: Standard modal sheet with `AppMotion.pageTransition`.
- **Shimmer Loading**: `AppMotion.shimmerCycle` (1200ms continuous sweep) with low-contrast neutral gradients.
