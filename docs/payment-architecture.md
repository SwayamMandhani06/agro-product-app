# AgriTrade — Stage 7: Payment Architecture & Transaction Experience

## 1. Overview & Architectural Philosophy

AgriTrade operates on a **platform-neutral, multi-provider payment architecture** designed to bridge modern agrarian commerce with fintech-grade transaction guarantees. The system strictly adheres to **free-tier, educational, and student-demonstration constraints**:

- **Zero Financial Liability**: Real financial charges and live merchant keys are strictly prohibited.
- **Dual-Gateway Modality**: Supports **Razorpay Test Mode** for simulated gateway flows and an offline **Deterministic Demo Payment Provider** for zero-dependency local runs.
- **First-Class COD**: Cash on Delivery is treated as an equal payment instrument with canonical `pending` / `cash_due` reconciliation.
- **Clean Separation of Concerns**: Frontend and mobile UI components interface exclusively with high-level payment abstractions rather than vendor-specific SDKs.

```
+-------------------------------------------------------------------------------+
|                             AgriTrade Checkout UI                             |
|          (Web: 2-Column SaaS Terminal  |  Mobile: Material 3 Sheets)          |
+---------------------------------------+---------------------------------------+
                                        |
                         +--------------v--------------+
                         |     Payment Abstraction     |
                         |   (PaymentService / Riverpod|
                         |       PaymentNotifier)      |
                         +--------------+--------------+
                                        |
       +--------------------------------+--------------------------------+
       |                                |                                |
+------v-------+               +--------v-------+               +--------v-------+
|   Razorpay   |               |  Demo Payment  |               |    Cash on     |
|  Test Mode   |               |    Sandbox     |               |    Delivery    |
| (Client-Safe)|               | (Deterministic)|               |    (COD)       |
+------+-------+               +--------+-------+               +--------+-------+
       |                                |                                |
       +--------------------------------+--------------------------------+
                                        |
                         +--------------v--------------+
                         |      PostgreSQL Schema      |
                         |  (payments, payment_events) |
                         |   RLS Policies & Realtime   |
                         +-----------------------------+
```

---

## 2. Core Payment Domain Concepts

Both Web (`apps/web/features/payments`) and Mobile (`apps/mobile/lib/features/payments`) adhere to identical canonical domain models:

### 2.1 Payment Methods (`PaymentMethod`)
- `upi`: Unified Payments Interface (Google Pay, PhonePe, Paytm, BHIM).
- `card`: Credit / Debit Card (Visa, Mastercard, RuPay).
- `cod`: Cash on Delivery (Cash collection upon consignment arrival).
- `demo`: Educational sandbox simulation (deterministic test provider).

### 2.2 Payment Statuses (`PaymentStatus`)
- `created`: Context created; awaiting gateway initialization.
- `pending`: Awaiting external collection or clearance (e.g. COD orders).
- `processing`: User submitted payment; gateway transaction in flight.
- `authorized`: Gateway confirmed funds authorization.
- `paid`: Transaction successfully settled and confirmed.
- `failed`: Transaction declined by gateway or simulated test failure.
- `cancelled`: User aborted payment sheet or closed gateway modal.
- `refunded`: Post-settlement order cancellation return.

### 2.3 Payment Providers (`PaymentProvider`)
- `razorpay_test`: Razorpay test mode checkout script.
- `cod`: Local Cash on Delivery settlement provider.
- `demo`: Deterministic offline educational simulation provider.

---

## 3. Provider Implementations

### 3.1 Razorpay Test Mode Provider
- Strictly uses **Test Mode Key IDs** (`rzp_test_...`).
- Keys are supplied via client-safe environment variables:
  - Web: `NEXT_PUBLIC_RAZORPAY_KEY_ID`
  - Mobile: `RAZORPAY_KEY_ID` (via `flutter_dotenv` / `BackendConfig`)
- Never exposes Razorpay secret keys in frontend or mobile source code.
- If Razorpay test credentials are absent, the provider automatically falls back to the **Demo Payment Sandbox** with an informative banner.

### 3.2 Demo Payment Provider (Deterministic Fallback)
- Operates 100% offline without external network dependencies.
- Simulates realistic payment progression with 400–600ms latency:
  `validating` → `creatingPayment` → `awaitingGateway` → `verifying` → `success` / `failure`.
