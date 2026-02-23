-- ============================================
-- ClaraMente E-Commerce - Full Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('individual', 'pack', 'mayorista')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_active_category ON public.products(is_active, category);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  delivery_type TEXT NOT NULL CHECK (delivery_type IN ('envio', 'retiro')),
  delivery_address TEXT,
  postal_code TEXT,
  subtotal NUMERIC(10,2) NOT NULL,
  shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'comprobante_enviado', 'pagado', 'enviado', 'entregado', 'cancelado')),
  payment_proof_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- Order Items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  line_total NUMERIC(10,2) NOT NULL
);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- Delivery Zones
CREATE TABLE public.delivery_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  postal_code TEXT UNIQUE NOT NULL,
  zone_name TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_delivery_zones_postal_code ON public.delivery_zones(postal_code);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at on products
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_products_updated
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- FUNCTIONS
-- ============================================

-- Stock deduction (called when admin marks order as "pagado")
CREATE OR REPLACE FUNCTION public.deduct_stock_for_order(p_order_id UUID)
RETURNS VOID AS $$
DECLARE
  item RECORD;
BEGIN
  FOR item IN
    SELECT product_id, quantity FROM public.order_items WHERE order_id = p_order_id
  LOOP
    UPDATE public.products
      SET stock = stock - item.quantity
      WHERE id = item.product_id AND stock >= item.quantity;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Stock insuficiente para producto %', item.product_id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

-- PRODUCTS
CREATE POLICY "Public can read active products"
  ON public.products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin full access to products"
  ON public.products FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ORDERS
CREATE POLICY "Anyone can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read orders by id"
  ON public.orders FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update pending orders for proof upload"
  ON public.orders FOR UPDATE
  USING (status IN ('pendiente', 'comprobante_enviado'))
  WITH CHECK (true);

CREATE POLICY "Admin full access to orders"
  ON public.orders FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ORDER ITEMS
CREATE POLICY "Anyone can create order items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read order items"
  ON public.order_items FOR SELECT
  USING (true);

CREATE POLICY "Admin full access to order items"
  ON public.order_items FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- DELIVERY ZONES
CREATE POLICY "Public can read enabled delivery zones"
  ON public.delivery_zones FOR SELECT
  USING (is_enabled = true);

CREATE POLICY "Admin full access to delivery zones"
  ON public.delivery_zones FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- STORAGE BUCKETS
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false);

-- product-images: anyone can read
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- product-images: only admin can upload
CREATE POLICY "Admin upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- payment-proofs: anyone can upload
CREATE POLICY "Anyone can upload payment proof"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'payment-proofs');

-- payment-proofs: only admin can read
CREATE POLICY "Admin read payment proofs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'payment-proofs' AND auth.role() = 'authenticated');

-- ============================================
-- SEED DATA (optional - delivery zones)
-- ============================================

INSERT INTO public.delivery_zones (postal_code, zone_name, is_enabled) VALUES
  ('6600', 'Mercedes', true),
  ('6601', 'Mercedes', true),
  ('6603', 'Mercedes', true),
  ('1000', 'CABA', true),
  ('1001', 'CABA', true);
