-- ============================================================
-- AgriTrade — Stage 11: Admin Operations, Trust, Governance & Platform Control
-- Migration: 20260905060000_stage_11_admin_trust_governance.sql
-- ============================================================

-- 1. Extend seller_profiles verification_status check constraint to support full lifecycle
DO $$
BEGIN
    ALTER TABLE public.seller_profiles 
    DROP CONSTRAINT IF EXISTS seller_profiles_verification_status_check;

    ALTER TABLE public.seller_profiles
    ADD CONSTRAINT seller_profiles_verification_status_check
    CHECK (verification_status IN ('draft', 'submitted', 'pending', 'under_review', 'verified', 'rejected', 'suspended'));
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;

-- 2. Seller Verifications Table
CREATE TABLE IF NOT EXISTS public.seller_verifications (
    id TEXT PRIMARY KEY,
    seller_id TEXT NOT NULL,
    business_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    business_type TEXT NOT NULL CHECK (business_type IN ('individual', 'partnership', 'company', 'cooperative')),
    gst_number TEXT NOT NULL,
    registration_id TEXT,
    address TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    submitted_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    reviewed_by TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'verified', 'rejected', 'suspended')),
    rejection_reason TEXT,
    risk_flags TEXT[] DEFAULT '{}',
    internal_notes TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Product Moderation Queue Table
CREATE TABLE IF NOT EXISTS public.product_moderation (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    product_title TEXT NOT NULL,
    seller_id TEXT NOT NULL,
    seller_name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'archived')),
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Disputes Table
CREATE TABLE IF NOT EXISTS public.disputes (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    order_number TEXT NOT NULL,
    farmer_id TEXT NOT NULL,
    farmer_name TEXT NOT NULL,
    seller_id TEXT NOT NULL,
    seller_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('damaged_product', 'wrong_product', 'missing_item', 'delivery_issue', 'payment_issue', 'seller_issue', 'other')),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'awaiting_user', 'resolved', 'closed')),
    resolution TEXT,
    assigned_to TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Dispute Messages (Audit Timeline)
CREATE TABLE IF NOT EXISTS public.dispute_messages (
    id TEXT PRIMARY KEY,
    dispute_id TEXT NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL CHECK (author_role IN ('farmer', 'seller', 'admin')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Audit Logs Table (Append-only governance trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    actor_id TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('seller', 'product', 'order', 'dispute', 'campaign', 'risk_signal')),
    entity_id TEXT NOT NULL,
    entity_label TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Marketplace Risk Signals Table
CREATE TABLE IF NOT EXISTS public.marketplace_risk_signals (
    id TEXT PRIMARY KEY,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('seller', 'product', 'order')),
    entity_id TEXT NOT NULL,
    entity_label TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    rule_triggered TEXT NOT NULL,
    description TEXT NOT NULL,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    resolved_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_seller_verifications_status ON public.seller_verifications(status);
CREATE INDEX IF NOT EXISTS idx_seller_verifications_seller ON public.seller_verifications(seller_id);
CREATE INDEX IF NOT EXISTS idx_product_moderation_status ON public.product_moderation(status);
CREATE INDEX IF NOT EXISTS idx_product_moderation_seller ON public.product_moderation(seller_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_order ON public.disputes(order_id);
CREATE INDEX IF NOT EXISTS idx_disputes_farmer ON public.disputes(farmer_id);
CREATE INDEX IF NOT EXISTS idx_disputes_seller ON public.disputes(seller_id);
CREATE INDEX IF NOT EXISTS idx_dispute_messages_dispute ON public.dispute_messages(dispute_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_risk_signals_severity ON public.marketplace_risk_signals(severity, is_resolved);

-- 9. Row Level Security (RLS)
ALTER TABLE public.seller_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_moderation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispute_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_risk_signals ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    -- Public / Authenticated read policies for admin entities
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'seller_verifications' AND policyname = 'seller_verifications_read') THEN
        CREATE POLICY seller_verifications_read ON public.seller_verifications FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'seller_verifications' AND policyname = 'seller_verifications_all') THEN
        CREATE POLICY seller_verifications_all ON public.seller_verifications FOR ALL USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_moderation' AND policyname = 'product_moderation_read') THEN
        CREATE POLICY product_moderation_read ON public.product_moderation FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_moderation' AND policyname = 'product_moderation_all') THEN
        CREATE POLICY product_moderation_all ON public.product_moderation FOR ALL USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'disputes' AND policyname = 'disputes_read') THEN
        CREATE POLICY disputes_read ON public.disputes FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'disputes' AND policyname = 'disputes_all') THEN
        CREATE POLICY disputes_all ON public.disputes FOR ALL USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dispute_messages' AND policyname = 'dispute_messages_read') THEN
        CREATE POLICY dispute_messages_read ON public.dispute_messages FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dispute_messages' AND policyname = 'dispute_messages_all') THEN
        CREATE POLICY dispute_messages_all ON public.dispute_messages FOR ALL USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'audit_logs_read') THEN
        CREATE POLICY audit_logs_read ON public.audit_logs FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'audit_logs_insert') THEN
        CREATE POLICY audit_logs_insert ON public.audit_logs FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'marketplace_risk_signals' AND policyname = 'risk_signals_read') THEN
        CREATE POLICY risk_signals_read ON public.marketplace_risk_signals FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'marketplace_risk_signals' AND policyname = 'risk_signals_all') THEN
        CREATE POLICY risk_signals_all ON public.marketplace_risk_signals FOR ALL USING (true);
    END IF;
