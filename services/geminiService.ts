
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GroundingChunk, Museum } from "../types";

const CACHE_KEY = 'museum_radar_cache_v15';

export class GeminiService {
  private cache: Record<string, any> = {};

  constructor() {
    this.loadCache();
  }

  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private loadCache() {
    const saved = sessionStorage.getItem(CACHE_KEY);
    if (saved) {
      try { this.cache = JSON.parse(saved); } catch (e) { this.cache = {}; }
    }
  }

  private async callWithTimeout<T>(promise: Promise<T>, ms: number = 35000): Promise<T> {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("AI_RESPONSE_TIMEOUT")), ms)
    );
    return Promise.race([promise, timeout]);
  }

  async getCityFromCoords(lat: number, lng: number): Promise<string | null> {
    const key = `city-${lat.toFixed(3)}-${lng.toFixed(3)}`;
    if (this.cache[key]) return this.cache[key];

    try {
      const ai = this.getAI();
      const response: GenerateContentResponse = await this.callWithTimeout(ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Locatie: ${lat}, ${lng}. Gebruik Google Search om de exacte stad, gemeente of wijknaam te bepalen van dit specifieke punt. Geef enkel de naam.`,
        config: { 
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 0 } 
        }
      }), 10000);

      const cityName = response.text?.trim() || null;
      if (cityName) this.saveCache(key, cityName);
      return cityName;
    } catch (err) {
      return null;
    }
  }

  async findMuseumsByCity(city: string): Promise<Partial<Museum>[]> {
    const key = `city-m-${city.toLowerCase().trim()}`;
    if (this.cache[key]) return this.cache[key];

    try {
      const ai = this.getAI();
      const response: GenerateContentResponse = await this.callWithTimeout(ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Gebruik Google Search om EXACT 8 actieve kunstmusea te vinden in of zeer dichtbij de stad: ${city}.
        CRITICAL: Verifieer via Google of ze daadwerkelijk open zijn en fysiek in de regio ${city} liggen. 
        Geef voor elk museum de exacte coördinaten (lat/lng).`,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                city: { type: Type.STRING },
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER },
                description: { type: Type.STRING },
                website: { type: Type.STRING },
                type: { type: Type.STRING },
                imageTerm: { type: Type.STRING },
                highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["name", "city", "lat", "lng", "description", "website", "type", "imageTerm", "highlights"]
            }
          }
        }
      }), 30000);

      const data = JSON.parse(response.text || "[]");
      const filtered = data.filter((m: any) => m.website && m.website.startsWith('http'));
      if (filtered.length > 0) this.saveCache(key, filtered);
      return filtered;
    } catch (err) {
      throw err;
    }
  }

  async findNearbyMuseums(lat: number, lng: number): Promise<Partial<Museum>[]> {
    const key = `coords-m-${lat.toFixed(3)}-${lng.toFixed(3)}`;
    if (this.cache[key]) return this.cache[key];

    try {
      const ai = this.getAI();
      const response: GenerateContentResponse = await this.callWithTimeout(ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Gebruik Google Search om EXACT 8 kunstmusea te vinden binnen een STRIKTE straal van 50km van coördinaten ${lat}, ${lng}. 
        CRITICAL: Verifieer hun fysieke locatie en bereken of ze echt binnen 50km liggen vanaf dit punt.
        Geef de exacte lat/lng voor kaartweergave.`,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                city: { type: Type.STRING },
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER },
                description: { type: Type.STRING },
                website: { type: Type.STRING },
                type: { type: Type.STRING },
                imageTerm: { type: Type.STRING },
                highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["name", "city", "lat", "lng", "description", "website", "type", "imageTerm", "highlights"]
            }
          }
        }
      }), 30000);

      const data = JSON.parse(response.text || "[]");
      const filtered = data.filter((m: any) => m.website && m.website.startsWith('http'));
      if (filtered.length > 0) this.saveCache(key, filtered);
      return filtered;
    } catch (err) {
      throw err;
    }
  }

  async *getNearbyActivitiesStream(topic: string, locationContext: string, radius: number = 25, coords?: { lat: number, lng: number }) {
    const ai = this.getAI();
    const coordString = coords ? `Exacte coördinaten: ${coords.lat}, ${coords.lng}.` : '';
    const prompt = `TOPIC: ${topic || 'cultuur'}. LOCATIE: ${locationContext}. ${coordString}
    Gebruik Google Search om 6 korte, actuele tips (NL) te geven voor hotspots (koffie, unieke winkels, parken) nabij dit punt. 
    Blijf STRIKT binnen een straal van ${radius}km van dit specifieke punt. 
    Verifieer de exacte afstand van elke hotspot tot de coördinaten ${coords?.lat || ''}, ${coords?.lng || ''} via Google Maps informatie en vermeld enkel de hotspots die daadwerkelijk binnen de straal vallen.`;
    
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    for await (const chunk of responseStream) {
      const sources = (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) || [];
      const validSources = sources.filter(s => (s.maps?.uri || s.web?.uri)?.startsWith('http'));
      
      yield {
        text: chunk.text || "",
        sources: validSources,
        done: false
      };
    }
  }

  async *searchMuseumInfoStream(query: string) {
    const ai = this.getAI();
    const prompt = `Beantwoord de vraag over musea of kunst feitelijk en direct (NL) met behulp van Google Search: ${query}. 
    Verifieer locaties en jaartallen via zoekopdrachten.`;
    
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    for await (const chunk of responseStream) {
      const sources = (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) || [];
      const validSources = sources.filter(s => (s.maps?.uri || s.web?.uri)?.startsWith('http'));

      yield {
        text: chunk.text || "",
        sources: validSources,
        done: false
      };
    }
  }

  private saveCache(key: string, data: any) {
    this.cache[key] = data;
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(this.cache)); } catch (e) {}
  }
}

export const gemini = new GeminiService();
