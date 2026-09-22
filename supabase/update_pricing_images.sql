-- ============================================
-- ClaraMente - Actualización de precios e imágenes
-- Correr manualmente en el SQL Editor de Supabase.
-- Revisar los WHERE antes de ejecutar si hay más de
-- un producto activo por categoría.
-- ============================================

-- Botella individual: $7.000
UPDATE public.products
SET price = 7000
WHERE category = 'individual' AND is_active = true;

-- Pack x6 botellas: $38.000 (ahorro de $4.000 vs. 6 individuales,
-- equivale a $6.333 por unidad)
UPDATE public.products
SET price = 38000
WHERE category = 'pack' AND is_active = true;

-- Nuevas fotos con tapa corona dorada (ya optimizadas a WebP en /public/products)
UPDATE public.products
SET image_url = '/products/claramente-botella-tapa-dorada.webp'
WHERE category = 'individual' AND is_active = true;

UPDATE public.products
SET image_url = '/products/claramente-pack-x6-tapa-dorada.webp'
WHERE category = 'pack' AND is_active = true;
