import React from 'react';
import { ArrowRight } from 'lucide-react';

const SAMPLE_ARRIVALS = [
  {
    id: '1',
    name: 'Deep Maroon Zari',
    color: '#8C3B1F',
    bgGradient: 'from-[#4A151B] to-[#2D0D11]',
    borderColor: '#D4AF37'
  },
  {
    id: '2',
    name: 'Ivory Gold Kasavu',
    color: '#F4ECE1',
    bgGradient: 'from-[#FAF4EB] to-[#E3D0B9]',
    borderColor: '#C59B27'
  },
  {
    id: '3',
    name: 'Emerald Green Zari',
    color: '#133E2B',
    bgGradient: 'from-[#1A5038] to-[#0D281C]',
    borderColor: '#D4AF37'
  },
  {
    id: '4',
    name: 'Royal Purple Saree',
    color: '#4C1D42',
    bgGradient: 'from-[#5C2350] to-[#36142F]',
    borderColor: '#D4AF37'
  }
];

export default function NewArrivalsPreview() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-[11px] sm:text-xs tracking-[0.25em] font-bold text-[#8C3B1F] uppercase">
          New Arrivals
        </span>
        <span className="h-[1px] w-6 bg-[#8C3B1F]/30"></span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto py-1 scrollbar-none">
        {SAMPLE_ARRIVALS.map((item) => (
          <button
            key={item.id}
            className="group relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full p-[2px] transition-transform duration-300 hover:scale-105"
            style={{ backgroundColor: item.borderColor }}
            aria-label={item.name}
          >
            <div className={`w-full h-full rounded-full bg-gradient-to-br ${item.bgGradient} flex items-center justify-center overflow-hidden shadow-inner border border-white/20`}>
              <div className="w-full h-full opacity-75 mix-blend-overlay bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:6px_6px]" />
            </div>
          </button>
        ))}

        <button 
          className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FAF7EC] hover:bg-[#8C3B1F] text-[#8C3B1F] hover:text-[#FFFFF0] border border-[#E5D9C8] flex items-center justify-center transition-all duration-300 shadow-sm"
          aria-label="Next arrivals"
        >
          <ArrowRight className="w-4 h-4 stroke-[2]" />
        </button>
      </div>
    </div>
  );
}
