
import React, { useState } from 'react';
import { gemini } from '../services/geminiService';
import { GroundingChunk } from '../types';
import FormattedText from './FormattedText';

interface DiscoverSectionProps {
  onError?: (err: any) => void;
}

const DiscoverSection: React.FC<DiscoverSectionProps> = ({ onError }) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentSearch = search.trim();
    if (!currentSearch) return;

    setSearch('');
    setLoading(true);
    setStreamingText('');
    setSources([]);

    try {
      const stream = gemini.searchMuseumInfoStream(currentSearch);
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
      console.error(err);
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ontdekken" className="py-40 px-6 md:px-12 bg-zinc-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent"></div>
      
      <div className="max-w-5xl mx-auto">
        <div className="mb-24 text-center reveal">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-6 block">Directe Kennis</span>
          <h2 className="text-3xl md:text-4xl font-bold serif tracking-tighter text-zinc-900 leading-tight max-w-2xl mx-auto">
            Diverse vragen over de omgeving kunt U hier stellen
          </h2>
        </div>

        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-32 flex flex-col items-center gap-8 reveal">
          <div className="relative group w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Vraag alles over musea..."
              className="w-full bg-white border-2 border-transparent rounded-2xl py-8 px-10 text-xl md:text-2xl focus:ring-4 focus:ring-zinc-200 focus:bg-white focus:border-zinc-200 transition-all outline-none text-zinc-950 placeholder:text-zinc-300 shadow-sm"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="font-bold uppercase tracking-widest text-[11px] text-zinc-400 hover:text-zinc-950 transition-colors flex items-center gap-3 py-2 px-4 disabled:opacity-30"
          >
            {loading && !streamingText ? 'AI Zoekt...' : 'Start Analyse →'}
          </button>
        </form>

        {(streamingText || loading) && (
          <div className="reveal space-y-12">
            <div className="bg-white p-10 md:p-20 rounded-[40px] shadow-2xl relative min-h-[300px] overflow-hidden border border-zinc-100">
              {/* Decoratief element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <div className="max-w-3xl mx-auto relative z-10">
                {streamingText ? (
                  <FormattedText text={streamingText} className="text-zinc-900 text-xl serif italic leading-relaxed" />
                ) : (
                  <div className="flex justify-center py-10">
                    <div className="w-12 h-1 bg-zinc-100 relative overflow-hidden rounded-full">
                      <div className="absolute inset-0 bg-zinc-950 animate-slide-right"></div>
                    </div>
                  </div>
                )}
              </div>

              {sources.length > 0 && (
                <div className="mt-20 pt-16 border-t border-zinc-100 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {sources.map((source, idx) => {
                      const title = source.maps?.title || source.web?.title || "Verifieer";
                      const uri = source.maps?.uri || source.web?.uri;
                      if (!uri) return null;
                      return (
                        <a 
                          key={idx}
                          href={uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group p-6 bg-zinc-50 hover:bg-zinc-950 transition-all rounded-2xl border border-zinc-200 shadow-sm"
                        >
                          <span className="font-bold serif text-zinc-600 group-hover:text-white line-clamp-2 transition-colors">{title}</span>
                          <div className="mt-4 text-[9px] uppercase tracking-widest font-black text-zinc-400 group-hover:text-zinc-200">Bezoek →</div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DiscoverSection;
