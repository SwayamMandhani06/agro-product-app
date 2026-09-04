-- =====================================================================
-- AgriTrade — Stage 6 Supabase Realtime Replication Migration
-- Features: Enable Realtime publication for orders, mandi_prices,
--           notifications, and community feeds with REPLICA IDENTITY FULL
-- =====================================================================

-- 1. SET REPLICA IDENTITY FULL
-- This ensures that UPDATE and DELETE payloads contain the complete previous row
-- so client applications can determine previous statuses and price deltas.
ALTER TABLE public.mandi_prices REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.order_items REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.community_posts REPLICA IDENTITY FULL;
ALTER TABLE public.community_comments REPLICA IDENTITY FULL;

-- 2. ADD TABLES TO SUPABASE_REALTIME PUBLICATION
-- Only add if not already part of the publication
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.mandi_prices;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;

    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;

    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;

    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;

    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;

    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.community_comments;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END IF;
END $$;

-- 3. AUDIT METADATA & REPLICATION COMMENTS
COMMENT ON TABLE public.mandi_prices IS 'Live APMC market commodity price ticker with full replica identity for real-time WebSocket broadcast';
COMMENT ON TABLE public.orders IS 'Transactional orders with real-time status transitions and user-isolated RLS stream filtering';
COMMENT ON TABLE public.notifications IS 'Targeted farmer notifications with instant WebSocket delivery and unread counter synchronization';
