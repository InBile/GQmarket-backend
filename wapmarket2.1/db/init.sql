-- init.sql for WapMarket production scaffold
-- Run this inside the postgres database (or use docker-compose which creates the DB/user automatically)

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  brand TEXT,
  image_url TEXT,
  category_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT now()
);

-- Banners
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT,
  link TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT,
  phone TEXT,
  address TEXT,
  items JSONB,
  shipping BOOLEAN DEFAULT false,
  subtotal INTEGER,
  shipping_cost INTEGER,
  total INTEGER,
  created_at TIMESTAMP DEFAULT now()
);

-- Users (admin)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Seed categories
INSERT INTO categories (name) VALUES ('Alimentos'), ('Bebidas'), ('Limpieza'), ('Comida rápida') ON CONFLICT DO NOTHING;

-- Sample products
INSERT INTO products (name, price, description, brand, image_url, category_id) VALUES
('Arroz 5kg', 4500, 'Arroz de primera calidad, paquete de 5 kg', 'MarcaLocal', 'https://via.placeholder.com/600x400?text=Arroz+5kg', 1),
('Aceite 1L', 2500, 'Aceite vegetal comestible 1 litro', 'MarcaLocal', 'https://via.placeholder.com/600x400?text=Aceite+1L', 1),
('Pan 1 unidad', 300, 'Pan fresco por unidad', 'Panadería', 'https://via.placeholder.com/600x400?text=Pan', 4),
('Hamburguesa Clasica', 2500, 'Hamburguesa con carne, queso y salsa especial', 'WapBurgers', 'https://via.placeholder.com/600x400?text=Hamburguesa', 4),
('Refresco 330ml', 800, 'Bebida gaseosa 330ml', 'MarcaRefresco', 'https://via.placeholder.com/600x400?text=Refresco', 2),
('Detergente 1L', 3500, 'Detergente líquido para ropa', 'Limpio', 'https://via.placeholder.com/600x400?text=Detergente', 3)
ON CONFLICT DO NOTHING;

-- Sample banner
INSERT INTO banners (title, description, image_url, link) VALUES
('Promo Comida rápida', 'Pide tu comida rápida favorita y recibe descuento los fines de semana', 'https://via.placeholder.com/1200x400?text=Promo+Comida+rapida', '#')
ON CONFLICT DO NOTHING;
