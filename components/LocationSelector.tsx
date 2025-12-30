
import React, { useState } from 'react';

interface LocationSelectorProps {
  onSearch: (type: 'current' | 'place', value?: string) => void;
  loading: boolean;
  disabled?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onSearch, loading, disabled }) => {
  const [place, setPlace] = useState('');

  const handlePlaceSubmit = () => {
    if (!place.trim() || loading || disabled) return;
    onSearch('place', place);
    setPlace('');
  };

  const isInteractionDisabled = loading || disabled;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/50 backdrop-blur-xl p-4 md:p-6 rounded-3xl shadow-xl border border-zinc-200 flex flex-col md:flex-row gap-4">
        
        {/* Manual Input - Prominent */}
        <div className="flex-grow relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-300 group-focus-within:text-zinc-950 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder={disabled ? "Activeer API-key..." : "zoek op plaatsnaam"}
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            disabled={isInteractionDisabled}
            className="w-full bg-white border-2 border-zinc-100 rounded-2xl py-4 pl-14 pr-6 text-base font-medium focus:bg-white focus:border-zinc-300 transition-all outline-none text-zinc-950 placeholder:text-zinc-300 disabled:opacity-50"
            onKeyPress={(e) => e.key === 'Enter' && handlePlaceSubmit()}
          />
          {place.trim() && !isInteractionDisabled && (
             <button 
               onClick={handlePlaceSubmit}
               className="absolute right-3 top-1/2 -translate-y-1/2 bg-zinc-950 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all"
             >
               Zoek
             </button>
          )}
        </div>

        {/* Divider for mobile */}
        <div className="md:w-px md:h-10 md:bg-zinc-200 self-center hidden md:block"></div>

        {/* GPS Button - Secondary but clear */}
        <button 
          onClick={() => !isInteractionDisabled && onSearch('current')}
          disabled={isInteractionDisabled}
          className={`px-8 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 whitespace-nowrap ${isInteractionDisabled ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed' : 'bg-zinc-950 text-white hover:bg-zinc-800 hover:shadow-lg active:scale-95'}`}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Zoeken...</span>
            </div>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>Uw locatie</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LocationSelector;
