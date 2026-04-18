/*
  # Onsus eCommerce Schema

  ## Tables Created
  1. `categories` - Product categories and subcategories
     - id, name_en, name_az, name_ru, slug, icon, parent_id
  2. `products` - All product listings
     - id, name_en, name_az, name_ru, category_id, price, original_price, discount_percent,
       rating, review_count, image_url, is_featured, is_top_rated, is_on_sale,
       stock_available, stock_sold, is_deal_of_day, created_at

  ## Security
  - RLS enabled on both tables
  - Public read access for all products and categories (storefront)
  - No write access from client (read-only public catalog)
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_az text NOT NULL,
  name_ru text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text DEFAULT '',
  parent_id uuid REFERENCES categories(id),
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_az text NOT NULL,
  name_ru text NOT NULL,
  category_id uuid REFERENCES categories(id),
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  discount_percent int DEFAULT 0,
  rating numeric(3,1) DEFAULT 0,
  review_count int DEFAULT 0,
  image_url text NOT NULL DEFAULT '',
  is_featured boolean DEFAULT false,
  is_top_rated boolean DEFAULT false,
  is_on_sale boolean DEFAULT false,
  is_deal_of_day boolean DEFAULT false,
  stock_available int DEFAULT 100,
  stock_sold int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Seed categories
INSERT INTO categories (name_en, name_az, name_ru, slug, sort_order) VALUES
  ('Apparel', 'Geyim', 'Одежда', 'apparel', 1),
  ('Automotive Parts', 'Avtomobil hissələri', 'Автозапчасти', 'automotive', 2),
  ('Beauty & Personal Care', 'Gözəllik və Qişi Qayğısı', 'Красота и уход', 'beauty', 3),
  ('Consumer Electronics', 'İstehlak Elektronikası', 'Электроника', 'electronics', 4),
  ('Furniture', 'Mebel', 'Мебель', 'furniture', 5),
  ('Home Products', 'Ev Məhsulları', 'Товары для дома', 'home', 6),
  ('Tools & Hardware', 'Alətlər və Avadanlıq', 'Инструменты', 'tools', 7),
  ('Timepieces & Jewelry', 'Saatlar və Zərgərlik', 'Часы и украшения', 'jewelry', 8),
  ('Smartphones', 'Smartfonlar', 'Смартфоны', 'smartphones', 9),
  ('Headphones', 'Qulaqlıqlar', 'Наушники', 'headphones', 10),
  ('Smartwatches', 'Ağıllı saatlar', 'Умные часы', 'smartwatches', 11),
  ('Cameras', 'Kameralar', 'Камеры', 'cameras', 12),
  ('Laptops & Tablets', 'Noutbuk və Planşetlər', 'Ноутбуки и планшеты', 'laptops', 13),
  ('Gaming', 'Oyun avadanlığı', 'Игровые устройства', 'gaming', 14);

-- Seed products
INSERT INTO products (name_en, name_az, name_ru, category_id, price, original_price, discount_percent, rating, review_count, image_url, is_featured, is_top_rated, is_on_sale, is_deal_of_day, stock_available, stock_sold) VALUES
  (
    'iPhone 15 Pro Max',
    'iPhone 15 Pro Max',
    'iPhone 15 Pro Max',
    (SELECT id FROM categories WHERE slug='smartphones'),
    1199.00, 1399.00, 14, 4.8, 2341,
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600',
    true, true, true, false, 150, 89
  ),
  (
    'Samsung Galaxy S24 Ultra',
    'Samsung Galaxy S24 Ultra',
    'Samsung Galaxy S24 Ultra',
    (SELECT id FROM categories WHERE slug='smartphones'),
    1099.00, 1299.00, 15, 4.7, 1876,
    'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=600',
    true, false, true, false, 200, 112
  ),
  (
    'Sony WH-1000XM5 Headphones',
    'Sony WH-1000XM5 Qulaqlıq',
    'Наушники Sony WH-1000XM5',
    (SELECT id FROM categories WHERE slug='headphones'),
    279.00, 399.00, 30, 4.9, 3421,
    'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600',
    true, true, true, true, 80, 62
  ),
  (
    'Apple Watch Series 9',
    'Apple Watch Series 9',
    'Apple Watch Series 9',
    (SELECT id FROM categories WHERE slug='smartwatches'),
    329.00, 429.00, 23, 4.8, 1654,
    'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600',
    true, true, false, false, 120, 78
  ),
  (
    'Canon EOS R50 Camera',
    'Canon EOS R50 Kamera',
    'Камера Canon EOS R50',
    (SELECT id FROM categories WHERE slug='cameras'),
    679.00, 799.00, 15, 4.6, 987,
    'https://images.pexels.com/photos/243757/pexels-photo-243757.jpeg?auto=compress&cs=tinysrgb&w=600',
    false, true, true, false, 45, 33
  ),
  (
    'MacBook Pro 14" M3',
    'MacBook Pro 14" M3',
    'MacBook Pro 14" M3',
    (SELECT id FROM categories WHERE slug='laptops'),
    1999.00, 2299.00, 13, 4.9, 2109,
    'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600',
    true, true, false, false, 60, 47
  ),
  (
    'PlayStation 5 Console',
    'PlayStation 5 Konsol',
    'Консоль PlayStation 5',
    (SELECT id FROM categories WHERE slug='gaming'),
    499.00, 649.00, 23, 4.8, 4231,
    'https://images.pexels.com/photos/3977908/pexels-photo-3977908.jpeg?auto=compress&cs=tinysrgb&w=600',
    true, false, true, false, 30, 25
  ),
  (
    'JBL Tune 770NC Headphones',
    'JBL Tune 770NC Qulaqlıq',
    'Наушники JBL Tune 770NC',
    (SELECT id FROM categories WHERE slug='headphones'),
    99.00, 149.00, 34, 4.5, 876,
    'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=600',
    false, false, true, false, 200, 143
  ),
  (
    'Samsung Galaxy Watch 6',
    'Samsung Galaxy Watch 6',
    'Samsung Galaxy Watch 6',
    (SELECT id FROM categories WHERE slug='smartwatches'),
    249.00, 329.00, 24, 4.5, 1243,
    'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=600',
    false, true, true, false, 90, 55
  ),
  (
    'GoPro Hero 12 Black',
    'GoPro Hero 12 Black',
    'GoPro Hero 12 Black',
    (SELECT id FROM categories WHERE slug='cameras'),
    349.00, 449.00, 22, 4.7, 2341,
    'https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?auto=compress&cs=tinysrgb&w=600',
    false, true, true, false, 75, 52
  ),
  (
    'Dell XPS 15 Laptop',
    'Dell XPS 15 Noutbuk',
    'Ноутбук Dell XPS 15',
    (SELECT id FROM categories WHERE slug='laptops'),
    1499.00, 1799.00, 17, 4.6, 1432,
    'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600',
    false, true, false, false, 40, 28
  ),
  (
    'Xbox Series X',
    'Xbox Series X',
    'Xbox Series X',
    (SELECT id FROM categories WHERE slug='gaming'),
    449.00, 549.00, 18, 4.7, 3102,
    'https://images.pexels.com/photos/1476321/pexels-photo-1476321.jpeg?auto=compress&cs=tinysrgb&w=600',
    true, false, false, false, 25, 18
  ),
  (
    'Bose QuietComfort 45',
    'Bose QuietComfort 45',
    'Bose QuietComfort 45',
    (SELECT id FROM categories WHERE slug='headphones'),
    249.00, 329.00, 24, 4.7, 2187,
    'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=600',
    false, true, true, false, 110, 87
  ),
  (
    'Google Pixel 8 Pro',
    'Google Pixel 8 Pro',
    'Google Pixel 8 Pro',
    (SELECT id FROM categories WHERE slug='smartphones'),
    899.00, 1099.00, 18, 4.6, 1234,
    'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600',
    false, false, true, false, 100, 67
  ),
  (
    'iPad Pro 12.9" M2',
    'iPad Pro 12.9" M2',
    'iPad Pro 12.9" M2',
    (SELECT id FROM categories WHERE slug='laptops'),
    1099.00, 1299.00, 15, 4.8, 1876,
    'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=600',
    true, true, false, false, 85, 61
  ),
  (
    'Garmin Forerunner 965',
    'Garmin Forerunner 965',
    'Garmin Forerunner 965',
    (SELECT id FROM categories WHERE slug='smartwatches'),
    599.00, 699.00, 14, 4.8, 876,
    'https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=600',
    false, true, false, false, 55, 32
  );
