
import React from 'react';

interface HeaderProps {
  hasError?: boolean;
  onClose?: () => void;
  onRefresh?: () => void;
}

const Header: React.FC<HeaderProps> = ({ hasError, onClose, onRefresh }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 bg-white/10 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${hasError ? 'bg-orange-500 animate-pulse' : 'bg-white'}`}></div>
          <h1 className="text-lg font-bold tracking-tighter text-white uppercase">
            MuseumRadar
          </h1>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white transition-all"
              title="Alles wissen en opnieuw beginnen"
            >
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                <svg className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="hidden sm:block">Ververs</span>
            </button>
          )}

          {onClose && (
            <button 
              onClick={onClose}
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white transition-all"
              title="Terug naar startoverzicht"
            >
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all">
                <svg className="w-3.5 h-3.5 group-hover:text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="hidden sm:block">Sluiten</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