END $$;

-- 10. Seed Data for Admin Verification, Moderation, Disputes & Risk Signals
INSERT INTO public.seller_verifications (
    id, seller_id, business_name, owner_name, business_type, gst_number, registration_id,
    address, district, state, submitted_at, reviewed_at, reviewed_by, status, rejection_reason,
    risk_flags, internal_notes
) VALUES
    ('ver_001', 'sel_krishi_kendra_01', 'Maharashtra Krishi Kendra', 'Anand Rao', 'company',
     '27AAAAA0000A1Z5', 'REG-MH-PUN-2018-091', 'Market Yard, Gultekdi, Pune', 'Pune', 'Maharashtra',
     NOW() - INTERVAL '12 days', NOW() - INTERVAL '10 days', 'usr_admin_demo', 'verified', NULL,
     '{}', '{"GSTIN verified against central database", "Physical address cross-referenced with APMC registry"}'),
    ('ver_002', 'sel_baramati_agro_02', 'Baramati Agro Chemical Hub', 'Ganesh Kadam', 'partnership',
     '27BAACD9910B1Z2', 'REG-MH-BRM-2020-044', 'MIDC Industrial Area, Baramati', 'Pune', 'Maharashtra',
     NOW() - INTERVAL '8 days', NOW() - INTERVAL '6 days', 'usr_admin_demo', 'verified', NULL,
     '{}', '{"Authorized distributor for Coromandel & IFFCO", "Valid state fertilizer license"}'),
    ('ver_003', 'sel_sahyadri_seeds_03', 'Sahyadri Certified Seeds & Biotech', 'Nilesh More', 'company',
     '27CCDEP8820C1Z8', 'REG-MH-NAS-2022-118', 'Satpur MIDC, Nashik', 'Nashik', 'Maharashtra',
     NOW() - INTERVAL '3 days', NULL, NULL, 'under_review', NULL,
     '{"high_initial_inventory"}', '{"Pending physical warehouse inspection report", "Document check passed"}'),
    ('ver_004', 'sel_deccan_organics_04', 'Deccan Organic Inputs Ltd', 'Priya Deshmukh', 'company',
     '27EEFGK7730D1Z1', 'REG-MH-SAT-2023-059', 'Old MIDC, Satara', 'Satara', 'Maharashtra',
     NOW() - INTERVAL '1 day', NULL, NULL, 'submitted', NULL,
     '{}', '{"New applicant", "Seed & bio-fertilizer range"}'),
    ('ver_005', 'sel_vidarbha_traders_05', 'Vidarbha Agri Traders', 'Ramesh Wankhede', 'individual',
     '27GGHIJ6640E1Z4', 'REG-MH-NGP-2024-012', 'Cotton Market, Nagpur', 'Nagpur', 'Maharashtra',
     NOW() - INTERVAL '15 days', NOW() - INTERVAL '13 days', 'usr_admin_demo', 'rejected', 'Incomplete pesticide dealer license; expired NOC from State Agriculture Department',
     '{"missing_license_docs", "mismatched_gst"}', '{"Failed document verification on 2026-08-22", "Notified via email"}'),
    ('ver_006', 'sel_shree_krishna_06', 'Shree Krishna Agro Chemicals', 'Sunil Pawar', 'partnership',
     '27KKLLM5510F1Z7', 'REG-MH-SOL-2021-073', 'Kurduvadi Road, Solapur', 'Solapur', 'Maharashtra',
     NOW() - INTERVAL '45 days', NOW() - INTERVAL '40 days', 'usr_admin_demo', 'suspended', 'Multiple farmer disputes regarding counterfeit seal on liquid bio-fertilizer batches',
     '{"counterfeit_suspect", "high_dispute_rate"}', '{"Suspended on 2026-08-28 following 3 farmer complaints", "Pending lab test report"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.product_moderation (
    id, product_id, product_title, seller_id, seller_name, category, price, mrp, stock_quantity,
    status, reviewed_by, reviewed_at, rejection_reason, submitted_at
) VALUES
    ('mod_001', 'prod_fertilizer_1', 'IFFCO NPK 10:26:26 (50kg)', 'sel_krishi_kendra_01', 'Maharashtra Krishi Kendra',
     'Fertilizers', 1250.00, 1500.00, 240, 'approved', 'usr_admin_demo', NOW() - INTERVAL '10 days', NULL, NOW() - INTERVAL '11 days'),
    ('mod_002', 'prod_seeds_1', 'Certified Soybean Seeds JS-335 (30kg)', 'sel_krishi_kendra_01', 'Maharashtra Krishi Kendra',
     'Seeds', 2850.00, 3200.00, 85, 'approved', 'usr_admin_demo', NOW() - INTERVAL '10 days', NULL, NOW() - INTERVAL '11 days'),
    ('mod_003', 'prod_pending_01', 'Bio-Shield Organic Fungicide (1L)', 'sel_sahyadri_seeds_03', 'Sahyadri Certified Seeds & Biotech',
     'Plant Protection', 890.00, 1100.00, 150, 'pending_review', NULL, NULL, NULL, NOW() - INTERVAL '2 days'),
    ('mod_004', 'prod_pending_02', 'Solar Insect Trap Unit — Field Pro', 'sel_deccan_organics_04', 'Deccan Organic Inputs Ltd',
     'Farm Machinery', 3450.00, 4200.00, 30, 'pending_review', NULL, NULL, NULL, NOW() - INTERVAL '1 day'),
    ('mod_005', 'prod_rejected_01', 'Non-Certified Growth Enhancer Formula X', 'sel_vidarbha_traders_05', 'Vidarbha Agri Traders',
     'Fertilizers', 650.00, 900.00, 500, 'rejected', 'usr_admin_demo', NOW() - INTERVAL '13 days', 'Missing CIB&RC registration certificate and mandatory batch safety sheet', NOW() - INTERVAL '14 days'),
    ('mod_006', 'prod_archived_01', 'Legacy Drip Emitters 4LPH (Pack of 500)', 'sel_baramati_agro_02', 'Baramati Agro Chemical Hub',
     'Irrigation', 1100.00, 1350.00, 0, 'archived', 'usr_admin_demo', NOW() - INTERVAL '25 days', NULL, NOW() - INTERVAL '30 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.disputes (
    id, order_id, order_number, farmer_id, farmer_name, seller_id, seller_name,
    type, subject, description, status, resolution, assigned_to
) VALUES
    ('dsp_001', 'ord_demo_01', 'ORD-2026-8812', 'usr_farmer_demo', 'Rahul Shinde',
     'sel_krishi_kendra_01', 'Maharashtra Krishi Kendra', 'damaged_product',
     'Torn fertilizer bag with spillage during transit',
     'The 50kg NPK bag arrived with a 15cm tear on the side seam. Approximately 8-10kg fertilizer was spilled inside the delivery truck.',
     'under_review', NULL, 'usr_admin_demo'),
    ('dsp_002', 'ord_demo_02', 'ORD-2026-7940', 'usr_farmer_2', 'Anil Deshmukh',
     'sel_shree_krishna_06', 'Shree Krishna Agro Chemicals', 'wrong_product',
     'Wrong pesticide concentration delivered',
     'Ordered 250ml 20% EC formulation, but package contained 10% WP powder. Cannot use for current crop infestation stage.',
     'awaiting_user', NULL, 'usr_admin_demo'),
    ('dsp_003', 'ord_demo_03', 'ORD-2026-6510', 'usr_farmer_3', 'Vikram Patil',
     'sel_baramati_agro_02', 'Baramati Agro Chemical Hub', 'delivery_issue',
     'Delivery delayed past sowing window',
     'Order took 9 days to arrive instead of committed 48-hour SLA. Farmer had to purchase alternative seeds locally.',
     'resolved', 'Full refund of Rs 2,850 processed to farmer wallet. Seller cautioned on SLA compliance.', 'usr_admin_demo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.dispute_messages (
    id, dispute_id, author_id, author_name, author_role, content
) VALUES
    ('msg_001', 'dsp_001', 'usr_farmer_demo', 'Rahul Shinde', 'farmer', 'Bag arrived torn. Driver acknowledged spillage on delivery receipt. Photos attached.'),
    ('msg_002', 'dsp_001', 'usr_admin_demo', 'Platform Admin', 'admin', 'Case opened. Requesting distributor response and transit damage credit confirmation.'),
    ('msg_003', 'dsp_001', 'sel_krishi_kendra_01', 'Maharashtra Krishi Kendra', 'seller', 'We have reviewed photos. Logistics partner rough handling caused tear. We accept replacement or partial 20% credit.'),
    ('msg_004', 'dsp_002', 'usr_farmer_2', 'Anil Deshmukh', 'farmer', 'Received WP powder instead of EC liquid formulation. Batch number on bill does not match container.'),
    ('msg_005', 'dsp_002', 'usr_admin_demo', 'Platform Admin', 'admin', 'Notified seller. Please confirm if return courier pickup has been scheduled.'),
    ('msg_006', 'dsp_003', 'usr_farmer_3', 'Vikram Patil', 'farmer', 'Seed delivery SLA breached by 7 days. Had to buy local seed to avoid missing monsoon shower.'),
    ('msg_007', 'dsp_003', 'usr_admin_demo', 'Platform Admin', 'admin', 'Logistics delay verified from dispatch timestamps. Refund authorized under Buyer Protection Policy.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.marketplace_risk_signals (
    id, entity_type, entity_id, entity_label, severity, rule_triggered, description, is_resolved
) VALUES
    ('rsk_001', 'seller', 'sel_shree_krishna_06', 'Shree Krishna Agro Chemicals', 'critical',
     'DISPUTE_SPIKE_DETECTED', 'Seller dispute rate exceeded 6.5% of total monthly dispatches over the last 14 days.', false),
    ('rsk_002', 'product', 'prod_rejected_01', 'Non-Certified Growth Enhancer', 'high',
     'PROHIBITED_SUBSTANCE_FLAG', 'Keywords match unauthorized bio-stimulant formulation without CIB certification.', false),
    ('rsk_003', 'order', 'ord_risk_991', 'ORD-2026-9912 (Rs 85,000)', 'medium',
     'HIGH_VALUE_FIRST_TIME_BUYER', 'First-time customer placed bulk fertilizer order over Rs 50,000 via Cash on Delivery.', false),
    ('rsk_004', 'seller', 'sel_vidarbha_traders_05', 'Vidarbha Agri Traders', 'medium',
     'GSTIN_MISMATCH', 'Submitted GSTIN registered state differs from business physical address.', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.audit_logs (
    id, actor_id, actor_name, actor_role, action, entity_type, entity_id, entity_label, metadata
) VALUES
    ('aud_001', 'usr_admin_demo', 'Platform Admin', 'admin', 'seller_verified', 'seller', 'sel_krishi_kendra_01', 'Maharashtra Krishi Kendra', '{"reason": "APMC credentials and GST validated"}'),
    ('aud_002', 'usr_admin_demo', 'Platform Admin', 'admin', 'seller_suspended', 'seller', 'sel_shree_krishna_06', 'Shree Krishna Agro Chemicals', '{"reason": "Product quality complaints & lab test pending"}'),
    ('aud_003', 'usr_admin_demo', 'Platform Admin', 'admin', 'product_approved', 'product', 'prod_fertilizer_1', 'IFFCO NPK 10:26:26', '{"category": "Fertilizers", "mrp": 1500}'),
    ('aud_004', 'usr_admin_demo', 'Platform Admin', 'admin', 'dispute_resolved', 'dispute', 'dsp_003', 'ORD-2026-6510', '{"resolution": "Full refund under Buyer Protection"}'),
    ('aud_005', 'system_risk_engine', 'Risk Rule Engine', 'system', 'risk_signal_created', 'risk_signal', 'rsk_001', 'Shree Krishna Agro Chemicals', '{"rule": "DISPUTE_SPIKE_DETECTED"}')
ON CONFLICT (id) DO NOTHING;
