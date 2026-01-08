-- Migration: add DB-level CHECK to ensure product.stock >= 0
-- Postgres

ALTER TABLE "Product"
ADD CONSTRAINT check_stock_non_negative CHECK (stock >= 0);
