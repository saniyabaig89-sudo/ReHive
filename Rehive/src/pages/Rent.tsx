import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PaymentModal } from '../components/PaymentModal'; // Yeh file aapne banayi hogi
import { useApp } from '../store/useApp';
import { sampleRentItems } from '../data/sampleData';

export function Rent() {
  const { isVerified, setVerified } = useApp();
  const [showKYC, setShowKYC] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleRentClick = (item: any) => {
    setSelectedItem(item);
    if (!isVerified) {
      setShowKYC(true);
    } else {
      setShowPayment(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* 1. KYC Modal */}
      {showKYC && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Identity Verification</h2>
            <p className="text-sm text-gray-600 mb-4">Security ke liye [Aadhaar Redacted] link karein.</p>
            <input 
              type="password" 
              placeholder="Enter Aadhaar Number" 
              className="w-full p-3 border rounded-lg mb-4" 
            />
            <button 
              onClick={() => { setVerified(true); setShowKYC(false); setShowPayment(true); }}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold"
            >
              Verify & Proceed
            </button>
          </div>
        </div>
      )}

      {/* 2. Payment Modal */}
      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)}
        amount={selectedItem?.daily_price}
        onConfirm={() => {
          alert("Payment Successful! Item booked.");
          setShowPayment(false);
        }}
      />

      {/* Item List */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleRentItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border p-4">
              <img src={item.images?.[0]} className="w-full h-48 object-cover rounded-xl" />
              <h3 className="font-bold mt-4">{item.title}</h3>
              <p className="text-emerald-600 font-bold">Rs. {item.daily_price}/day</p>
              <button 
                onClick={() => handleRentClick(item)}
                className="w-full mt-4 bg-emerald-600 text-white py-2 rounded-xl font-bold"
              >
                Rent Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}