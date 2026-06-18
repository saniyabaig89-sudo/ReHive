import React from 'react';
import { useApp } from '../store/useApp';

export function MyItems() {
  const { myItems } = useApp(); // Global data yahan se aayega

  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-emerald-900 mb-6">📦 My Items</h1>
      
      {myItems.length === 0 ? (
        <p className="text-gray-500">Koi item nahi hai. Pehle kuch list karein!</p>
      ) : (
        <div className="grid gap-4">
          {myItems.map((item) => (
            <div key={item.id} className="p-4 bg-white rounded-lg shadow border">
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-sm text-emerald-600">Status: {item.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}