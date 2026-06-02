// Gemini AI Service for Skin Journey
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
    })
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${err}`);
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function analyzeIngredients(ingredientsList, userProfile) {
  const prompt = `You are a professional cosmetic chemist and skincare expert AI. Analyze the following ingredients for a skincare product and provide a detailed safety analysis.

User Profile:
- Skin Type: ${userProfile.skinType || 'not specified'}
- Allergies: ${userProfile.allergies?.join(', ') || 'none'}
- Health Conditions: ${userProfile.healthConditions?.join(', ') || 'none'}

Ingredients to analyze:
${ingredientsList.join(', ')}

Respond in this exact JSON format:
{
  "overallRisk": "safe|caution|avoid",
  "riskScore": <0-10>,
  "aiVerdict": "<one sentence verdict>",
  "aiSummary": "<2-3 sentence summary>",
  "recommendation": "<personalized recommendation>",
  "ingredients": [
    {
      "name": "<ingredient name>",
      "riskLevel": "safe|caution|avoid",
      "riskScore": <0-10>,
      "concern": "<main concern or null>",
      "benefit": "<main benefit or null>",
      "isParaben": <true|false>,
      "isSulfate": <true|false>,
      "isFragrance": <true|false>,
      "isAlcohol": <true|false>,
      "isHormonalDisruptor": <true|false>
    }
  ],
  "allergyConflicts": ["<ingredient name if matches user allergy>"],
  "keyBenefits": ["<benefit 1>", "<benefit 2>"],
  "keyConcerns": ["<concern 1>", "<concern 2>"],
  "safeAlternatives": ["<alternative ingredient or product type>"]
}`;

  const raw = await callGemini(prompt);
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid AI response format');
  return JSON.parse(jsonMatch[0]);
}

async function checkChemicalConflicts(product1Ingredients, product2Ingredients, product1Name, product2Name) {
  const prompt = `You are a cosmetic chemist expert. Check if there are any chemical conflicts between these two skincare products:

Product 1 "${product1Name}" ingredients: ${product1Ingredients.join(', ')}
Product 2 "${product2Name}" ingredients: ${product2Ingredients.join(', ')}

Analyze for ingredient interactions like Vitamin C + Retinol, AHA/BHA + Retinol, Niacinamide + Vitamin C, etc.

Respond in JSON:
{
  "hasConflict": <true|false>,
  "conflicts": [
    {
      "ingredient1": "<name>",
      "ingredient2": "<name>",
      "severity": "low|medium|high",
      "reason": "<why they conflict>",
      "recommendation": "<what to do>",
      "waitTime": "<how long to wait between uses>",
      "saferRoutine": "<suggested routine>"
    }
  ],
  "safeToUseTogether": <true|false>,
  "aiAdvice": "<overall advice>"
}`;

  const raw = await callGemini(prompt);
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return { hasConflict: false, conflicts: [], safeToUseTogether: true };
  return JSON.parse(jsonMatch[0]);
}

async function getCycleSkinPredictions(lastPeriodDate, cycleLength, skinType) {
  const dayOfCycle = Math.floor((Date.now() - new Date(lastPeriodDate)) / (1000 * 60 * 60 * 24)) % cycleLength + 1;
  
  const prompt = `You are a dermatologist specializing in hormonal skincare. Based on cycle day ${dayOfCycle} of a ${cycleLength}-day cycle, predict skin conditions and recommendations for someone with ${skinType} skin.

Respond in JSON:
{
  "currentDay": ${dayOfCycle},
  "currentPhase": "menstrual|follicular|ovulation|luteal",
  "skinCondition": "<current skin prediction>",
  "recommendation": "<specific advice>",
  "productsToAvoid": ["<ingredient/product>"],
  "productsToUse": ["<ingredient/product>"],
  "aiInsights": "<personalized insight in friendly tone>",
  "nextPeriodIn": <days>
}`;

  const raw = await callGemini(prompt);
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid AI response');
  return JSON.parse(jsonMatch[0]);
}

async function generateSkinInsights(skinJourneyData, userProfile) {
  const recentEntries = skinJourneyData.entries?.slice(-7) || [];
  const prompt = `You are a friendly AI skincare coach. Analyze this user's skin data and provide insights.

User: ${userProfile.skinType} skin type
Recent 7 days data: ${JSON.stringify(recentEntries.map(e => ({
    date: e.date, glowScore: e.glowScore, hydration: e.hydrationScore, breakouts: e.breakouts
  })))}

Provide 3 insights in JSON:
{
  "insights": [
    {
      "type": "positive|warning|tip",
      "insight": "<friendly, Gen-Z toned insight>"
    }
  ],
  "overallTrend": "improving|stable|declining",
  "topTip": "<one actionable tip>",
  "glowForecast": "<prediction for next week>"
}`;

  const raw = await callGemini(prompt);
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid AI response');
  return JSON.parse(jsonMatch[0]);
}

async function carebotChat(messages, userProfile, systemContext) {
  const historyText = messages.slice(-10).map(m => `${m.role === 'user' ? 'User' : 'CareBot'}: ${m.content}`).join('\n');
  
  const prompt = `You are CareBot, a friendly AI skincare best friend. You give personalized skincare advice with a warm, supportive, Gen-Z friendly tone. You're knowledgeable but approachable - like a bestie who happens to be a skincare expert.

User Profile:
- Skin Type: ${userProfile.skinType || 'unknown'}
- Allergies: ${userProfile.allergies?.join(', ') || 'none'}
- Age: ${userProfile.age || 'unknown'}

${systemContext ? `Current Context: ${systemContext}` : ''}

Conversation so far:
${historyText}

Respond as CareBot in a friendly, supportive tone. Keep response under 150 words. Use emojis sparingly but warmly. Give specific, actionable skincare advice when asked.`;

  return await callGemini(prompt);
}

async function buildSkinRoutine(userProfile, goals) {
  const prompt = `You are CareBot, an expert AI skincare routine builder. Create a personalized skincare routine.

User:
- Skin Type: ${userProfile.skinType}
- Allergies: ${userProfile.allergies?.join(', ') || 'none'}
- Health Conditions: ${userProfile.healthConditions?.join(', ') || 'none'}
- Goals: ${goals || 'general skin health'}

Respond in JSON:
{
  "morningRoutine": [
    { "step": 1, "product": "<product type>", "instruction": "<how to use>", "duration": "<time>" }
  ],
  "eveningRoutine": [
    { "step": 1, "product": "<product type>", "instruction": "<how to use>", "duration": "<time>" }
  ],
  "weeklyTreatments": ["<treatment>"],
  "ingredientsToLookFor": ["<ingredient>"],
  "ingredientsToAvoid": ["<ingredient>"],
  "careBotMessage": "<friendly message about the routine>"
}`;

  const raw = await callGemini(prompt);
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid AI response');
  return JSON.parse(jsonMatch[0]);
}

module.exports = {
  analyzeIngredients,
  checkChemicalConflicts,
  getCycleSkinPredictions,
  generateSkinInsights,
  carebotChat,
  buildSkinRoutine
};
