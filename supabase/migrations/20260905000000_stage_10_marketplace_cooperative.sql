-- ============================================================
-- AgriTrade — Stage 10: Seller & Cooperative Marketplace Portal
-- Migration: 20260905000000_stage_10_marketplace_cooperative.sql
-- ============================================================

-- 1. Extend user_roles / profiles with marketplace roles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'user_platform_role'
    ) THEN
        CREATE TYPE public.user_platform_role AS ENUM (
            'farmer',
            'seller',
            'cooperative_manager',
            'admin'
        );
    END IF;
END $$;

-- Add role column to profiles if not already present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'role'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN role TEXT NOT NULL DEFAULT 'farmer' 
        CHECK (role IN ('farmer', 'seller', 'cooperative_manager', 'admin'));
    END IF;
END $$;

-- 2. Seller Profiles Table
CREATE TABLE IF NOT EXISTS public.seller_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    business_name TEXT NOT NULL,
    legal_name TEXT,
    description TEXT,
    verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('pending', 'verified', 'suspended')),
    rating NUMERIC(2, 1) NOT NULL DEFAULT 4.8,
    total_reviews INTEGER NOT NULL DEFAULT 42,
    location TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    district TEXT NOT NULL DEFAULT 'Pune',
    gst_number TEXT DEFAULT '27AAAAA0000A1Z5',
    contact_phone TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    dispatch_sla_hours INTEGER NOT NULL DEFAULT 24,
    commission_rate NUMERIC(4, 2) NOT NULL DEFAULT 4.50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Seller Inventory & Product Extension
