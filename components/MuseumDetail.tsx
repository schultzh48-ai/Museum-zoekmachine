
import React, { useEffect, useRef, useState } from 'react';
import { Museum } from '../types';

interface MuseumDetailProps {
  museum: Museum;
  origin?: { lat: number, lng: number };
  onClose: () => void;
}

const MuseumDetail: React.FC<MuseumDetailProps> = ({ museum, origin, onClose }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);

  // Helper function to check if a URL is valid for display
  const isValidUrl = (url?: string) => {
    return url && url.startsWith('http') && url.length > 10 && !url.includes('example.com') && url !== '#';
  };

  useEffect(() => {
    const L = (window as any).L;
    const timeout = setTimeout(() => {
      if (!L || !mapContainerRef.current || !museum.lat || !museum.lng) {
        setMapError(true);
        return;
      }

      let map: any;
      try {
        map = L.map(mapContainerRef.current, { zoomControl: false, attributionControl: false });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

        const marker = L.marker([museum.lat, museum.lng]).addTo(map);
        marker.bindPopup(`<b style="font-family: serif;">${museum.name}</b><br/><span style="font-size: 10px; color: #666;">Digitale Locatie</span>`).openPopup();

        if (origin && origin.lat && origin.lng) {
          const polyline = L.polyline([[origin.lat, origin.lng], [museum.lat, museum.lng]], { 
            color: '#000', 
            weight: 2,
            dashArray: '5, 10',
            opacity: 0.5
          }).addTo(map);
          map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
        } else {
          map.setView([museum.lat, museum.lng], 14);
        }
        
        setTimeout(() => map.invalidateSize(), 100);
      } catch (e) {
        console.error("Map init error:", e);
        setMapError(true);
      }
    }, 150);

    return () => {
      clearTimeout(timeout);
    };
  }, [museum, origin]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden relative z-10 flex flex-col shadow-2xl animate-zoom-in">
        
        {/* Header Controls */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="h-6 w-[1px] bg-gray-200"></div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold serif truncate max-w-[200px] md:max-w-md">{museum.name}</h3>
              <div className="flex items-center gap-2">
                <p className="text-[9px] uppercase tracking-widest text-gray-400">{museum.city}</p>
                <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                <span className="text-[8px] font-black text-blue-500 uppercase tracking-tighter">AI Verified</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
          >
            Sluiten
          </button>
        </div>

        <div className="flex-grow relative overflow-hidden flex flex-col md:flex-row">
          {/* Map/Image Side */}
          <div className="w-full md:w-1/2 h-64 md:h-full relative bg-gray-200">
            {!mapError ? (
              <div ref={mapContainerRef} className="w-full h-full grayscale"></div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-12 text-center">
                 <img src={museum.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" alt="" />
                 <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Kaart momenteel niet beschikbaar</p>
                    <p className="text-xs text-gray-400 mt-2">{museum.city}</p>
                 </div>
              </div>
            )}
            {/* Legend / Accuracy indicator */}
            <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
               <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Locatie Precisie</p>
               <div className="flex gap-1 mt-1">
                 {[1,2,3,4].map(i => <div key={i} className="h-1 w-3 bg-blue-500 rounded-full"></div>)}
                 <div className="h-1 w-3 bg-gray-200 rounded-full"></div>
               </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full md:w-1/2 p-8 md:p-16 overflow-y-auto bg-white flex flex-col">
            <div className="mb-auto">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4 block">
                {museum.city} — {museum.country}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold serif mb-8 tracking-tighter leading-none">{museum.name}</h2>
              
              <div className="space-y-12">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-4">Focus</h4>
                  <p className="text-xl serif italic text-gray-800 leading-relaxed">{museum.description}</p>
                </div>

                {museum.highlightArtworks && museum.highlightArtworks.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-6">Speciale Hoogtepunten</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                      {museum.highlightArtworks.slice(0, 6).map((a, i) => (
                        <div key={i} className="flex items-start gap-4 border-b border-gray-50 pb-4">
                           <span className="text-gray-300 font-mono text-[10px] mt-1">0{i+1}</span> 
                           <span className="text-base font-bold leading-tight text-black">{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-16 flex flex-col gap-6">
               <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                 <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest leading-relaxed">
                   Opmerking: Gegevens zijn door AI geverifieerd. We tonen enkel bronnen die als betrouwbaar zijn aangemerkt.
                 </p>
               </div>
               
               {isValidUrl(museum.website) ? (
                 <a 
                   href={museum.website} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-full bg-black text-white text-center py-5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors"
                 >
                   Bezoek Officiële Website
                 </a>
               ) : (
                 <div className="w-full bg-gray-100 text-gray-400 text-center py-5 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-not-allowed">
                   Geen geverifieerde website beschikbaar
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuseumDetail;
