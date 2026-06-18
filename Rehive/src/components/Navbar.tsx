import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, X, Coins, Bell, ChevronDown } from 'lucide-react';
import { useApp } from '../store/useApp';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Navbar() {
  const { sidebarOpen, setSidebarOpen, user, coins, isAuthenticated, searchQuery, setSearchQuery } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-emerald-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-700" />
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="font-display text-2xl font-bold gradient-text"
              >
                ReHive
              </button>
              <span className="hidden sm:block text-xs text-gray-500 font-medium">Har Cheez Ko Ek Aur Mauka</span>
            </div>

            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items, categories, nearby rentals..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 backdrop-blur-lg border border-gray-200/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50 rounded-full">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-700">{coins.toLocaleString()}</span>
                    <span className="text-xs text-amber-600/80 hidden sm:inline">Coins</span>
                  </div>

                  <button className="relative p-2 rounded-lg hover:bg-emerald-50 transition-colors">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </button>

                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2 ml-2 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-mint-500 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="btn-primary text-sm"
                  >
                    Get Started
                  </button>
                </div>
              )}

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200 p-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items, categories..."
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
