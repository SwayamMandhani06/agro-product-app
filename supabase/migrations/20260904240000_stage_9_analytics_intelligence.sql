-- ============================================================
-- AgriTrade — Stage 9: Advanced Analytics, Farm Insights
-- & Decision Intelligence
-- Migration: 20260904240000_stage_9_analytics_intelligence.sql
-- ============================================================

-- 1. User Analytics Preferences Table
CREATE TABLE IF NOT EXISTS public.user_analytics_preferences (
    user_id TEXT PRIMARY KEY,
    preferred_time_range TEXT NOT NULL DEFAULT '30d' CHECK (preferred_time_range IN ('7d', '30d', '3m', '6m', '1y')),
    tracked_commodities TEXT[] NOT NULL DEFAULT ARRAY['Soybean', 'Wheat', 'Onion', 'Tomato'],
    notify_spending_anomaly BOOLEAN NOT NULL DEFAULT true,
    notify_market_dip BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_analytics_preferences ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own analytics preferences
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_analytics_preferences' 
        AND policyname = 'user_analytics_preferences_owner_policy'
    ) THEN
        CREATE POLICY user_analytics_preferences_owner_policy
            ON public.user_analytics_preferences
            FOR ALL
            USING (auth.uid()::text = user_id OR user_id = 'usr_farmer_demo')
            WITH CHECK (auth.uid()::text = user_id OR user_id = 'usr_farmer_demo');
    END IF;
END $$;

-- 2. View: User Spending Summary
CREATE OR REPLACE VIEW public.v_user_spending_summary AS
SELECT
    o.user_id,
    COUNT(o.id) AS total_orders,
    COUNT(o.id) FILTER (WHERE o.status = 'delivered') AS delivered_orders,
    COUNT(o.id) FILTER (WHERE o.status IN ('pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery')) AS active_orders,
    COUNT(o.id) FILTER (WHERE o.status = 'cancelled') AS cancelled_orders,
    COALESCE(SUM(o.total) FILTER (WHERE o.status != 'cancelled'), 0) AS total_spend,
    COALESCE(SUM(o.subtotal) FILTER (WHERE o.status != 'cancelled'), 0) AS total_subtotal,
    COALESCE(SUM(o.delivery_fee) FILTER (WHERE o.status != 'cancelled'), 0) AS total_delivery_fees,
    COALESCE(SUM(o.discount) FILTER (WHERE o.status != 'cancelled'), 0) AS total_discount_savings,
    CASE 
        WHEN COUNT(o.id) FILTER (WHERE o.status != 'cancelled') > 0 
        THEN ROUND(COALESCE(SUM(o.total) FILTER (WHERE o.status != 'cancelled'), 0) / COUNT(o.id) FILTER (WHERE o.status != 'cancelled'), 2)
        ELSE 0 
    END AS avg_order_value,
    MIN(o.created_at) AS first_order_date,
    MAX(o.created_at) AS last_order_date
FROM public.orders o
GROUP BY o.user_id;

-- 3. View: User Category Spending
CREATE OR REPLACE VIEW public.v_user_category_spending AS
SELECT
    o.user_id,
    COALESCE(p.category_id, 'other') AS category_id,
    COALESCE(c.name, 'General Farm Supplies') AS category_name,
    COUNT(DISTINCT o.id) AS orders_count,
    SUM(oi.quantity) AS total_units_purchased,
    SUM(oi.price * oi.quantity) AS total_amount,
    MAX(o.created_at) AS last_purchased_at
FROM public.orders o
JOIN public.order_items oi ON oi.order_id = o.id
LEFT JOIN public.products p ON p.id = oi.product_id
LEFT JOIN public.categories c ON c.id = p.category_id
WHERE o.status != 'cancelled'
GROUP BY o.user_id, p.category_id, c.name;

-- 4. View: Commodity Price Trends (Derived from Mandi prices)
CREATE OR REPLACE VIEW public.v_commodity_price_trends AS
WITH ranked_prices AS (
    SELECT
        commodity,
        mandi,
        price,
        unit,
        price_date,
        ROW_NUMBER() OVER (PARTITION BY commodity, mandi ORDER BY price_date DESC) as rn
    FROM public.mandi_prices
)
SELECT
    m.commodity,
    m.mandi,
    MAX(m.price) FILTER (WHERE rp.rn = 1) AS current_price,
    MIN(m.price) AS min_price_observed,
    MAX(m.price) AS max_price_observed,
    ROUND(AVG(m.price), 2) AS avg_price_observed,
    MAX(m.unit) AS unit,
    MAX(m.price_date) AS last_updated
FROM public.mandi_prices m
LEFT JOIN ranked_prices rp ON rp.commodity = m.commodity AND rp.mandi = m.mandi
GROUP BY m.commodity, m.mandi;

-- 5. View: Delivery Performance Metrics (Derived from Shipments)
CREATE OR REPLACE VIEW public.v_delivery_performance_metrics AS
SELECT
    s.user_id,
    COUNT(s.id) AS total_shipments,
    COUNT(s.id) FILTER (WHERE s.status = 'delivered') AS delivered_shipments,
    COUNT(s.id) FILTER (WHERE s.status = 'deliveryAttempted') AS attempted_shipments,
    COUNT(s.id) FILTER (WHERE s.status IN ('created', 'pickupScheduled', 'pickedUp', 'processing', 'inTransit', 'atRegionalHub', 'outForDelivery')) AS active_shipments,
    CASE 
        WHEN COUNT(s.id) > 0 
        THEN ROUND((COUNT(s.id) FILTER (WHERE s.status = 'delivered')::NUMERIC / COUNT(s.id)::NUMERIC) * 100, 1)
        ELSE 0 
    END AS delivery_success_rate,
    ROUND(AVG(EXTRACT(EPOCH FROM (s.updated_at - s.created_at)) / 86400) FILTER (WHERE s.status = 'delivered'), 1) AS avg_delivery_days
FROM public.shipments s
GROUP BY s.user_id;

-- Seed default user analytics preferences for demo farmer
INSERT INTO public.user_analytics_preferences (user_id, preferred_time_range, tracked_commodities)
VALUES ('usr_farmer_demo', '30d', ARRAY['Soybean', 'Wheat', 'Onion', 'Tomato', 'Cotton', 'Maize'])
ON CONFLICT (user_id) DO NOTHING;
