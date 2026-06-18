import React, { useState } from 'react';
import { generateDIYIdeas } from '../geminiService';

export function Reuse() {
  const [materials, setMaterials] = useState('');
  const [idea, setIdea] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetIdea = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!materials) {
      alert("Please enter the old items you have!");
      return;
    }
    
    setIsLoading(true);
    setIdea(null); // Purana idea hata dein naya aane se pehle
    
    const result = await generateDIYIdeas(materials);
    setIdea(result);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-100">
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-emerald-800 mb-4">♻️ Magic Upcycle Studio</h1>
        <p className="text-gray-600">Don't throw it away! Tell AI what old items you have, and get a creative DIY project to give them a second life.</p>
      </div>
      
      {/* INPUT SECTION */}
      <div className="bg-emerald-50/50 p-6 rounded-xl border border-emerald-200 mb-8 shadow-sm">
        <label className="block text-sm font-bold text-gray-700 mb-2">What old items do you have?</label>
        <div className="flex flex-col md:flex-row gap-3">
          <input 
            type="text" 
            value={materials} 
            onChange={(e) => setMaterials(e.target.value)} 
            placeholder="e.g. 2 glass bottles, old jeans, broken wooden chair..." 
            className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-lg"
          />
          <button 
            onClick={handleGetIdea} 
            disabled={isLoading} 
            className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md flex items-center justify-center min-w-[200px]"
          >
            {isLoading ? "Brainstorming... 🧠" : "✨ Get DIY Idea"}
          </button>
        </div>
      </div>

      {/* AI RESULT SECTION */}
      {idea && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-emerald-400 transform transition-all animate-fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-3xl font-extrabold text-gray-800">{idea.title}</h2>
            <div className="flex gap-3 mt-4 md:mt-0">
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">
                Difficulty: {idea.difficulty}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                Cost: {idea.estimatedCost}
              </span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-emerald-700 mb-4">Step-by-Step Guide:</h3>
          <ul className="space-y-3">
            {idea.steps && idea.steps.map((step: string, index: number) => (
              <li key={index} className="flex gap-4 items-start bg-gray-50 p-3 rounded-lg">
                <span className="bg-emerald-200 text-emerald-800 font-bold w-8 h-8 flex items-center justify-center rounded-full shrink-0">
                  {index + 1}
                </span>
                <span className="text-gray-700 mt-1">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
    </div>
  );
}
