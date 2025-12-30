
import React from 'react';
import { Museum } from '../types';

interface MuseumCardProps {
  museum: Museum;
  onClick: (museum: Museum) => void;
}

const MuseumCard: React.FC<MuseumCardProps> = ({ museum, onClick }) => {
  const locationParts = [museum.city, museum.country].filter(p => p && p !== 'Onbekend' && p !== 'plaatsnaam');
  const locationString = locationParts.join(', ');

  return (
    <div 
      className="group cursor-pointer flex flex-col h-full transition-all duration-300 transform hover:-translate-y-1 bg-white p-8 rounded-[2rem] border border-zinc-200 shadow-sm hover:shadow-xl hover:border-zinc-300"
      onClick={() => onClick(museum)}
    >
      {/* Badges and Location */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          <span className="bg-zinc-50 text-zinc-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-zinc-100">
            {museum.type || 'Museum'}
          </span>
          {museum.distance !== undefined && (
            <span className="bg-zinc-100 text-zinc-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
              {museum.distance.toFixed(1)} KM
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-grow">
        <div className="mb-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-400 mb-1">
            {locationString}
          </p>
          <h3 className="text-2xl font-bold serif leading-tight text-zinc-900 group-hover:text-zinc-600 transition-colors">
            {museum.name}
          </h3>
        </div>
        
        <p className="text-zinc-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
          {museum.description}
        </p>
        
        <div className="mt-auto flex items-center gap-3 text-zinc-900 font-bold text-[10px] uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
          <span className="border-b-2 border-transparent group-hover:border-zinc-950 pb-0.5">Details bekijken</span>
          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MuseumCard;
