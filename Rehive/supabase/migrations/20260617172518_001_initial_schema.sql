-- Users profile table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  verification_method TEXT,
  total_coins INTEGER DEFAULT 0,
  waste_prevented_kg DECIMAL DEFAULT 0,
  co2_saved_kg DECIMAL DEFAULT 0,
  items_shared INTEGER DEFAULT 0,
  donations_completed INTEGER DEFAULT 0,
  rating_avg DECIMAL DEFAULT 5.0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id);

CREATE POLICY "users_insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- Items table
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Electronics', 'Furniture', 'Books', 'Clothing', 'Sports', 'Tools', 'Household', 'Other')),
  item_type TEXT NOT NULL CHECK (item_type IN ('rent', 'donate', 'repair', 'reuse')),
  condition_rating INTEGER DEFAULT 5 CHECK (condition_rating >= 1 AND condition_rating <= 5),
  distance_km DECIMAL DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  -- Rent specific fields
  daily_price DECIMAL,
  weekly_price DECIMAL,
  security_deposit DECIMAL,
  -- Repair specific fields
  estimated_repair_cost DECIMAL,
  -- Reuse specific fields
  difficulty_level TEXT CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard')),
  material_cost_estimate DECIMAL,
  diy_steps TEXT[],
  checklist TEXT[],
  -- AI diagnostics
  ai_recommendation TEXT,
  ai_reasoning TEXT,
  ai_sustainability_score INTEGER,
  ai_waste_prevented_estimate DECIMAL,
  -- Status
  is_available BOOLEAN DEFAULT true,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "items_select_all" ON items FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "items_insert_own" ON items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "items_update_own" ON items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "items_delete_own" ON items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  borrower_id UUID REFERENCES profiles(id) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('rent', 'donate', 'repair')),
  coins_earned INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  total_amount DECIMAL,
  dropoff_hub TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_select_involved" ON transactions FOR SELECT
  TO authenticated USING (auth.uid() = owner_id OR auth.uid() = borrower_id);

CREATE POLICY "transactions_insert" ON transactions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = borrower_id);

CREATE POLICY "transactions_update_involved" ON transactions FOR UPDATE
  TO authenticated USING (auth.uid() = owner_id OR auth.uid() = borrower_id);

-- Badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_type)
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "badges_select_all" ON badges FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "badges_insert_own" ON badges FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Leaderboard (monthly)
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  month_year TEXT NOT NULL,
  waste_prevented DECIMAL DEFAULT 0,
  donations_count INTEGER DEFAULT 0,
  items_shared INTEGER DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leaderboard_select_all" ON leaderboard_entries FOR SELECT
  TO authenticated USING (true);

-- Dropoff hubs
CREATE TABLE dropoff_hubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dropoff_hubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hubs_select_all" ON dropoff_hubs FOR SELECT
  TO authenticated USING (true);

-- NGOs
CREATE TABLE ngos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  is_verified BOOLEAN DEFAULT false,
  causes TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ngos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ngos_select_all" ON ngos FOR SELECT
  TO authenticated USING (true);

-- Repair shops
CREATE TABLE repair_shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  contact_phone TEXT,
  specialties TEXT[],
  price_range_min DECIMAL,
  price_range_max DECIMAL,
  rating DECIMAL DEFAULT 4.5,
  coin_discount_percent INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE repair_shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "repair_shops_select_all" ON repair_shops FOR SELECT
  TO authenticated USING (true);

-- Item ratings (for dual-sided rating system)
CREATE TABLE item_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  rater_id UUID REFERENCES profiles(id) NOT NULL,
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(item_id, rater_id)
);

ALTER TABLE item_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ratings_select_all" ON item_ratings FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "ratings_insert" ON item_ratings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = rater_id);

-- Saved items
CREATE TABLE saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_select_own" ON saved_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "saved_insert_own" ON saved_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_delete_own" ON saved_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
