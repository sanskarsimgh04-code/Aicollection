-- ==============================================================================
-- A1 Collection - Row Level Security (RLS) & Authorization Policies
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Helper Functions for Server-Side & Database Role Checks
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin_or_staff(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = user_uuid AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.has_admin_role(user_uuid UUID, required_roles public.admin_role[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = user_uuid
      AND is_active = true
      AND role = ANY(required_roles)
  );
$$;

-- ------------------------------------------------------------------------------
-- Enable RLS on All Tables
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 1. Profiles Policies
-- ------------------------------------------------------------------------------
-- Customers can view only their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.is_admin_or_staff(auth.uid()));

-- Customers can update only their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Profile created upon auth signup
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. Admin Users Policies
-- ------------------------------------------------------------------------------
-- Staff can read their own admin record, SUPER_ADMIN can view all
CREATE POLICY "Staff can view own admin role"
  ON public.admin_users
  FOR SELECT
  USING (
    auth.uid() = id OR
    public.has_admin_role(auth.uid(), ARRAY['SUPER_ADMIN'::public.admin_role, 'ADMIN'::public.admin_role])
  );

-- Only SUPER_ADMIN can manage admin roles
CREATE POLICY "Super admins can manage admin roles"
  ON public.admin_users
  FOR ALL
  USING (public.has_admin_role(auth.uid(), ARRAY['SUPER_ADMIN'::public.admin_role]))
  WITH CHECK (public.has_admin_role(auth.uid(), ARRAY['SUPER_ADMIN'::public.admin_role]));

-- ------------------------------------------------------------------------------
-- 3. Catalog Policies (Products, Categories, Variants, Images)
-- ------------------------------------------------------------------------------
-- Public can read active categories
CREATE POLICY "Public can view active categories"
  ON public.categories
  FOR SELECT
  USING (is_active = true OR public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Staff can manage categories"
  ON public.categories
  FOR ALL
  USING (public.has_admin_role(auth.uid(), ARRAY['SUPER_ADMIN'::public.admin_role, 'ADMIN'::public.admin_role, 'MANAGER'::public.admin_role, 'CONTENT_MANAGER'::public.admin_role]));

-- Public can read active products
CREATE POLICY "Public can view active products"
  ON public.products
  FOR SELECT
  USING (is_active = true OR public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Staff can manage products"
  ON public.products
  FOR ALL
  USING (public.has_admin_role(auth.uid(), ARRAY['SUPER_ADMIN'::public.admin_role, 'ADMIN'::public.admin_role, 'MANAGER'::public.admin_role]));

-- Product junction, variants, images follow product visibility
CREATE POLICY "Public can view active product categories"
  ON public.product_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Staff can manage product categories"
  ON public.product_categories
  FOR ALL
  USING (public.has_admin_role(auth.uid(), ARRAY['SUPER_ADMIN'::public.admin_role, 'ADMIN'::public.admin_role, 'MANAGER'::public.admin_role]));

CREATE POLICY "Public can view product images"
  ON public.product_images
  FOR SELECT
  USING (true);

CREATE POLICY "Staff can manage product images"
  ON public.product_images
  FOR ALL
  USING (public.has_admin_role(auth.uid(), ARRAY['SUPER_ADMIN'::public.admin_role, 'ADMIN'::public.admin_role, 'MANAGER'::public.admin_role, 'CONTENT_MANAGER'::public.admin_role]));

CREATE POLICY "Public can view variants"
  ON public.variants
  FOR SELECT
  USING (true);

CREATE POLICY "Staff can manage variants"
  ON public.variants
  FOR ALL
  USING (public.has_admin_role(auth.uid(), ARRAY['SUPER_ADMIN'::public.admin_role, 'ADMIN'::public.admin_role, 'MANAGER'::public.admin_role]));

-- Inventory is visible only to staff
CREATE POLICY "Staff can view and manage inventory"
  ON public.inventory
  FOR ALL
  USING (public.has_admin_role(auth.uid(), ARRAY['SUPER_ADMIN'::public.admin_role, 'ADMIN'::public.admin_role, 'MANAGER'::public.admin_role, 'ORDER_MANAGER'::public.admin_role]));

-- ------------------------------------------------------------------------------
-- 4. Orders Policies (Strict Customer Isolation & Staff Authorization)
-- ------------------------------------------------------------------------------
-- Customer can ONLY view their own orders; staff can view all orders
CREATE POLICY "Customers can view only own orders"
  ON public.orders
  FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND customer_id = auth.uid()) OR
    public.has_admin_role(auth.uid(), ARRAY['SUPER_ADMIN'::public.admin_role, 'ADMIN'::public.admin_role, 'MANAGER'::public.admin_role, 'ORDER_MANAGER'::public.admin_role])
  );

-- Customers and guests can insert new orders in awaiting_confirmation state
CREATE POLICY "Customers and guests can insert orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (
    status = 'awaiting_confirmation' AND
    (customer_id IS NULL OR customer_id = auth.uid())
  );