- Generates reproducible, auditable transaction IDs: `demo_tx_<orderId>`.
- Includes a **Simulate Payment Decline** switch in the checkout UI to verify error recovery and cart preservation flows.
- Never misrepresents demo runs as real banking transactions; carries explicit labels:
  `DEMO PAYMENT SANDBOX · EDUCATIONAL SIMULATION`.

### 3.3 Cash on Delivery (COD) Provider
- Instant client-side confirmation without external gateway redirection.
- Sets canonical transaction status to `pending` (cash due on delivery).
- Preserves full order history and consignment tracking in Supabase.

---

## 4. Database Schema (`supabase/migrations/20260904200000_stage_7_payment_infrastructure.sql`)

### 4.1 Tables
```sql
CREATE TABLE public.payments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('razorpay_test', 'cod', 'demo')),
    provider_payment_id TEXT,
    provider_order_id TEXT,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    method TEXT NOT NULL CHECK (method IN ('upi', 'card', 'cod', 'demo')),
    status TEXT NOT NULL CHECK (status IN ('created', 'pending', 'processing', 'authorized', 'paid', 'failed', 'cancelled', 'refunded')),
    metadata JSONB DEFAULT '{}'::jsonb,
    failure_code TEXT,
    failure_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id TEXT NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4.2 Security & Row Level Security (RLS)
- **User Isolation**: Authenticated users can only read payments and payment events linked to their `auth.uid()`.
- **Tamper Protection**: Clients cannot arbitrarily mark transactions as `paid`. Status mutations are verified against canonical transition rules.
- **Realtime Integration**: `payments` is published to `supabase_realtime` for live status reflection across sessions.

---

## 5. Secure Checkout Flow & Order Lifecycle

To prevent ghost orders, double charges, and inconsistent cart states, checkout adheres to an atomic, non-inverting order sequence:

```
[User initiates checkout]
          |
          v
[1. Validate Cart & Delivery Address]
          |
          v
[2. Idempotency Lock Acquired]  <--- Prevents double-click race conditions
          |
          v
[3. Create Payment Context / Pending Order]
          |
          v
[4. Invoke Payment Provider (Test / Demo / COD)]
          |
     +----+----+
     |         |
 [Success]  [Failure / Cancel]
     |         |
     |         +---> [Release Lock & Preserve Cart State]
     |               (Show clear error notice; user can retry)
     v
[5. Verify Transaction & Update Status to 'paid' or 'pending']
          |
          v
[6. Finalize Order & Clear Cart]
          |
          v
[7. Navigate to Order Confirmed Surface & Offer Tax Invoice Receipt]
          |
          v
[8. Broadcast Supabase Realtime Event]
```

---

## 6. Tax Invoice & Transaction Receipt

AgriTrade generates free-tier-friendly, client-rendered tax receipts without requiring commercial invoice APIs:

- **Web Receipt** (`/orders/[id]/receipt` and modal):
  - Standard GSTIN layout (AgriTrade Marketplace Pvt. Ltd., Krishi Bhavan Pune).
  - Itemized consignment breakdown with 5% agricultural GST and logistics fees.
  - Native browser `window.print()` styling with responsive paper layout.
  - Prominent **TEST PAYMENT** or **DEMO PAYMENT** watermark.

- **Mobile Receipt** (`ReceiptSheet`):
  - Native Material 3 bottom sheet accessible from `OrderConfirmedScreen`.
  - Itemized pricing, customer address, payment status badge.
  - Sandboxed educational simulation disclosure banner.

---

## 7. Production Readiness Checklist

Before moving this implementation to real-world commercial production, the following infrastructure must be upgraded:

1. **Server-Side Webhook Verification**: Deploy a secure backend endpoint (e.g. Next.js API Route or Supabase Edge Function) validating HMAC SHA256 signatures with `RAZORPAY_KEY_SECRET`.
2. **Merchant Onboarding & KYC**: Complete formal business KYC with Razorpay/banking partners.
3. **PCI-DSS Compliance**: Maintain strict tokenization standards for credit card information.
4. **Automated Reconciliation**: Scheduled background workers matching bank settlements against `payments` and `orders`.
5. **Customer Communications**: Integrate transactional SMS/WhatsApp gateways for dispatch alerts and digital invoice delivery.
