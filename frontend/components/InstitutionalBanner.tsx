import React from 'react';
import { Award, Leaf, RefreshCw } from 'lucide-react';

export const InstitutionalBanner: React.FC = () => {
  return (
    <section className="bg-stone-100 border-b border-stone-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-stone-600">
          
          {/* Circular economy statement */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-stone-800">
              <Leaf className="w-3.5 h-3.5 text-emerald-700" />
              Circular Art Economy
            </span>
            <span className="text-stone-300">|</span>
            <span className="hidden sm:inline">
              Diverting studio surplus from landfills & lowering material costs for student creators.
            </span>
          </div>

          {/* Academic & Mentor endorsement strip */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-medium text-stone-700">
            <span className="text-stone-400 text-[11px] uppercase tracking-wider">In Partnership With</span>
            <span className="hover:text-stone-900 transition-colors">National Institute of Design</span>
            <span className="text-stone-300">·</span>
            <span className="hover:text-stone-900 transition-colors">Lalit Kala Akademi</span>
            <span className="text-stone-300">·</span>
            <span className="hover:text-stone-900 transition-colors">InSEA Education Exchange</span>
            <span className="text-stone-300">·</span>
            <span className="hover:text-stone-900 transition-colors">Unified Mentor</span>
          </div>

        </div>
      </div>
    </section>
  );
};
