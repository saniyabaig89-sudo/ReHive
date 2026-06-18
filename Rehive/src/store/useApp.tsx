import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase, Profile, Item, Badge, DropoffHub, NGO, RepairShop } from '../lib/supabase';

interface AppState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  coins: number;
  sidebarOpen: boolean;
  searchQuery: string;
  activeModule: 'rent' | 'donate' | 'repair' | 'reuse' | null;
  distanceFilter: number;
  items: Item[];
  dropoffHubs: DropoffHub[];
  ngos: NGO[];
  repairShops: RepairShop[];
  badges: Badge[];
  myItems: any[];
  isVerified: boolean; // <--- Added
}

interface AppContextType extends AppState {
  setUser: (user: Profile | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, location: string) => Promise<boolean>;
  logout: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setActiveModule: (module: 'rent' | 'donate' | 'repair' | 'reuse' | null) => void;
  setDistanceFilter: (distance: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  refreshItems: () => Promise<void>;
  refreshDropoffHubs: () => Promise<void>;
  refreshNGOs: () => Promise<void>;
  refreshRepairShops: () => Promise<void>;
  refreshBadges: () => Promise<void>;
  addMyItem: (item: any) => void;
  setVerified: (status: boolean) => void; // <--- Added
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    coins: 0,
    sidebarOpen: false,
    searchQuery: '',
    activeModule: null,
    distanceFilter: 5,
    items: [],
    dropoffHubs: [],
    ngos: [],
    repairShops: [],
    badges: [],
    myItems: [],
    isVerified: false, // <--- Added
  });

  useEffect(() => {
    checkAuth();
    loadInitialData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (profile) setState(prev => ({ ...prev, user: profile, isAuthenticated: true, coins: profile.total_coins || 0 }));
    }
    setState(prev => ({ ...prev, isLoading: false }));
  };

  const loadInitialData = async () => {
    await Promise.all([refreshItems(), refreshDropoffHubs(), refreshNGOs(), refreshRepairShops()]);
  };

  // Helper functions
  const refreshItems = async () => { const { data } = await supabase.from('items').select('*'); if (data) setState(prev => ({ ...prev, items: data })); };
  const refreshDropoffHubs = async () => { const { data } = await supabase.from('dropoff_hubs').select('*').eq('is_active', true); if (data) setState(prev => ({ ...prev, dropoffHubs: data })); };
  const refreshNGOs = async () => { const { data } = await supabase.from('ngos').select('*'); if (data) setState(prev => ({ ...prev, ngos: data })); };
  const refreshRepairShops = async () => { const { data } = await supabase.from('repair_shops').select('*'); if (data) setState(prev => ({ ...prev, repairShops: data })); };
  const refreshBadges = async () => { if (!state.user) return; const { data } = await supabase.from('badges').select('*').eq('user_id', state.user.id); if (data) setState(prev => ({ ...prev, badges: data })); };

  const addMyItem = (item: any) => setState(prev => ({ ...prev, myItems: [...prev.myItems, item] }));
  const setVerified = (status: boolean) => setState(prev => ({ ...prev, isVerified: status })); // <--- Added

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return false;
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
    if (profile) {
      setState(prev => ({ ...prev, user: profile, isAuthenticated: true, coins: profile.total_coins || 0 }));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, location: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) return false;
    await supabase.from('profiles').insert({ id: data.user.id, name, location });
    setState(prev => ({ ...prev, user: { id: data.user!.id, name, location } as any, isAuthenticated: true, coins: 100 }));
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setState(prev => ({ ...prev, user: null, isAuthenticated: false, coins: 0, isVerified: false }));
  };

  return (
    <AppContext.Provider value={{
      ...state,
      setUser: (user) => setState(prev => ({ ...prev, user, isAuthenticated: !!user })),
      login, register, logout, addMyItem, setVerified,
      setSidebarOpen: (open) => setState(prev => ({ ...prev, sidebarOpen: open })),
      setSearchQuery: (query) => setState(prev => ({ ...prev, searchQuery: query })),
      setActiveModule: (module) => setState(prev => ({ ...prev, activeModule: module })),
      setDistanceFilter: (dist) => setState(prev => ({ ...prev, distanceFilter: dist })),
      addCoins: (amt) => setState(prev => ({ ...prev, coins: prev.coins + amt })),
      spendCoins: (amt) => { if (state.coins >= amt) { setState(prev => ({ ...prev, coins: prev.coins - amt })); return true; } return false; },
      refreshItems, refreshDropoffHubs, refreshNGOs, refreshRepairShops, refreshBadges
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
