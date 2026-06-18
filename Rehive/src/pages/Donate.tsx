import { motion } from 'framer-motion';
import { useState } from 'react';
import { Heart, MapPin, Phone, Mail, BadgeCheck, Search, Filter, Gift, Coins, CheckCircle, ArrowRight } from 'lucide-react';
import { sampleNGOs, sampleDropoffHubs } from '../data/sampleData';
import { useApp } from '../store/useApp';

export function Donate() {
  const { addCoins, dropoffHubs } = useApp();
  const [selectedNGO, setSelectedNGO] = useState<string | null>(null);
  const [selectedHub, setSelectedHub] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [donationStep, setDonationStep] = useState<'select' | 'details' | 'success'>('select');

  const ngoList = sampleNGOs.filter((ngo) =>
    ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ngo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDonate = () => {
    addCoins(25);
    setDonationStep('success');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white py-8">
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Donation successful! +25 ReHive Coins earned!</span>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Donate Items</h1>
          <p className="text-gray-600">Give your items a second life by donating to verified NGOs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold text-gray-900">Select NGO</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search NGOs..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>

            <div className="space-y-4">
              {ngoList.map((ngo, index) => (
                <motion.div
                  key={ngo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setSelectedNGO(ngo.id);
                    setDonationStep('select');
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedNGO === ngo.id
                      ? 'border-amber-400 bg-amber-50/50'
                      : 'border-gray-100 bg-white hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white flex-shrink-0">
                      <Heart className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{ngo.name}</h3>
                        {ngo.is_verified && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                            <BadgeCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{ngo.description}</p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{ngo.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{ngo.contact_phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{ngo.contact_email}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {ngo.causes.map((cause) => (
                          <span key={cause} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                            {cause}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedNGO === ngo.id && (
                      <div className="flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-amber-500" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Coins className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-display font-semibold text-gray-900">Earn Rewards</h2>
              </div>

              <div className="text-center py-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                  <Gift className="w-10 h-10 text-amber-600" />
                </div>
                <div className="text-3xl font-bold text-amber-600 mb-1">+25</div>
                <div className="text-sm text-gray-600">ReHive Coins per donation</div>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Earn badges and climb the leaderboard with every donation
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-lg font-display font-semibold text-gray-900 mb-4">Drop-off Hub</h2>
              <select
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              >
                <option value="">Select a drop-off location</option>
                {(dropoffHubs.length > 0 ? dropoffHubs : sampleDropoffHubs).map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name}
                  </option>
                ))}
              </select>

              {selectedHub && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 bg-emerald-50 rounded-xl"
                >
                  <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>Location selected</span>
                  </div>
                  <p className="text-xs text-emerald-600">
                    {(dropoffHubs.length > 0 ? dropoffHubs : sampleDropoffHubs).find(h => h.id === selectedHub)?.location}
                  </p>
                </motion.div>
              )}
            </div>

            <button
              onClick={handleDonate}
              disabled={!selectedNGO || !selectedHub}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                selectedNGO && selectedHub
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {selectedNGO && selectedHub ? 'Schedule Donation' : 'Select NGO & Hub'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
