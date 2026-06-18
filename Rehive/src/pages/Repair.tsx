import { motion } from 'framer-motion';
import { useState } from 'react';
import { Wrench, MapPin, Phone, Star, Coins, Tag, Clock, BadgeCheck, Search, ArrowRight, CheckCircle, Percent } from 'lucide-react';
import { sampleRepairShops, sampleCategories } from '../data/sampleData';
import { useApp } from '../store/useApp';

export function Repair() {
  const { coins, spendCoins } = useApp();
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [coinDiscountApplied, setCoinDiscountApplied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const allSpecialties = Array.from(new Set(sampleRepairShops.flatMap(s => s.specialties)));

  const filteredShops = sampleRepairShops.filter((shop) => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || shop.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const applyCoinDiscount = (discountPercent: number) => {
    const cost = 50;
    if (spendCoins(cost)) {
      setCoinDiscountApplied(true);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Discount applied! {coinDiscountApplied ? '15% off your repair!' : ''}</span>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Repair Services</h1>
          <p className="text-gray-600">Find local repair shops and extend the life of your items</p>
        </div>

        <div className="glass-card p-6 mb-8">
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Use ReHive Coins for Discounts</h3>
              <p className="text-sm text-gray-600">Spend 50 coins to get up to 20% off repair costs at partner shops</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-600">{coins.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Available Coins</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repair shops..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="all">All Specialties</option>
                {allSpecialties.map((spec) => (
                  <option key={spec} value={spec} className="capitalize">{spec}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2">
              <span className="text-sm text-gray-600">{filteredShops.length} shops found</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop, index) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card overflow-hidden card-hover ${
                selectedShop === shop.id ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              <div className="relative h-32 bg-gradient-to-br from-blue-400 to-indigo-500 p-4">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/10" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5" />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-5 h-5 text-white" />
                    <span className="text-white/80 text-sm">Repair Shop</span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-white">{shop.name}</h3>
                </div>
                <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span className="text-sm font-medium text-white">{shop.rating}</span>
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">{shop.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{shop.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    <span>{shop.contact_phone}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {shop.specialties.map((spec) => (
                    <span key={spec} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full capitalize">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="p-3 bg-gray-50 rounded-xl mb-4">
                  <div className="text-xs text-gray-500 mb-1">Estimated Price Range</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-gray-900">Rs. {shop.price_range_min}</span>
                    <span className="text-gray-500">-</span>
                    <span className="text-lg font-bold text-gray-900">Rs. {shop.price_range_max}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">
                        {shop.coin_discount_percent}% off with Coins
                      </span>
                    </div>
                    <button
                      onClick={() => applyCoinDiscount(shop.coin_discount_percent)}
                      disabled={coins < 50 || coinDiscountApplied}
                      className={`text-xs px-2 py-1 rounded-lg ${
                        coins >= 50 && !coinDiscountApplied
                          ? 'bg-amber-600 text-white hover:bg-amber-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Use 50 Coins
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Open</span>
                  </div>
                  <button
                    onClick={() => setSelectedShop(shop.id)}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    Book Service
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
