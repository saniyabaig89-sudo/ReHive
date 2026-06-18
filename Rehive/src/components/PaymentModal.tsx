import React from 'react';

export function PaymentModal({ isOpen, onClose, onConfirm, amount }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Pay Security Deposit</h2>
        <p className="text-gray-600 mb-6">Aapko total <strong>Rs. {amount}</strong> pay karna hai.</p>
        
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-2 border rounded-lg">Cancel</button>
          <button 
            onClick={onConfirm} 
            className="flex-1 py-2 bg-emerald-600 text-white rounded-lg font-bold"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}