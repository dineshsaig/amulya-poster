-- =============================================
-- Amulya Indian Cuisine — Poster Generator DB
-- Supabase / PostgreSQL Schema  (v2 — real menu)
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── BRANCHES ──
CREATE TABLE branches (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  address    TEXT,
  phone      TEXT,
  website    TEXT,
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO branches (name, slug, website) VALUES
  ('Amulya Indian Cuisine', 'amulya-main', 'www.amulyaindian.com.au');

-- ── MENU ITEMS ──
CREATE TABLE menu_items (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id  UUID REFERENCES branches(id) ON DELETE CASCADE
             DEFAULT (SELECT id FROM branches LIMIT 1),
  name       TEXT NOT NULL,
  category   TEXT NOT NULL CHECK (category IN ('veg','non-veg','dessert','accompaniment')),
  description TEXT,
  is_default  BOOLEAN DEFAULT FALSE,
  is_active   BOOLEAN DEFAULT TRUE,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menu_category ON menu_items(category, is_active, sort_order);
CREATE INDEX idx_menu_branch   ON menu_items(branch_id);

-- ── POSTER TEMPLATES ──
CREATE TABLE poster_templates (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  config      JSONB DEFAULT '{}',
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO poster_templates (name, slug, description) VALUES
  ('Classic Gold', 'classic-gold', 'Parchment cream with terracotta and gold — Amulya signature'),
  ('Festive Red',  'festive-red',  'Deep red with gold for celebrations'),
  ('Modern Dark',  'modern-dark',  'Dark background with gold highlights');

-- ── POSTER HISTORY ──
CREATE TABLE poster_history (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id      UUID REFERENCES branches(id),
  template_id    UUID REFERENCES poster_templates(id),
  day            TEXT NOT NULL,
  meal_type      TEXT NOT NULL CHECK (meal_type IN ('Lunch','Dinner')),
  veg_items      JSONB DEFAULT '[]',
  non_veg_items  JSONB DEFAULT '[]',
  desserts       JSONB DEFAULT '[]',
  accompaniments JSONB DEFAULT '[]',
  created_by     TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS ──
ALTER TABLE branches         ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE poster_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE poster_history   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read menu_items"   ON menu_items       FOR SELECT USING (TRUE);
CREATE POLICY "Public read templates"    ON poster_templates FOR SELECT USING (TRUE);
CREATE POLICY "Public read branches"     ON branches         FOR SELECT USING (TRUE);
CREATE POLICY "Auth manage menu_items"   ON menu_items       FOR ALL    USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage history"      ON poster_history   FOR ALL    USING (auth.role() = 'authenticated');

-- ════════════════════════════════
--  SEED — Amulya Real Menu Library
-- ════════════════════════════════

INSERT INTO menu_items (name, category, is_active, sort_order) VALUES
-- VEG
('Tomato Dal','veg',TRUE,1),('Methi Chaman','veg',TRUE,2),('Saag Paneer','veg',TRUE,3),
('Sambar','veg',TRUE,4),('Paneer 65 Biryani','veg',TRUE,5),('Paneer 555 Biryani','veg',TRUE,6),
('Gutti Vankaya Biryani','veg',TRUE,7),('Mylavaram Paneer Biryani','veg',TRUE,8),
('Bezawada Paneer Biryani','veg',TRUE,9),('Mushroom Masala','veg',TRUE,10),
('Mushroom Curry','veg',TRUE,11),('Spinach Curry','veg',TRUE,12),
('Vegetable Kurma','veg',TRUE,13),('Kandhari Vegetables','veg',TRUE,14),
('Aloo Gobi','veg',TRUE,15),('Tindora Fry','veg',TRUE,16),('Karela Fry','veg',TRUE,17),
('Okra Fry','veg',TRUE,18),('Potato Fry','veg',TRUE,19),('Cabbage Fry','veg',TRUE,20),
('Eggplant Curry','veg',TRUE,21),('Eggplant Bajji','veg',TRUE,22),('Gobi 65','veg',TRUE,23),
('Gobi Pakora','veg',TRUE,24),('Veg Pakora','veg',TRUE,25),('Paneer Pakora','veg',TRUE,26),
('Onion Samosa','veg',TRUE,27),('Onion Pakora','veg',TRUE,28),('Bonda','veg',TRUE,29),
('Mysore Bonda','veg',TRUE,30),('Wada','veg',TRUE,31),('Punugulu','veg',TRUE,32),
('Chitti Punugulu','veg',TRUE,33),('French Fries','veg',TRUE,34),('Baby Corn','veg',TRUE,35),
('Dry Baby Corn','veg',TRUE,36),('Loose Baby Corn','veg',TRUE,37),('Cut Mirchi','veg',TRUE,38),
('Masala Papad','veg',TRUE,39),('Jeera Rice','veg',TRUE,40),('Tamarind Rice','veg',TRUE,41),
('Pulihara','veg',TRUE,42),('Curd Rice','veg',TRUE,43),('Kashmir Pulao','veg',TRUE,44),
('Paneer Fried Rice','veg',TRUE,45),('Jackfruit Biryani','veg',TRUE,46),
('Oppu Curry','veg',TRUE,47),('Appadam Bajji','veg',TRUE,48),
('Snake Gourd Majjiga Charu','veg',TRUE,49),('Maggiga Charu','veg',TRUE,50),
('Pottlakaya Perugu Chutney','veg',TRUE,51),('Turia with Chana Dal','veg',TRUE,52),
('Turiya Chana Dal','veg',TRUE,53),
-- NON-VEG
('Goat Curry','non-veg',TRUE,1),('Lamb Curry','non-veg',TRUE,2),('Apollo Fish','non-veg',TRUE,3),
('Nellore Fish Curry','non-veg',TRUE,4),('Gongura Shrimp Curry','non-veg',TRUE,5),
('Chintachiguru Shrimp Curry','non-veg',TRUE,6),('Chicken Tikka Masala','non-veg',TRUE,7),
('Butter Chicken','non-veg',TRUE,8),('Meat Balls Curry','non-veg',TRUE,9),
('Tandoori Chicken','non-veg',TRUE,10),('Chicken Seekh Kabab','non-veg',TRUE,11),
('Chicken Fry Curry','non-veg',TRUE,12),('Chicken 65 Biryani','non-veg',TRUE,13),
('Chicken 555 Biryani','non-veg',TRUE,14),('Bezawada Chicken Biryani','non-veg',TRUE,15),
('Mylavaram Chicken Biryani','non-veg',TRUE,16),('Chicken Mughlai Biryani','non-veg',TRUE,17),
('Gongura Chicken Biryani','non-veg',TRUE,18),('Natukodi Pulusu','non-veg',TRUE,19),
('Tandoori Chicken Biryani','non-veg',TRUE,20),('Chicken Dum Biryani','non-veg',TRUE,21),
-- DESSERTS
('Fruit Custard','dessert',TRUE,1),('Coconut Mousse','dessert',TRUE,2),
('Gulab Jamun','dessert',TRUE,3),('Kheer Badam','dessert',TRUE,4),
('Pineapple Kesari','dessert',TRUE,5),('Mango Mousse','dessert',TRUE,6),
('Semiya Payasam','dessert',TRUE,7),('Carrot Halwa','dessert',TRUE,8),
('Laddu','dessert',TRUE,9),('Mango Kesari','dessert',TRUE,10),
('Saggu Biyyam Semiya Payasam','dessert',TRUE,11),
-- ACCOMPANIMENTS (fixed)
('Chutneys','accompaniment',TRUE,1),('Fryams','accompaniment',TRUE,2),
('Salads','accompaniment',TRUE,3),('Naan','accompaniment',TRUE,4),
('Tea','accompaniment',TRUE,5),('White Rice','accompaniment',TRUE,6),
('Raita','accompaniment',TRUE,7),('Roti Chutney','accompaniment',TRUE,8);
