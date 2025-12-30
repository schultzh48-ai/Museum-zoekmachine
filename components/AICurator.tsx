
import React, { useState, useEffect, useRef } from 'react';
import { gemini } from '../services/geminiService';
import { GroundingChunk } from '../types';
import FormattedText from './FormattedText';

interface AICuratorProps {
  activeArea?: string;
  activeCoords?: { lat: number, lng: number };
  onError?: (err: any) => void;
}

const AICurator: React.FC<AICuratorProps> = ({ activeArea, activeCoords, onError }) => {
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  
  const lastProcessedRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  const locationName = activeArea || 'uw omgeving';

  useEffect(() => {
    const latStr = activeCoords?.lat ? activeCoords.lat.toFixed(3) : 'none';
    const lngStr = activeCoords?.lng ? activeCoords.lng.toFixed(3) : 'none';
    const locKey = activeArea ? `${activeArea}-${latStr}-${lngStr}-${radius}` : null;
    
    if (activeArea && locKey !== lastProcessedRef.current) {
      setStreamingText('');
      setSources([]);
      setError(null);
      
      if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
      
      debounceTimerRef.current = window.setTimeout(() => {
        lastProcessedRef.current = locKey;
        startStreaming('', locationName, radius, activeCoords);
      }, 500);
    }

    return () => {
      if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
    };
  }, [activeArea, activeCoords, radius]);

  const startStreaming = async (topic: string, area: string, searchRadius: number, coords?: { lat: number, lng: number }) => {
    setLoading(true);
    setError(null);
    setStreamingText('');
    setSources([]);

    try {
      const stream = gemini.getNearbyActivitiesStream(topic, area, searchRadius, coords);
      let fullText = "";
      let allSources: GroundingChunk[] = [];

      for await (const chunk of stream) {
        if (chunk.text) {
          fullText += chunk.text;
          setStreamingText(fullText);
        }
        if (chunk.sources && chunk.sources.length > 0) {
          allSources = [...allSources, ...chunk.sources];
          const uniqueSources = Array.from(new Map(allSources.map(s => [s.maps?.uri || s.web?.uri, s])).values());
          setSources(uniqueSources);
        }
      }
    } catch (err: any) {
      setError("Kon geen live gids laden.");
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="curator" className="py-24 px-6 md:px-12 bg-zinc-50 border-y border-zinc-200 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-zinc-950/[0.02] skew-x-12 translate-x-20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Left: Settings & Intro */}
          <div className="lg:w-1/3 space-y-8">
            <div className="space-y-4">
              <span className="bg-zinc-200 text-zinc-600 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest inline-block border border-zinc-300">Persoonlijke Gids</span>
              <h2 className="text-4xl font-bold serif text-zinc-900 leading-tight">
                Hotspots
              </h2>
              <p className="text-zinc-500 text-base leading-relaxed">AI-gestuurde tips voor cultuur, koffie en verborgen parels nabij de musea.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
               <div className="flex justify-between items-end">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Zoekstraal</span>
                 <span className="text-xl font-bold text-zinc-950">{radius} <span className="text-xs font-normal text-zinc-400">km</span></span>
               </div>
               <input 
                 type="range" 
                 min="1" 
                 max="50" 
                 value={radius} 
                 onChange={(e) => setRadius(parseInt(e.target.value))}
                 className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-zinc-950"
               />
               <p className="text-[10px] text-zinc-400 italic">De gids past zich automatisch aan op de gekozen afstand.</p>
            </div>
          </div>

          {/* Right: Streaming Results */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden min-h-[400px] border border-zinc-100">
              <div className="absolute top-0 right-0 p-8">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                   <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Live AI Analysis</span>
                </div>
              </div>

              <div className="relative z-10">
                {streamingText ? (
                  <div className="space-y-8">
                    <FormattedText text={streamingText} className="text-zinc-800 text-lg md:text-xl serif italic leading-relaxed" />
                    
                    {sources.length > 0 && (
                      <div className="pt-8 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {sources.slice(0, 6).map((s, i) => (
                          <a 
                            key={i} 
                            href={s.maps?.uri || s.web?.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-zinc-50 hover:bg-zinc-100 px-6 py-4 rounded-2xl transition-all border border-zinc-200 hover:border-zinc-300 flex items-center justify-between group"
                          >
                            <span className="text-xs font-bold text-zinc-600 group-hover:text-zinc-950 truncate">{s.maps?.title || s.web?.title}</span>
                            <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : loading ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-12 h-1 bg-zinc-100 rounded-full overflow-hidden mb-6">
                      <div className="w-1/2 h-full bg-zinc-950 animate-slide-right"></div>
                    </div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Curator stelt gids samen...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-zinc-300">
                    <p className="text-sm italic serif">Selecteer een locatie om de gids te activeren.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AICurator;
