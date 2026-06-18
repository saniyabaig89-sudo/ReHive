import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  name: string;
  location: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  verification_method: string | null;
  total_coins: number;
  waste_prevented_kg: number;
  co2_saved_kg: number;
  items_shared: number;
  donations_completed: number;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
};

export type Item = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: 'Electronics' | 'Furniture' | 'Books' | 'Clothing' | 'Sports' | 'Tools' | 'Household' | 'Other';
  item_type: 'rent' | 'donate' | 'repair' | 'reuse';
  condition_rating: number;
  distance_km: number;
  images: string[];
  daily_price: number | null;
  weekly_price: number | null;
  security_deposit: number | null;
  estimated_repair_cost: number | null;
  difficulty_level: 'Easy' | 'Medium' | 'Hard' | null;
  material_cost_estimate: number | null;
  diy_steps: string[] | null;
  checklist: string[] | null;
  ai_recommendation: string | null;
  ai_reasoning: string | null;
  ai_sustainability_score: number | null;
  ai_waste_prevented_estimate: number | null;
  is_available: boolean;
  location: string | null;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  item_id: string;
  owner_id: string;
  borrower_id: string;
  transaction_type: 'rent' | 'donate' | 'repair';
  coins_earned: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  start_date: string | null;
  end_date: string | null;
  total_amount: number | null;
  dropoff_hub: string | null;
  created_at: string;
};

export type Badge = {
  id: string;
  user_id: string;
  badge_type: string;
  badge_name: string;
  badge_description: string | null;
  earned_at: string;
};

export type DropoffHub = {
  id: string;
  name: string;
  location: string;
  type: string;
  is_active: boolean;
};

export type NGO = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  is_verified: boolean;
  causes: string[];
};

export type RepairShop = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  contact_phone: string | null;
  specialties: string[];
  price_range_min: number | null;
  price_range_max: number | null;
  rating: number;
  coin_discount_percent: number;
};

export type LeaderboardEntry = {
  id: string;
  user_id: string;
  month_year: string;
  waste_prevented: number;
  donations_count: number;
  items_shared: number;
  rank: number | null;
};
