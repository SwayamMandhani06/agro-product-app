-- ============================================================
-- AgriTrade — Stage 8: Logistics Partner Integration,
-- Rural Delivery Operations & Shipment Intelligence
-- Migration: 20260904220000_stage_8_logistics_operations.sql
-- ============================================================

-- 1. Delivery Agents Table
CREATE TABLE IF NOT EXISTS public.delivery_agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    carrier TEXT NOT NULL DEFAULT 'Delhivery Rural Express',
    vehicle_type TEXT DEFAULT 'Three-Wheeler Cargo EV',
    vehicle_number TEXT DEFAULT 'MH-12-TR-4921',
    rating NUMERIC(2, 1) DEFAULT 4.9,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial institutional delivery partners
INSERT INTO public.delivery_agents (id, name, phone, carrier, vehicle_type, vehicle_number, rating, is_active)
VALUES
    ('agt_pune_01', 'Rahul Shinde', '+91 98230 11234', 'Delhivery Rural Express', 'Three-Wheeler Cargo EV', 'MH-12-TR-4921', 4.9, true),
    ('agt_baramati_02', 'Vikram Deshmukh', '+91 97654 22345', 'AgriExpress Freight', 'Tata Ace Gold EV', 'MH-42-AQ-8890', 4.8, true),
    ('agt_nashik_03', 'Anil Patil', '+91 94220 33456', 'Kisan Rath Telematics', 'Mahindra Bolero Maxi Truck', 'MH-15-EG-5512', 4.9, true)
ON CONFLICT (id) DO NOTHING;

-- 2. Shipments Table
CREATE TABLE IF NOT EXISTS public.shipments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'demo_logistics' CHECK (provider IN ('demo_logistics', 'delhivery_rural', 'shiprocket')),
    tracking_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL CHECK (status IN (
        'created',
        'pickupScheduled',
        'pickedUp',
        'processing',
        'inTransit',
        'atRegionalHub',
        'outForDelivery',
        'delivered',
        'deliveryAttempted',
        'cancelled',
        'returned'
    )),
    origin_location TEXT NOT NULL,
    destination_location TEXT NOT NULL,
    current_location TEXT NOT NULL,
    estimated_delivery_start TIMESTAMPTZ,
    estimated_delivery_end TIMESTAMPTZ,
    delivery_agent_id TEXT REFERENCES public.delivery_agents(id) ON DELETE SET NULL,
    service_zone TEXT NOT NULL DEFAULT 'Rural Priority Route',
    distance_band TEXT DEFAULT '100–250 km',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tracking Events Table
CREATE TABLE IF NOT EXISTS public.tracking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id TEXT NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    event_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Delivery Attempts Table
CREATE TABLE IF NOT EXISTS public.delivery_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id TEXT NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    attempt_number INT NOT NULL DEFAULT 1,
    status TEXT NOT NULL CHECK (status IN ('failed', 'rescheduled', 'delivered')),
    reason TEXT NOT NULL CHECK (reason IN (
        'customer_unavailable',
        'address_clarification_required',
        'weather_delay',
        'route_delay',
        'security_gate_locked'
    )),
    notes TEXT,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    next_attempt_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON public.shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_user_id ON public.shipments(user_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON public.shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_tracking_events_shipment_id ON public.tracking_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_time ON public.tracking_events(event_time DESC);
CREATE INDEX IF NOT EXISTS idx_delivery_attempts_shipment ON public.delivery_attempts(shipment_id);

-- 6. Updated At Trigger for Shipments
CREATE OR REPLACE FUNCTION public.handle_shipments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_shipments_updated_at ON public.shipments;
CREATE TRIGGER tr_shipments_updated_at
    BEFORE UPDATE ON public.shipments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_shipments_updated_at();

-- 7. Row Level Security (RLS)
ALTER TABLE public.delivery_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_attempts ENABLE ROW LEVEL SECURITY;

-- Agents can be viewed publicly
CREATE POLICY "delivery_agents_read" ON public.delivery_agents
    FOR SELECT USING (true);

-- Shipments read policy: user can read their own or demo shipments
CREATE POLICY "shipments_user_read" ON public.shipments
    FOR SELECT USING (
        auth.uid() IS NULL OR
        auth.uid()::text = user_id OR
        user_id = 'usr_default'
    );

-- Shipments write policy: owner or service
CREATE POLICY "shipments_user_write" ON public.shipments
    FOR ALL USING (
        auth.uid() IS NULL OR
        auth.uid()::text = user_id OR
        user_id = 'usr_default'
    );

-- Tracking events read policy
CREATE POLICY "tracking_events_read" ON public.tracking_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.shipments s
            WHERE s.id = tracking_events.shipment_id
            AND (auth.uid() IS NULL OR auth.uid()::text = s.user_id OR s.user_id = 'usr_default')
        )
    );

-- Tracking events insert policy
CREATE POLICY "tracking_events_write" ON public.tracking_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.shipments s
            WHERE s.id = tracking_events.shipment_id
            AND (auth.uid() IS NULL OR auth.uid()::text = s.user_id OR s.user_id = 'usr_default')
        )
    );

-- Delivery attempts read policy
CREATE POLICY "delivery_attempts_read" ON public.delivery_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.shipments s
            WHERE s.id = delivery_attempts.shipment_id
            AND (auth.uid() IS NULL OR auth.uid()::text = s.user_id OR s.user_id = 'usr_default')
        )
    );

-- Delivery attempts write policy
CREATE POLICY "delivery_attempts_write" ON public.delivery_attempts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.shipments s
            WHERE s.id = delivery_attempts.shipment_id
            AND (auth.uid() IS NULL OR auth.uid()::text = s.user_id OR s.user_id = 'usr_default')
        )
    );

-- 8. Add to Realtime Publication
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.shipments;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.tracking_events;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_attempts;
    END IF;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
