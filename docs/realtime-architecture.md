# AgriTrade — Real-Time Architecture Specification

**Stage:** Stage 6 — Real-Time Intelligence, Live Operations & Premium Product Polish  
**Applies to:** `apps/web`, `apps/mobile`, `supabase`  
**Protocol:** Supabase Realtime (WebSockets over TLS via Phoenix Channel VSN 1.0.0)

---

## 1. System Overview

AgriTrade's real-time architecture transforms the agricultural marketplace from a request-response catalog into a live operational command center for Indian farmers, cooperatives, and input suppliers.

```text
┌───────────────────────────────┐                             ┌───────────────────────────────┐
│        apps/web (Next.js)     │                             │      apps/mobile (Flutter)    │
│  - ConnectionManager          │                             │  - RealtimeConnectionState    │
│  - RealtimeClient (Zustand)   │                             │  - RealtimeService (Riverpod) │
│  - Subscription Handlers      │                             │  - Stream Providers           │
└───────────────┬───────────────┘                             └───────────────┬───────────────┘
                │                                                             │
                │              WSS (wss://*.supabase.co/realtime)             │
                └──────────────────────────────┬──────────────────────────────┘
                                               ▼
                              ┌─────────────────────────────────────┐
                              │      Supabase Realtime Cluster      │
                              │  - phoenix_channel protocol v1.0.0  │
                              │  - Wal2json PostgreSQL replication │
                              │  - Row Level Security (RLS) Filter  │
                              └────────────────┬────────────────────┘
                                               │
                                               ▼
                              ┌─────────────────────────────────────┐
                              │       PostgreSQL 16 Engine          │
                              │  - publication: supabase_realtime   │
                              │  - REPLICA IDENTITY FULL            │
                              │  - public.mandi_prices              │
                              │  - public.orders & order_items      │
                              │  - public.notifications             │
                              │  - public.community_posts/comments  │
                              └─────────────────────────────────────┘
```

---

## 2. Subscribed Tables & Event Definitions

| PostgreSQL Table | Target Events | Payload Details | Client Handling |
| :--- | :--- | :--- | :--- |
| `public.mandi_prices` | `UPDATE`, `INSERT` | `{ crop, market, price, change, trend, modal_price, arrival_volume_tonnes }` | Subtle numerical transition, directional trend glyph (`▲`/`▼`), sparkline update. Zero page reload. |
| `public.orders` | `UPDATE`, `INSERT` | `{ id, user_id, status, tracking_updates, estimated_delivery, updated_at }` | Operational timeline stage advance, live status badge change (`placed` → `delivered`). |
| `public.notifications` | `INSERT`, `UPDATE` | `{ id, user_id, title, body, type, is_read, action_route, created_at }` | Live badge count increment, new item slide-in on dropdown/screen, instant read status sync. |
| `public.community_posts` | `INSERT`, `UPDATE` | `{ id, title, category, author_name, likes_count, comments_count }` | Non-intrusive "New Post Available" notification pill; no disruptive feed reordering. |
| `public.community_comments` | `INSERT` | `{ id, post_id, author_name, content, created_at }` | "1 new reply" subtle pill with tap-to-reveal. |

---

## 3. Explicit Connection Lifecycle

Clients maintain an explicit, observable connection lifecycle state machine:

```text
       ┌──────────────┐
       │   OFFLINE    │◄─────────────────────────────┐
       └──────┬───────┘                              │
              │ (Network Detected)                   │
              ▼                                      │ (Network Lost / Max Retries)
       ┌──────────────┐                              │
       │  CONNECTING  │                              │
       └──────┬───────┘                              │
              │                                      │
       ┌──────┴──────┐                               │
       ▼             ▼                               │
┌──────────────┐ ┌──────────────┐                    │
│  CONNECTED   │ │ RECONNECTING │────────────────────┤
└──────┬───────┘ └──────┬───────┘                    │
       │                │                            │
       ▼ (Heartbeat Loss)                            │
       └────────────────┘                            ▼
                                              ┌──────────────┐
                                              │    ERROR     │
                                              └──────────────┘
```

### UI Presentation Rules
1. **`connected`**: Discreet 6px emerald status indicator (`● Live`) in the terminal/header. No intrusive modals or banners.
2. **`connecting` / `reconnecting`**: Subtle amber status dot (`Connecting...`).
3. **`offline`**: Restrained banner in market terminal: *"You're offline. Showing the latest available information."*
4. **`reconnected`**: Brief non-intrusive 2.5-second banner: *"Connection restored."*

---

## 4. Reconnection & Backoff Strategy

- **Initial retry delay**: 1,000ms
- **Backoff multiplier**: 1.5x with 20% randomized jitter
- **Max retry delay**: 30,000ms
- **Heartbeat interval**: 30,000ms ping/pong
- **Max consecutive reconnect attempts**: 8 attempts before falling back to `degraded` cached mode.

---

## 5. Security & Isolation Considerations

1. **Row Level Security Enforcement**:
   - Supabase Realtime checks PostgreSQL RLS policies before broadcasting rows to client channels.
   - For `orders` and `notifications`, the query filter includes `user_id = auth.uid()`, preventing unauthorized client snooping.
   - `mandi_prices` is public read (`USING (true)`), allowing anonymous farmers to monitor market prices without account login.
2. **Credential Safety**:
   - Web & Mobile only hold the public Anonymous API Key (`SUPABASE_ANON_KEY`), with zero access to the service role key.
3. **Optimistic Rollback**:
   - All state mutations (wishlist toggle, notification read, community upvotes) update the UI optimistically within 16ms, verify the server response, and revert state with a subtle error message if rejected.

---

## 6. Stage 11 Admin Governance Realtime Channels

To enable responsive operational control without page polling, administrators subscribe to 4 dedicated governance topics:

| Channel Topic | Filter | Event | Payload | Client Action |
|---|---|---|---|---|
| `admin:verifications` | `table=seller_verifications` | `INSERT`, `UPDATE` | `SellerVerification` | Increment pending queue counter; update seller badge |
| `admin:moderation` | `table=product_moderation` | `INSERT`, `UPDATE` | `ProductModeration` | Refresh catalog moderation queue badge |
| `admin:disputes` | `table=disputes` | `INSERT`, `UPDATE` | `Dispute` | Surface new buyer claims; update SLA countdown timer |
| `admin:risks` | `table=marketplace_risk_signals` | `INSERT`, `UPDATE` | `MarketplaceRiskSignal` | Trigger critical banner toast if severity is `critical` |

All admin channels verify that the connecting session has role `admin` before granting subscription access.

