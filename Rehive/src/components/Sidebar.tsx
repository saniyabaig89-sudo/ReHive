import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Package, Plus, Heart, BarChart3, Settings, LogOut, Home, Recycle, Gift, Wrench, Lightbulb } from 'lucide-react';
import { useApp } from '../store/useApp';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/home' },
  { icon: User, label: 'My Profile', path: '/profile' },
  { icon: Package, label: 'My Items', path: '/my-items' },
  { icon: Plus, label: 'Add Item', path: '/add-item' },
  { icon: Heart, label: 'Saved Items', path: '/saved' },
  { icon: BarChart3, label: 'Impact Dashboard', path: '/impact' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const actionItems = [
  { icon: Recycle, label: 'Rent', path: '/rent', color: 'emerald' },
  { icon: Gift, label: 'Donate', path: '/donate', color: 'amber' },
  { icon: Wrench, label: 'Repair', path: '/repair', color: 'blue' },
  { icon: Lightbulb, label: 'Reuse/DIY', path: '/reuse', color: 'mint' },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, logout, user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-40"
          />

          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-72 z-50 bg-white shadow-2xl"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-mint-500 flex items-center justify-center text-white font-bold text-lg">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{user?.name || 'User'}</div>
                      <div className="text-sm text-gray-500">{user?.location || 'Location not set'}</div>
                    </div>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-4 border-b border-gray-100">
                <div className="grid grid-cols-2 gap-2">
                  {actionItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`flex items-center gap-2 p-3 rounded-xl transition-all ${
                        item.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' :
                        item.color === 'amber' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' :
                        item.color === 'blue' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' :
                        'bg-teal-50 text-teal-700 hover:bg-teal-100'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto p-2">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
