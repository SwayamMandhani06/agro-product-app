# AgriTrade Logistics Architecture & Rural Delivery Operations
**Stage 8 Specification & Reference Document**

---

## 1. Architectural Vision

AgriTrade's logistics layer elevates the platform from basic order placement into an **end-to-end rural consignment dispatch and delivery operations engine**. 

```
Order Created
      ↓
Payment Authorized / COD Confirmed
      ↓
Shipment Created (#SHP-XXXXX, Waybill Generated)
      ↓
Pickup Scheduled (Central Fulfillment Hub)
      ↓
Package Picked Up & Germination Seals Verified
      ↓
In Transit (Inter-District Feeder Line-haul)
      ↓
Regional Sorting Hub (Hadapsar / Wagholi Outpost)
      ↓
Out for Delivery (EV Three-Wheeler Last-Mile Agent)
      ↓
Delivered (Farm Gate Handover & Recipient Verification)
      ↓ (Exception Alternative)
Delivery Attempted (Monsoon road delay / Gate locked / Rescheduled)
```

---

## 2. Order Lifecycle vs. Shipment Lifecycle

To preserve complete backward compatibility with Stages 3, 6, and 7, **Order Lifecycle** and **Shipment Lifecycle** are decoupled:

| Shipment Lifecycle (`ShipmentStatus`) | Order Lifecycle (`OrderStatus`) | Operational Meaning |
|---|---|---|
| `created` | `confirmed` | Consignment manifest generated with carrier; waybill assigned. |
| `pickupScheduled` | `confirmed` | Pickup feeder vehicle scheduled at fulfillment warehouse. |
| `pickedUp` | `processing` | Package collected, sealed, and loaded onto outbound vehicle. |
| `processing` | `processing` | Sorting and line-haul preparation at central warehouse. |
| `inTransit` | `shipped` | En route via inter-district agricultural corridor. |
| `atRegionalHub` | `shipped` | Received at rural sorting outpost / distribution center. |
| `outForDelivery` | `outForDelivery` | Assigned to local EV delivery agent heading to farm gate. |
| `deliveryAttempted` | `outForDelivery` | Re-attempt scheduled; order stays active and visible. |
| `delivered` | `delivered` | Recipient signed at farm gate; consignment closed. |
| `cancelled` | `cancelled` | Consignment cancelled before dispatch. |
| `returned` | `cancelled` | Consignment returned to origin fulfillment center. |

---

## 3. Provider Abstraction & Zero-Cost Guarantee

AgriTrade guarantees that the platform is **100% demonstrable on free tiers** without requiring subscriptions to Shiprocket, Delhivery, Google Maps, or SMS gateways.

```
                  ┌────────────────────────┐
                  │   LogisticsProvider    │
                  │       (Interface)      │
                  └───────────┬────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            │                                   │
┌─────────────────────────┐         ┌─────────────────────────┐
│  DemoLogisticsProvider  │         │   LogisticsApiAdapter   │
│ (Deterministic Sim)     │         │   (Future Live Couriers)│
├─────────────────────────┤         ├─────────────────────────┤
│ • Pre-seeded shipments  │         │ • Shiprocket API        │
│ • Deterministic events  │         │ • Delhivery Rural API   │
│ • Agent assignment      │         │ • Custom Freight APIs   │
│ • Simulated exceptions  │         │ (Delegates to Demo in   │
│ • Zero API credentials  │         │  free-tier sandbox mode)│
└─────────────────────────┘         └─────────────────────────┘
```

---

## 4. Supabase Database Schema

The database migration `supabase/migrations/20260904220000_stage_8_logistics_operations.sql` introduces 4 tables:

1. `public.delivery_agents`:
   - `id`, `name`, `phone`, `carrier`, `vehicle_type`, `vehicle_number`, `rating`
2. `public.shipments`:
   - `id`, `order_id`, `user_id`, `provider`, `tracking_number`, `status`, `origin_location`, `destination_location`, `current_location`, `estimated_delivery_start`, `estimated_delivery_end`, `service_zone`, `distance_band`, `delivery_agent_id`
3. `public.tracking_events`:
   - `id`, `shipment_id`, `status`, `location`, `description`, `event_time`
4. `public.delivery_attempts`:
   - `id`, `shipment_id`, `attempt_number`, `status`, `reason`, `notes`, `attempted_at`, `next_attempt_date`

RLS policies enforce user isolation on `shipments` and associated records, while allowing delivery agents and status updates. All tables are added to `supabase_realtime` publication.

---

## 5. Dual-Platform User Experience

### Web (Desktop-First SaaS Operations)
- `/orders/[id]`: Split-panel layout with granular checkpoint milestones on the left, and Rural Delivery Intelligence on the right (carrier, waybill, ETA window, service zone reliability, agent card, and demo simulation controls).
- `/shipments`: Operational command dashboard with 4 KPI cards, interactive SVG route corridor visualizer (`Warehouse` $\rightarrow$ `Hub` $\rightarrow$ `Feeder` $\rightarrow$ `Farm Gate`), live search, status filters, and desktop-first data table with slide-over detail drawer.
- SVG Topological Corridor: Zero paid maps API, zero cartoon trucks; crisp mathematical layout with active node breathing pulse.

### Mobile (Compact Material 3 Native)
- Order Tracking Screen: Compact header showing Order ID alongside `#SHP-XXXXX` and waybill chip.
- Designated Delivery Agent Card: Includes direct phone call trigger, rating, and EV cargo vehicle credentials.
- Animated Timeline: Active node gently breathes using standard Flutter animation controller; smooth transition when events update.
- Delivery Issue Bottom Sheet: Dedicated exception logging dialog supporting authentic Indian rural logistics challenges (unseasonal monsoon showers, APMC tractor diversions, locked farm gates, survey number clarifications).
