const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// 🎯 BINGO! Yahan humne naya 'gemini-2.5-flash' model set kar diya hai
const getUrl = () => `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
}

function extractJSON(text) {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      return JSON.parse(text.slice(start, end + 1));
    }
    return JSON.parse(text); 
  } catch (error) {
    console.error("JSON Error:", text);
    return null;
  }
}

// --- 1. IMAGE SCANNER (ADD ITEM) ---
export async function analyzeItemImage(imageFile) {
  try {
    const base64Data = await fileToBase64(imageFile);
    const response = await fetch(getUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: `Analyze this image for a circular economy app. Return ONLY a JSON object: {"recommendation": "Rent/Donate/Repair/Reuse", "reasoning": "...", "condition": 4, "estimatedValue": 500, "wearAndTear": "..."}` },
            { inlineData: { mimeType: imageFile.type, data: base64Data } }
          ]
        }]
      })
    });
    const data = await response.json();
    return extractJSON(data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("Image Analysis Error:", error);
    return null;
  }
}

// --- 2. DESCRIPTION GENERATOR ---
export async function generateDescription(shortText) {
  try {
    const response = await fetch(getUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Write a polite 3-line product description for a rental app based on: "${shortText}"` }] }]
      })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    return shortText; 
  }
}

// --- 3. DIY IDEAS (REUSE) - FINAL FIX ---
export async function generateDIYIdeas(materialsQuery) {
  try {
    if (!apiKey) {
      alert("API Key gayab hai!");
      return null;
    }

    const response = await fetch(getUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `I have these items: "${materialsQuery}". Give me ONE creative DIY upcycling project. Return ONLY a raw JSON object: {"title": "...", "difficulty": "Easy", "estimatedCost": "Rs 50", "steps": ["step 1", "step 2"]}` }] }]
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      alert("🚨 GOOGLE API ERROR: " + (data.error?.message || "Unknown Google Error"));
      return null;
    }

    return extractJSON(data.candidates[0].content.parts[0].text);
    
  } catch (error) {
    alert("💻 CODE CRASH: " + error.message);
    return null;
  }
}

// --- 4. PRICE ESTIMATION ---
export async function estimatePrice(itemName, condition) {
  try {
    const response = await fetch(getUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Fair daily rental price in INR (Rs) for a "${itemName}" in "${condition}" condition? Return ONLY a JSON object: {"suggestedPrice": 500, "range": "400 - 600"}` }] }]
      })
    });
    const data = await response.json();
    return extractJSON(data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("Price Est Error:", error);
    return { suggestedPrice: 0, range: "N/A" };
  }
}