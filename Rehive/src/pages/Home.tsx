import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Recycle, Gift, Wrench, Lightbulb, ArrowRight, Coins, TrendingUp, Leaf, Users, Package, Star, MapPin, BadgeCheck, Trophy } from 'lucide-react';
import { useApp } from '../store/useApp';
import { sampleRentItems, sampleLeaderboard } from '../data/sampleData';

export function Home() {
  const { user, coins } = useApp();
  const navigate = useNavigate();

  const moduleCards = [
    {
      title: 'Rent',
      description: 'Monetize idle items by renting to nearby users',
      icon: Recycle,
      path: '/rent',
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Donate',
      description: 'Give items a second life through verified NGOs',
      icon: Gift,
      path: '/donate',
      color: 'amber',
      gradient: 'from-amber-500 to-amber-600',
    },
    {
      title: 'Repair',
      description: 'Find local repair services and extend item life',
      icon: Wrench,
      path: '/repair',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Reuse / DIY',
      description: 'Transform items with creative upcycling guides',
      icon: Lightbulb,
      path: '/reuse',
      color: 'teal',
      gradient: 'from-teal-500 to-teal-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white pb-12">
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-900 mb-1">
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}!
                </h1>
                <p className="text-gray-600">Ready to make a sustainable impact today?</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl border border-amber-200/50">
                <Coins className="w-5 h-5 text-amber-600" />
                <div className="text-right">
                  <div className="text-lg font-bold text-amber-700">{coins.toLocaleString()}</div>
                  <div className="text-xs text-amber-600/80">ReHive Coins</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {[
                { label: 'Items Shared', value: user?.items_shared || 0, icon: Package, color: 'emerald' },
                { label: 'Waste Prevented', value: `${user?.waste_prevented_kg?.toFixed(1) || 0}kg`, icon: Leaf, color: 'mint' },
                { label: 'Donations', value: user?.donations_completed || 0, icon: Gift, color: 'amber' },
                { label: 'CO2 Saved', value: `${user?.co2_saved_kg?.toFixed(1) || 0}kg`, icon: TrendingUp, color: 'blue' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-3 rounded-xl bg-gray-50/50">
                  <stat.icon className={`w-5 h-5 mx-auto mb-1.5 ${
                    stat.color === 'emerald' ? 'text-emerald-600' :
                    stat.color === 'mint' ? 'text-teal-600' :
                    stat.color === 'amber' ? 'text-amber-600' :
                    'text-blue-600'
                  }`} />
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="font-display font-semibold text-gray-900">Local Leaderboard</h2>
            </div>
            <div className="space-y-3">
              {sampleLeaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    index === 0 ? 'bg-amber-50 border border-amber-200/50' : 'bg-gray-50/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-amber-400 text-white' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-amber-200 text-amber-800' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {entry.rank}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">User {index + 1}</div>
                    <div className="text-xs text-gray-500">{entry.waste_prevented}kg prevented</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-emerald-600">{entry.items_shared}</div>
                    <div className="text-xs text-gray-500">items</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/impact')}
              className="w-full mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View full rankings
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {moduleCards.map((module, index) => (
              <motion.button
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(module.path)}
                className="text-left p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-glass-lg hover:-translate-y-1 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${module.gradient} text-white`}>
                  <module.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-gray-900 mb-1">{module.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-4 h-4" />
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-gray-900">Nearby Items</h2>
              <button
                onClick={() => navigate('/rent')}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View all
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {sampleRentItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/rent`)}
                >
                  <div className="h-24 rounded-lg bg-gray-200 mb-2 overflow-hidden">
                    <img
                      src={item.images?.[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate">{item.title}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">Daily</span>
                    <span className="text-sm font-semibold text-emerald-600">Rs. {item.daily_price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-gray-900">Your Profile</h2>
              <button
                onClick={() => navigate('/profile')}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Edit
              </button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-mint-500 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{user?.name || 'User'}</h3>
                  {user?.is_verified && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                      <BadgeCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{user?.location || 'Location not set'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(user?.rating_avg || 5)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  ({user?.rating_count || 0} reviews)
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-2 text-blue-700 text-sm">
                <BadgeCheck className="w-4 h-4" />
                <span className="font-medium">DigiLocker Verification Available</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Verify your identity to unlock premium trust badges
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
