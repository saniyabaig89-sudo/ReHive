import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Trophy, Leaf, Package, Gift, Users, TrendingUp, Calendar, ArrowUp, Medal, Crown, CrownIcon } from 'lucide-react';
import { useApp } from '../store/useApp';
import { sampleLeaderboard, sampleBadges } from '../data/sampleData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface CountingNumberProps {
  value: number;
  suffix?: string;
}

function CountingNumber({ value, suffix = '' }: CountingNumberProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export function Impact() {
  const { user } = useApp();

  const monthlyImpact = [
    { month: 'Jan', kg: 12 },
    { month: 'Feb', kg: 18 },
    { month: 'Mar', kg: 25 },
    { month: 'Apr', kg: 32 },
    { month: 'May', kg: 38 },
    { month: 'Jun', kg: 45 },
  ];

  const categoryBreakdown = [
    { category: 'Electronics', value: 35 },
    { category: 'Furniture', value: 25 },
    { category: 'Books', value: 20 },
    { category: 'Clothing', value: 15 },
    { category: 'Other', value: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Community Impact Dashboard</h1>
          <p className="text-gray-600">Track your sustainability contributions and community impact</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Waste Prevented', value: 12500, suffix: ' kg', icon: Leaf, color: 'emerald' },
            { label: 'CO2 Saved', value: 8500, suffix: ' kg', icon: TrendingUp, color: 'mint' },
            { label: 'Items Shared', value: 3200, suffix: '', icon: Package, color: 'amber' },
            { label: 'Donations', value: 1850, suffix: '', icon: Gift, color: 'ruby' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5 text-center"
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${
                stat.color === 'emerald' ? 'text-emerald-600' :
                stat.color === 'mint' ? 'text-teal-600' :
                stat.color === 'amber' ? 'text-amber-600' :
                'text-red-600'
              }`} />
              <div className="text-2xl font-bold gradient-text">
                <CountingNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-gray-900">Monthly Impact Trend</h2>
              <div className="flex items-center gap-1 text-emerald-600 text-sm">
                <ArrowUp className="w-4 h-4" />
                <span>+18% this month</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyImpact}>
                  <defs>
                    <linearGradient id="colorKg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="kg"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorKg)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-display font-semibold text-gray-900 mb-4">Category Breakdown</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBreakdown} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {categoryBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={['#10b981', '#14b8a6', '#f59e0b', '#3b82f6', '#8b5cf6'][index]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-amber-500" />
              <h2 className="text-lg font-display font-semibold text-gray-900">Neighborhood Leaderboard</h2>
            </div>
            <div className="space-y-3">
              {sampleLeaderboard.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-xl ${
                    index === 0 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50' :
                    index === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100' :
                    index === 2 ? 'bg-gradient-to-r from-orange-50 to-amber-50' :
                    'bg-gray-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-amber-400 text-white' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-orange-300 text-orange-800' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index === 0 ? <Crown className="w-6 h-6" /> : entry.rank}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {index === 0 ? (user?.name || 'You') : `User ${index + 1}`}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{entry.waste_prevented} kg prevented</span>
                      <span>{entry.donations_count} donations</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-emerald-600">{entry.items_shared}</div>
                    <div className="text-xs text-gray-500">items shared</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-semibold text-gray-900">Badges Gallery</h2>
              <span className="text-sm text-gray-500">{sampleBadges.length} available</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {sampleBadges.map((badge, index) => (
                <motion.div
                  key={badge.badge_type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border ${
                    index < 3
                      ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index < 3
                        ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
                        : 'bg-gray-200'
                    }`}>
                      <Medal className={`w-5 h-5 ${index < 3 ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${
                        index < 3 ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {badge.badge_name}
                      </div>
                      <div className="text-xs text-gray-500">{badge.badge_description}</div>
                    </div>
                    {index < 3 && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
