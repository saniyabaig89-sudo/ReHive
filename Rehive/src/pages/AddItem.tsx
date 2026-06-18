import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/useApp'; // 1. Global Store import kiya
import { generateDescription, estimatePrice, analyzeItemImage } from '../geminiService';

export function AddItem() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('Good');
  
  // 2. Global State aur Navigation
  const { addMyItem } = useApp(); 
  const navigate = useNavigate();
  
  // ... (Baaki AI states waisi hi rahengi)
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [priceInfo, setPriceInfo] = useState<{ suggestedPrice: number; range: string } | null>(null);
  const [isGettingPrice, setIsGettingPrice] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  // ... (handleGetPrice, handleAIEnhance, handleImageUpload functions wahi rahenge)
  const handleGetPrice = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!itemName) return alert("Enter item name!");
    setIsGettingPrice(true);
    const price = await estimatePrice(itemName, condition);
    setPriceInfo(price);
    setIsGettingPrice(false);
  };

  const handleAIEnhance = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!description) return alert("Write something first!");
    setIsEnhancing(true);
    const betterText = await generateDescription(description);
    setDescription(betterText);
    setIsEnhancing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setIsAnalyzingImage(true);
    const result = await analyzeItemImage(file);
    setAnalysisResult(result);
    setIsAnalyzingImage(false);
  };

  // 3. FINAL SUBMIT LOGIC (Yahan fix kiya hai)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName) return alert("Please enter an item name!");

    // Global store mein add kar rahe hain
    addMyItem({
      id: Date.now(),
      name: itemName,
      description: description,
      price: priceInfo?.suggestedPrice || 0,
      status: 'Active'
    });

    alert("Success! Item listed on ReHive.");
    navigate('/my-items'); // Listing ke baad My Items pe redirect
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-100">
      <h1 className="text-3xl font-bold text-emerald-800 mb-6">Add a New Item</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
        {/* IMAGE UPLOAD SECTION */}
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
          <label className="block text-sm font-bold text-gray-700 mb-2">Upload Photo for AI Diagnostics</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-emerald-100 file:text-emerald-700 cursor-pointer" />
          {isAnalyzingImage && <p className="text-emerald-600 mt-3 font-semibold animate-pulse">✨ AI is scanning...</p>}
          {analysisResult && (
             <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border-l-4 border-emerald-500">
               <p><strong>Recommendation:</strong> {analysisResult.recommendation}</p>
             </div>
          )}
        </div>

        {/* ITEM NAME */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Item Name</label>
          <div className="flex gap-2">
            <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} className="flex-1 p-3 border rounded-lg" placeholder="e.g. DSLR Camera" />
            <button onClick={handleGetPrice} type="button" className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-bold">✨ Get AI Price</button>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full p-3 border rounded-lg"></textarea>
          <button onClick={handleAIEnhance} type="button" className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold">✨ Make Professional</button>
        </div>

        {/* 4. Submit Button Fix */}
        <button 
          type="submit"
          className="w-full bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-800 transition"
        >
          List it on ReHive
        </button>
      </form>
    </div>
  );
}