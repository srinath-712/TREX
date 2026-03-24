import os
import json
import asyncio
from datetime import datetime, timezone, timedelta
from typing import Dict, Any

try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

# Cache to store AI responses: coin -> {"data": dict, "timestamp": datetime}
_ai_cache = {}
AI_CACHE_TTL_MINUTES = 5

def _get_gemini_fallback():
    return {
        "insight_summary": "Gemini AI integration pending. Add your GEMINI_API_KEY to the .env to activate real-time AI market analysis.",
        "hype_analysis": {
            "phase_explanation": "Awaiting AI interpretation...",
            "confidence_notes": "Awaiting AI interpretation...",
            "whale_notes": "Awaiting AI interpretation...",
            "influencer_notes": "Awaiting AI interpretation..."
        }
    }

async def analyze_coin_with_gemini(coin: str, social_data: dict, onchain_data: dict, current_phase: str, current_score: float) -> Dict[str, Any]:
    global HAS_GEMINI
    
    API_KEY = os.getenv("GEMINI_API_KEY")
    if not API_KEY or not HAS_GEMINI:
        return _get_gemini_fallback()

    now = datetime.now(timezone.utc)
    
    # Check cache to respect rate limits
    cached = _ai_cache.get(coin)
    if cached and (now - cached['timestamp']) < timedelta(minutes=AI_CACHE_TTL_MINUTES):
        return cached['data']

    try:
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
You are a professional crypto market analyst AI for TREX (The Real-Time Meme Coin Trend Explorer).
Analyze the following data for ${coin} and return a JSON object containing your insights.

Data Snapshot:
- Current Trend Score: {current_score}/1.0
- Projected Hype Phase: {current_phase}
- 24H Social Mentions: {social_data.get('curr_mentions', 0)}
- 24H Avg Sentiment (normalized -1 to 1): {social_data.get('avg_sentiment', 0.0)}
- 24H Engagement Score: {social_data.get('engagement_score', 0)}
- 24H Mention Growth: {social_data.get('mention_growth', 0) * 100}%
- On-Chain Whale Count: {onchain_data.get('curr_whale_count', 0)}
- Buy/Sell Ratio: {onchain_data.get('buy_sell_ratio', 1.0)}

Return strictly JSON format:
{{
  "insight_summary": "A punchy, professional 2-3 sentence summary of the current market state for the coin.",
  "hype_analysis": {{
    "phase_explanation": "Brief 1-sentence explanation of why it is in this phase.",
    "confidence_notes": "Brief observation on confidence based on on-chain data.",
    "whale_notes": "Brief observation on whale activity.",
    "influencer_notes": "Brief observation on social/influencer impact."
  }}
}}
"""
        response = await asyncio.to_thread(model.generate_content, prompt)
        
        # Strip markdown json blocks if present
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        result = json.loads(text.strip())
        
        # Save to cache
        _ai_cache[coin] = {"data": result, "timestamp": now}
        return result
        
    except Exception as e:
        print(f"[ERROR] Gemini Analyzer failed for {coin}: {e}")
        return _get_gemini_fallback()

async def chat_with_gemini(query: str, active_coin: str = None) -> str:
    global HAS_GEMINI
    API_KEY = os.getenv("GEMINI_API_KEY")
    if not API_KEY or not HAS_GEMINI:
        return "Gemini AI is not configured. Please add your GEMINI_API_KEY to the .env file."

    try:
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        context = ""
        if active_coin:
            from memecoin_radar.storage.time_window_store import store
            trend = store.get_trending_coins()
            history = store.get_history(active_coin)
            current_score = history[-1].final_score if history else 0
            context = f"\nSystem Context: The user is currently looking at {active_coin} with a final trend score of {current_score}. Trending coins are {trend}."
            
        prompt = f"""You are TREX AI, a highly technical, sharp, and concise crypto trading assistant built into a terminal dashboard.
Answer the user's query about memecoins, crypto trends, or specific tokens.
Keep your answer relatively brief (under 150 words) unless complex analysis is requested.{context}

User Query: {query}"""
        
        response = await asyncio.to_thread(model.generate_content, prompt)
        return response.text
    except Exception as e:
        print(f"[ERROR] Gemini Chat failed: {e}")
        return f"System Error: Unable to process AI request. ({str(e)})"