CREATE TABLE IF NOT EXISTS public.seller_inventory (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    seller_id TEXT NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    stock_quantity INTEGER NOT NULL DEFAULT 100 CHECK (stock_quantity >= 0),
    reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    reorder_level INTEGER NOT NULL DEFAULT 20,
    minimum_order_quantity INTEGER NOT NULL DEFAULT 1,
    unit TEXT NOT NULL DEFAULT 'bag',
    listing_status TEXT NOT NULL DEFAULT 'active' CHECK (listing_status IN ('draft', 'active', 'paused', 'out_of_stock', 'archived')),
    price NUMERIC(10, 2) NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Inventory Movements Audit Trail
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id TEXT PRIMARY KEY,
    inventory_id TEXT NOT NULL REFERENCES public.seller_inventory(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    seller_id TEXT NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('stock_in', 'stock_out', 'adjustment', 'order_reserved', 'order_released')),
    quantity INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    reference_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Cooperatives / FPO Entity
CREATE TABLE IF NOT EXISTS public.cooperatives (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    registration_number TEXT NOT NULL UNIQUE,
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    district TEXT NOT NULL DEFAULT 'Pune',
    manager_id TEXT NOT NULL,
    manager_name TEXT NOT NULL,
    member_count INTEGER NOT NULL DEFAULT 145,
    established_year INTEGER DEFAULT 2021,
    contact_phone TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Cooperative Campaign Bulk Procurement
CREATE TABLE IF NOT EXISTS public.cooperative_campaigns (
    id TEXT PRIMARY KEY,
    cooperative_id TEXT NOT NULL REFERENCES public.cooperatives(id) ON DELETE CASCADE,
    campaign_name TEXT NOT NULL,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    target_quantity INTEGER NOT NULL,
    minimum_quantity INTEGER NOT NULL,
    current_quantity INTEGER NOT NULL DEFAULT 0,
    unit TEXT NOT NULL DEFAULT 'Bags (50kg)',
    price_per_unit NUMERIC(10, 2) NOT NULL,
    regular_retail_price NUMERIC(10, 2) NOT NULL,
    discount_percentage NUMERIC(4, 1) NOT NULL,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'threshold_reached', 'processing', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Cooperative Farmer Participations
CREATE TABLE IF NOT EXISTS public.cooperative_participations (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES public.cooperative_campaigns(id) ON DELETE CASCADE,
    farmer_id TEXT NOT NULL,
    farmer_name TEXT NOT NULL,
    farmer_location TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    savings_amount NUMERIC(10, 2) NOT NULL,
    committed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'committed' CHECK (status IN ('committed', 'confirmed', 'fulfilled', 'withdrawn'))
);

-- 8. Seller Payouts Ledger
CREATE TABLE IF NOT EXISTS public.seller_payouts (
    id TEXT PRIMARY KEY,
    seller_id TEXT NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    gross_sales NUMERIC(10, 2) NOT NULL,
    commission_deducted NUMERIC(10, 2) NOT NULL,
    order_count INTEGER NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
    payout_method TEXT NOT NULL DEFAULT 'NEFT/RTGS Bank Transfer',
    bank_account_last4 TEXT NOT NULL DEFAULT '4821',
    reference_number TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS across all new tables
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooperatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooperative_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooperative_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_payouts ENABLE ROW LEVEL SECURITY;

-- Transparent RLS Policies
DO $$
BEGIN
    -- Public Read for marketplace visibility
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'seller_profiles' AND policyname = 'seller_profiles_read_all') THEN
        CREATE POLICY seller_profiles_read_all ON public.seller_profiles FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'seller_inventory' AND policyname = 'seller_inventory_read_all') THEN
        CREATE POLICY seller_inventory_read_all ON public.seller_inventory FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cooperatives' AND policyname = 'cooperatives_read_all') THEN
        CREATE POLICY cooperatives_read_all ON public.cooperatives FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cooperative_campaigns' AND policyname = 'cooperative_campaigns_read_all') THEN
        CREATE POLICY cooperative_campaigns_read_all ON public.cooperative_campaigns FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cooperative_participations' AND policyname = 'cooperative_participations_read_all') THEN
        CREATE POLICY cooperative_participations_read_all ON public.cooperative_participations FOR SELECT USING (true);
    END IF;

    -- Seller-specific write access
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'seller_profiles' AND policyname = 'seller_profiles_write_owner') THEN
        CREATE POLICY seller_profiles_write_owner ON public.seller_profiles FOR ALL 
        USING (auth.uid()::text = user_id OR user_id = 'usr_seller_demo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'seller_inventory' AND policyname = 'seller_inventory_write_owner') THEN
        CREATE POLICY seller_inventory_write_owner ON public.seller_inventory FOR ALL 
        USING (seller_id IN (SELECT id FROM public.seller_profiles WHERE user_id = auth.uid()::text OR user_id = 'usr_seller_demo'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'seller_payouts' AND policyname = 'seller_payouts_read_owner') THEN
        CREATE POLICY seller_payouts_read_owner ON public.seller_payouts FOR SELECT 
        USING (seller_id IN (SELECT id FROM public.seller_profiles WHERE user_id = auth.uid()::text OR user_id = 'usr_seller_demo'));
    END IF;
END $$;

-- 9. Seed Seed Records for Demo Sellers and Cooperatives
INSERT INTO public.seller_profiles (
    id, user_id, business_name, legal_name, description, verification_status, rating, total_reviews,
    location, state, district, contact_phone, contact_email, dispatch_sla_hours, commission_rate
) VALUES
    ('sel_krishi_kendra_01', 'usr_seller_demo', 'Maharashtra Krishi Kendra', 'Maharashtra Agro Inputs Pvt. Ltd.',
     'Institutional distributor of certified hybrid seeds, water-soluble fertilizers, and bio-protection inputs across Western Maharashtra.',
     'verified', 4.9, 128, 'Market Yard, Gultekdi, Pune', 'Maharashtra', 'Pune', '+91 98220 12345', 'sales@maharashtrakrishi.in', 24, 4.50),
    ('sel_baramati_agro_02', 'usr_seller_baramati', 'Baramati Agro Chemical Hub', 'Baramati Agrotech Enterprise',
     'Certified manufacturer partner providing bulk organic fertilizers, drip irrigation fittings, and farm equipment.',
     'verified', 4.7, 86, 'MIDC Industrial Area, Baramati', 'Maharashtra', 'Pune', '+91 98224 55678', 'orders@baramatiagrohub.com', 48, 5.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.cooperatives (
    id, name, registration_number, state, district, manager_id, manager_name, member_count, established_year, contact_phone
) VALUES
    ('coop_baramati_fpo_01', 'Baramati Kisan Samruddhi FPO', 'FPO-MH-PUN-2021-084', 'Maharashtra', 'Pune',
     'usr_manager_demo', 'Suresh Patil', 165, 2021, '+91 94220 77890')
ON CONFLICT (id) DO NOTHING;

-- Seed inventory for demo products
INSERT INTO public.seller_inventory (
    id, product_id, seller_id, sku, stock_quantity, reserved_quantity, reorder_level, minimum_order_quantity, unit, listing_status, price, mrp
) VALUES
    ('inv_fert_01', 'prod_fertilizer_1', 'sel_krishi_kendra_01', 'SKU-FERT-NPK-50KG', 240, 15, 30, 1, '50kg Bag', 'active', 1250.00, 1500.00),
    ('inv_seed_01', 'prod_seeds_1', 'sel_krishi_kendra_01', 'SKU-SEED-SOY-JS335', 85, 8, 20, 2, '30kg Bag', 'active', 2850.00, 3200.00),
    ('inv_prot_01', 'prod_protection_1', 'sel_krishi_kendra_01', 'SKU-PROT-CORAGEN-150', 14, 2, 15, 1, '150ml Bottle', 'active', 1850.00, 2100.00),
    ('inv_irrig_01', 'prod_irrigation_1', 'sel_baramati_agro_02', 'SKU-IRRIG-LATERAL-100', 45, 0, 10, 1, 'Bundle (100m)', 'active', 3200.00, 3600.00)
ON CONFLICT (id) DO NOTHING;

-- Seed initial cooperative bulk campaign
INSERT INTO public.cooperative_campaigns (
    id, cooperative_id, campaign_name, product_id, product_name, category, target_quantity, minimum_quantity, current_quantity,
    unit, price_per_unit, regular_retail_price, discount_percentage, start_date, end_date, status
) VALUES
    ('cmp_rabi_npk_2026', 'coop_baramati_fpo_01', 'Pre-Rabi NPK Fertilizer Collective Procurement',
     'prod_fertilizer_1', 'IFFCO NPK 10:26:26 (50kg)', 'Fertilizers', 200, 100, 135,
     'Bags (50kg)', 1120.00, 1450.00, 22.8, NOW() - INTERVAL '4 days', NOW() + INTERVAL '10 days', 'active')
ON CONFLICT (id) DO NOTHING;

-- Seed demo participations
INSERT INTO public.cooperative_participations (
    id, campaign_id, farmer_id, farmer_name, farmer_location, quantity, unit_price, total_amount, savings_amount, committed_at, status
) VALUES
    ('prt_01', 'cmp_rabi_npk_2026', 'usr_farmer_demo', 'Rahul Shinde', 'Daund, Pune', 30, 1120.00, 33600.00, 9900.00, NOW() - INTERVAL '3 days', 'committed'),
    ('prt_02', 'cmp_rabi_npk_2026', 'usr_farmer_2', 'Anil Deshmukh', 'Baramati, Pune', 45, 1120.00, 50400.00, 14850.00, NOW() - INTERVAL '2 days', 'committed'),
    ('prt_03', 'cmp_rabi_npk_2026', 'usr_farmer_3', 'Vikram Patil', 'Indapur, Pune', 60, 1120.00, 67200.00, 19800.00, NOW() - INTERVAL '1 day', 'committed')
ON CONFLICT (id) DO NOTHING;

-- Seed initial payout ledger entries
INSERT INTO public.seller_payouts (
    id, seller_id, amount, gross_sales, commission_deducted, order_count, period_start, period_end, status, reference_number, processed_at
) VALUES
    ('pay_202608_01', 'sel_krishi_kendra_01', 84250.00, 88220.00, 3970.00, 28, NOW() - INTERVAL '30 days', NOW() - INTERVAL '15 days', 'paid', 'NEFT-AGRI-8829104', NOW() - INTERVAL '14 days'),
    ('pay_202608_02', 'sel_krishi_kendra_01', 62400.00, 65340.00, 2940.00, 21, NOW() - INTERVAL '15 days', NOW() - INTERVAL '1 day', 'processing', 'NEFT-AGRI-9921055', NULL),
    ('pay_202609_pending', 'sel_krishi_kendra_01', 34800.00, 36440.00, 1640.00, 12, NOW() - INTERVAL '1 day', NOW(), 'pending', NULL, NULL)
ON CONFLICT (id) DO NOTHING;
