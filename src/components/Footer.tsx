import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-400 text-xs border-t border-stone-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-stone-100 font-serif font-bold text-lg">
              <span className="w-2.5 h-2.5 bg-amber-600 rounded-sm inline-block rotate-45"></span>
              <span>AtelierCycle</span>
            </div>
            <p className="text-stone-400 max-w-sm leading-relaxed">
              A circular second-hand art supply exchange connecting emerging art students, guild masters, and hobbyists. Reducing studio waste, promoting sustainable reuse, and keeping creative tools affordable.
            </p>
            <div className="text-[11px] text-stone-500">
              Co-developed with mentors from Unified Mentor, Lalit Kala Akademi, and National Institute of Design.
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <span className="font-semibold text-stone-200 block mb-3 uppercase tracking-wider text-[11px]">
              Marketplace
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveView('marketplace')}
                  className="hover:text-stone-200 transition-colors"
                >
                  Explore Supplies
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('swaps')}
                  className="hover:text-stone-200 transition-colors"
                >
                  Active Swap Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('chat')}
                  className="hover:text-stone-200 transition-colors"
                >
                  Artist Inbox
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="hover:text-stone-200 transition-colors"
                >
                  My Studio Inventory
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional Guidelines */}
          <div>
            <span className="font-semibold text-stone-200 block mb-3 uppercase tracking-wider text-[11px]">
              Safety & Governance
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveView('admin')}
                  className="hover:text-stone-200 transition-colors"
                >
                  Safety Desk & Moderation
                </button>
              </li>
              <li>
                <span className="text-stone-500">Hazardous Chemical Disposal Rules</span>
              </li>
              <li>
                <span className="text-stone-500">Campus Handover Guidelines</span>
              </li>
              <li>
                <span className="text-stone-500">Zero-Waste Material Impact</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            © 2026 AtelierCycle Marketplace. Dedicated to circular fine arts & creative education.
          </div>
          <div className="flex items-center gap-4">
            <span>Student First</span>
            <span>·</span>
            <span>Zero Landfill Waste</span>
            <span>·</span>
            <span>Community Curated</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
