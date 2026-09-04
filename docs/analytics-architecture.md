# AgriTrade — Stage 9: Analytics Architecture & Decision Intelligence

## 1. System Overview

AgriTrade Stage 9 elevates the platform from an agricultural commerce and rural delivery network into an institutional-grade decision intelligence platform. The architecture emphasizes **verifiable transparency**, **explainable deterministic insights**, and **Bloomberg-lite information density** across both web and native mobile environments.

```
                    ┌─────────────────────────┐
                    │ Verified Records & Logs │
                    │ Orders · APMC · Freight │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  Aggregation Service    │
                    │ Normalized Spend/Trends │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Farm Insight Engine   │
                    │   Deterministic Rules   │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
┌─────────────────────────┐                     ┌─────────────────────────┐
│ Web Intelligence (/insights) │               │ Mobile (FarmInsights)   │
│ Desktop-First Workspace │                     │ Touch-First Diagnostics │
│ Interactive Crosshairs  │                     │ Native CustomPainter    │
└─────────────────────────┘                     └─────────────────────────┘
```

---

## 2. Deterministic Calculation Formulas

All analytics displayed in AgriTrade are calculated with deterministic formulas without ungrounded heuristics or opaque AI black boxes.

### 2.1 Direct Farmer Savings
$$\text{Total Savings} = \text{Product Discounts} + \text{Delivery Subsidies} + \text{Bulk Rebates}$$
- **Product Discounts**: Manufacturer wholesale margin pass-through directly credited against printed MRP.
- **Delivery Freight Subsidies**: Calculated against standard rural tier baseline of ₹150 per drop:
$$\text{Delivery Savings} = \max(0, (\text{Delivered Orders} \times 150) - \text{Actual Freight Paid})$$

### 2.2 Offline Traditional Retail Benchmark
Traditional input retailers and intermediaries in rural markets impose a documented **16.5% standard gross markup** over direct catalog rates:
$$\text{Offline Retail Estimate} = \text{Round}\left(\text{Total Spend} \times \left(1 + \frac{16.5}{100}\right)\right)$$

### 2.3 Realized Average Discount Percentage
$$\text{Average Discount \%} = \min\left(100, \text{Round}\left(\frac{\text{Discount Amount}}{\text{Subtotal} + \text{Discount Amount}} \times 100\right)\right)$$

### 2.4 Period-Over-Period Spending Delta
$$\Delta\% = \left(\frac{\text{Current Period Spend} - \text{Prior Period Spend}}{\text{Prior Period Spend}}\right) \times 100$$
- If $|\Delta\%| < 0.5\%$, direction is classified as `flat`.
- If $\Delta\% \ge 0.5\%$, direction is classified as `up`.
- If $\Delta\% \le -0.5\%$, direction is classified as `down`.

---

## 3. The Farm Insight Engine (Deterministic Rules)

The `FarmInsightEngine` evaluates active analytics snapshots against 4 rules:

| Rule | Trigger Condition | Severity | Badge Label | Action Output |
| :--- | :--- | :--- | :--- | :--- |
| **Spending Anomaly** | Category growth rate $\ge 15.0\%$ and spend $> ₹3,000$ | `warning` | Purchase Pattern | Recommends agronomic audit of field application rates |
| **Market Opportunity** | Commodity price drop $\le -5.0\%$ or spot rate $\ge ₹80$ below 30d mean | `info` | Market Signal | Advises storage retention or procurement value entry |
| **Logistics Reliability** | On-time delivery rate $\ge 96.0\%$ across active shipments | `positive` | Delivery Performance | Validates route telematics and rural access point |
| **Seasonal Reminder** | Active Kharif / Rabi seasonal crop transition | `info` | Farm Insight | Recommends pre-sowing input ordering |

### 3.1 Transparent Diagnosis Structure
Every generated insight exposes 4 verifiable diagnostic fields:
1. **What Happened**: Clear chronological summary of the observed data points.
2. **Why Detected**: The exact deterministic rule threshold and comparison baseline.
3. **Supporting Verification Data**: Table of observed telemetry metrics against institutional benchmarks.
4. **Recommended Consideration**: Agronomic and economic guidance tailored for farmer decision support.

---

## 4. Platform Alignment & Divergence

| Capability | Web (`apps/web/app/insights/`) | Mobile (`apps/mobile/lib/features/analytics/`) |
| :--- | :--- | :--- |
| **Layout Strategy** | Desktop-first analytical workspace with tabs and multi-column density | Mobile-first vertical priority with progressive disclosure |
| **Time Range Toggles** | Compact segmented header buttons (`7d`, `30d`, `3m`, `6m`, `1y`) | Horizontal scrolling ChoiceChip selector bar |
| **Chart Rendering** | Custom SVG area chart with interactive hover crosshairs and tooltips | Native `CustomPainter` sparkline vector graph |
| **Detail Inspector** | Slide-over drawer with ESC key and backdrop dismissal | Material 3 modal bottom sheet with drag handle |
| **Market Intelligence** | Multi-commodity APMC price curve workspace with high/low spreads | Horizontal scrolling commodity modal price cards |
| **State Management** | Zustand (`useAnalyticsStore`) | Riverpod (`StateNotifierProvider<FarmAnalyticsNotifier>`) |

---

## 5. Free-Tier Architecture & Zero Paid API Guarantee

1. **Zero External Paid Analytics**: No Mixpanel, Segment, Amplitude, or OpenAI API keys required.
2. **Deterministic SQL Views**: Aggregations are calculated in-engine or derived via PostgreSQL views (`v_user_spending_summary`, `v_user_category_spending`, `v_commodity_price_trends`, `v_delivery_performance_metrics`).
3. **Reproducible Staging**: All seed records are idempotent and operate seamlessly in offline/demo environments.
