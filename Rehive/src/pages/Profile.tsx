import { motion } from 'framer-motion';
import { MapPin, Star, Calendar, BadgeCheck, Coins, Leaf, Gift, Package, TrendingUp, Award, Edit, Settings, Share } from 'lucide-react';
import { useApp } from '../store/useApp';
import { sampleBadges } from '../data/sampleData';

export function Profile() {
  const { user, coins } = useApp();

  const earnedBadges = sampleBadges.slice(0, 3);

  const stats = [
    { label: 'Items Shared', value: user?.items_shared || 12, icon: Package, color: 'emerald' },
    { label: 'Waste Prevented', value: `${user?.waste_prevented_kg?.toFixed(1) || 15.2}kg`, icon: Leaf, color: 'mint' },
    { label: 'Donations', value: user?.donations_completed || 3, icon: Gift, color: 'amber' },
    { label: 'CO2 Saved', value: `${user?.co2_saved_kg?.toFixed(1) || 8.5}kg`, icon: TrendingUp, color: 'blue' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 glass-card p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-mint-500 flex items-center justify-center text-white text-4xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <h1 className="text-2xl font-display font-bold text-gray-900 mb-1">{user?.name || 'User'}</h1>

              <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{user?.location || 'Location not set'}</span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                {user?.is_verified && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    <BadgeCheck className="w-4 h-4" />
                    <span>Verified via DigiLocker</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(user?.rating_avg || 5)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  ({user?.rating_count || 8} reviews)
                </span>
              </div>

              <div className="flex items-center justify-center gap-16 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl mb-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-amber-600">
                    <Coins className="w-5 h-5" />
                    <span className="text-2xl font-bold">{coins.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-amber-600/80">ReHive Coins</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 btn-secondary text-sm py-2">
                  <Share className="w-4 h-4 mr-2 inline" />
                  Share
                </button>
                <button className="flex-1 btn-ghost text-sm py-2 border border-gray-200">
                  <Settings className="w-4 h-4 mr-2 inline" />
                  Settings
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-display font-semibold text-gray-900 mb-4">Impact Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center p-4 rounded-xl bg-gray-50">
                    <stat.icon className={`w-6 h-6 mx-auto mb-2 ${
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-semibold text-gray-900">Eco Badges</h2>
                <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {earnedBadges.map((badge) => (
                  <motion.div
                    key={badge.badge_type}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100"
                  >
                    <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">{badge.badge_name}</div>
                    <div className="text-xs text-gray-500 mt-1">{badge.badge_description}</div>
                  </motion.div>
                ))}
                <div className="text-center p-4 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                    <Award className="w-7 h-7 text-gray-400" />
                  </div>
                  <div className="font-medium text-gray-500 text-sm">Carbon Warrior</div>
                  <div className="text-xs text-gray-400 mt-1">100kg CO2 prevented</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="space-y-3">
                {[
                  { type: 'rent', text: 'Rented Mountain Pro Bicycle', date: '2 days ago', coins: '+10' },
                  { type: 'donate', text: 'Donated 5 Books to Books For All', date: '1 week ago', coins: '+25' },
                  { type: 'list', text: 'Listed Canon Camera for Rent', date: '2 weeks ago', coins: '+50' },
                ].map((activity, i) => {
                  const IconComponent = activity.type === 'rent' ? Package :
                    activity.type === 'donate' ? Gift : Leaf;

                  return (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'rent' ? 'bg-emerald-100 text-emerald-600' :
                        activity.type === 'donate' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{activity.text}</div>
                        <div className="text-xs text-gray-500">{activity.date}</div>
                      </div>
                      <div className="text-amber-600 font-medium text-sm">{activity.coins}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