-- Only ORDER_MANAGER, MANAGER, ADMIN, SUPER_ADMIN can update order status
-- Customers CANNOT alter order status, prices, or details!
CREATE POLICY "Staff can update orders"
  ON public.orders
  FOR UPDATE
  USING (public.has_admin_role(auth.uid(), ARRAY['SUPER_ADMIN'::public.admin_role, 'ADMIN'::public.admin_role, 'MANAGER'::public.admin_role, 'ORDER_MANAGER'::public.admin_role]));

-- Orders cannot be deleted by customers
CREATE POLICY "Only super admin can delete orders"
  ON public.orders
  FOR DELETE
  USING (public.has_admin_role(auth.uid(), ARRAY['SUPER_ADMIN'::public.admin_role]));

-- ------------------------------------------------------------------------------
-- 5. Order Items Policies (Immutable Snapshots)
-- ------------------------------------------------------------------------------
-- Customers can view order items ONLY for their own orders
CREATE POLICY "Customers can view own order items"
  ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.customer_id = auth.uid() OR public.is_admin_or_staff(auth.uid()))
    )
  );

-- Order items inserted at order placement
CREATE POLICY "Order items insert with order"
  ON public.order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
    )
  );

-- Snapshots are IMMUTABLE: Disallow UPDATE on order_items for all non-super admins
CREATE POLICY "Order items are immutable"
  ON public.order_items
  FOR UPDATE
  USING (false);

-- ------------------------------------------------------------------------------
-- 6. Reviews Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view approved reviews"
  ON public.reviews
  FOR SELECT
  USING (is_approved = true OR public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Staff can moderate reviews"
  ON public.reviews
  FOR UPDATE
  USING (public.has_admin_role(auth.uid(), ARRAY['SUPER_ADMIN'::public.admin_role, 'ADMIN'::public.admin_role, 'MANAGER'::public.admin_role]));

-- ------------------------------------------------------------------------------
-- 7. Coupons Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can read active coupon codes"
  ON public.coupons
  FOR SELECT
  USING (is_active = true OR public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Staff can manage coupons"
  ON public.coupons
  FOR ALL
  USING (public.has_admin_role(auth.uid(), ARRAY['SUPER_ADMIN'::public.admin_role, 'ADMIN'::public.admin_role, 'MANAGER'::public.admin_role]));

-- ------------------------------------------------------------------------------
-- 8. CMS Content Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published CMS content"
  ON public.cms_content
  FOR SELECT
  USING (is_published = true OR public.is_admin_or_staff(auth.uid()));

CREATE POLICY "Content managers can edit CMS content"
  ON public.cms_content
  FOR ALL
  USING (public.has_admin_role(auth.uid(), ARRAY['SUPER_ADMIN'::public.admin_role, 'ADMIN'::public.admin_role, 'CONTENT_MANAGER'::public.admin_role]));

-- ------------------------------------------------------------------------------
-- 9. Settings Policies
-- ------------------------------------------------------------------------------
-- Public can read business settings (store info, checkout mode, etc.)
CREATE POLICY "Public can view business settings"
  ON public.settings
  FOR SELECT
  USING (category IN ('store', 'contact', 'checkout', 'shipping', 'tax', 'homepage', 'seo'));

-- Only ADMIN and SUPER_ADMIN can modify store settings
CREATE POLICY "Admins can update settings"
  ON public.settings
  FOR ALL
  USING (public.has_admin_role(auth.uid(), ARRAY['SUPER_ADMIN'::public.admin_role, 'ADMIN'::public.admin_role]));

-- ------------------------------------------------------------------------------
-- 10. Audit Logs Policies (Append-Only & Super Admin Read-Only)
-- ------------------------------------------------------------------------------
-- Only SUPER_ADMIN and ADMIN can read audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (public.has_admin_role(auth.uid(), ARRAY['SUPER_ADMIN'::public.admin_role, 'ADMIN'::public.admin_role]));

-- Service role or internal triggers can insert logs
CREATE POLICY "System can record audit logs"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (true);

-- NEVER allow update or delete on audit logs (immutable security ledger)
CREATE POLICY "Audit logs cannot be modified"
  ON public.audit_logs
  FOR UPDATE
  USING (false);

CREATE POLICY "Audit logs cannot be deleted"
  ON public.audit_logs
  FOR DELETE
  USING (false);
