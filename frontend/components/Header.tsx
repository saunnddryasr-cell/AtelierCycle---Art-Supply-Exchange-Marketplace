import React, { useState } from 'react';
import { ArrowLeftRight, CheckCircle2, MessageSquare, Plus, RefreshCw, ShieldCheck, Store, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getApiBaseUrl } from '../services/api';
<<<<<<< HEAD
import { ApiConfigModal } from './ApiConfigModal';
=======
>>>>>>> 0097d09 (Initial commit: AtelierCycle Marketplace)

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    openCreateListing,
    openUserSwitch,
    currentUser,
    swapOffers,
    conversations,
    isBackendConnected,
    lastSyncTime,
    refreshData,
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);
<<<<<<< HEAD
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
=======
>>>>>>> 0097d09 (Initial commit: AtelierCycle Marketplace)

  const handleManualSync = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Pending swap proposals count for current user
  const pendingSwapsCount = swapOffers.filter(
    (s) => s.ownerId === currentUser.id && s.status === 'pending'
  ).length;

  // Unread messages count
  const unreadMessagesCount = conversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0
  );

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveView('marketplace')}
          className="text-xl font-bold tracking-tight text-stone-900 font-serif whitespace-nowrap shrink-0 hover:text-stone-700 transition-colors flex items-center gap-2 text-left"
        >
          <span className="w-2.5 h-2.5 bg-amber-700 rounded-sm inline-block rotate-45"></span>
          <span>AtelierCycle</span>
        </button>

        {/* Zone 2: 4–5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveView('marketplace')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeView === 'marketplace'
                ? 'text-stone-900 font-semibold border-b-2 border-amber-800'
                : 'hover:text-stone-900'
            }`}
          >
            Marketplace
          </button>
          
          <button
            onClick={() => setActiveView('swaps')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative flex items-center gap-1.5 ${
              activeView === 'swaps'
                ? 'text-stone-900 font-semibold border-b-2 border-amber-800'
                : 'hover:text-stone-900'
            }`}
          >
            <span>Swap Hub</span>
            {pendingSwapsCount > 0 && (
              <span className="text-[10px] font-mono font-bold bg-amber-700 text-white rounded-full w-4 h-4 inline-flex items-center justify-center">
                {pendingSwapsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('chat')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative flex items-center gap-1.5 ${
              activeView === 'chat'
                ? 'text-stone-900 font-semibold border-b-2 border-amber-800'
                : 'hover:text-stone-900'
            }`}
          >
            <span>Messages</span>
            {unreadMessagesCount > 0 && (
              <span className="text-[10px] font-mono font-bold bg-amber-700 text-white rounded-full w-4 h-4 inline-flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeView === 'dashboard'
                ? 'text-stone-900 font-semibold border-b-2 border-amber-800'
                : 'hover:text-stone-900'
            }`}
          >
            My Studio
          </button>

          <button
            onClick={() => setActiveView('admin')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeView === 'admin'
                ? 'text-stone-900 font-semibold border-b-2 border-amber-800'
                : 'hover:text-stone-900'
            }`}
          >
            Safety & Admin
          </button>
        </nav>

        {/* Zone 3: 1 primary action button + user switcher profile + sync badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Live API sync status button */}
          <button
<<<<<<< HEAD
            onClick={() => setIsApiModalOpen(true)}
            title={`Backend API: ${isBackendConnected ? 'Connected (200 OK)' : 'Reconnecting'} · Click to view details or change URL.`}
=======
            onClick={handleManualSync}
            title={`Backend API: ${isBackendConnected ? 'Connected' : 'Reconnecting'} · Endpoint: ${getApiBaseUrl() || '/api'}. Click to re-sync.`}
>>>>>>> 0097d09 (Initial commit: AtelierCycle Marketplace)
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors border ${
              isBackendConnected
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-amber-700' : 'text-emerald-600'}`} />
            <span>{isBackendConnected ? 'API In Sync' : 'Syncing'}</span>
          </button>

          <button
            onClick={openCreateListing}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide uppercase text-white bg-amber-900 hover:bg-amber-800 rounded-md transition-colors shadow-xs whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>List Supplies</span>
          </button>

          {/* User switcher trigger */}
          <button
            onClick={openUserSwitch}
            className="flex items-center gap-2 p-1.5 pl-2.5 rounded-md border border-stone-200 bg-white hover:border-stone-300 transition-colors text-stone-700 text-xs"
            title="Switch demo artist profile"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover border border-stone-200"
              referrerPolicy="no-referrer"
            />
            <span className="hidden sm:inline font-medium text-stone-800 truncate max-w-[100px]">
              {currentUser.name.split(' ')[0]}
            </span>
            <span className="text-stone-400 text-[10px]">▼</span>
          </button>
        </div>

      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200 bg-stone-100/80 px-2 py-2 text-xs">
        <button
          onClick={() => setActiveView('marketplace')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 ${
            activeView === 'marketplace' ? 'text-amber-900 font-semibold' : 'text-stone-600'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Market</span>
        </button>
        <button
          onClick={() => setActiveView('swaps')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 relative ${
            activeView === 'swaps' ? 'text-amber-900 font-semibold' : 'text-stone-600'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Swaps</span>
          {pendingSwapsCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 bg-amber-700 rounded-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveView('chat')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 ${
            activeView === 'chat' ? 'text-amber-900 font-semibold' : 'text-stone-600'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat</span>
        </button>
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 ${
            activeView === 'dashboard' ? 'text-amber-900 font-semibold' : 'text-stone-600'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Studio</span>
        </button>
        <button
          onClick={() => setActiveView('admin')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 ${
            activeView === 'admin' ? 'text-amber-900 font-semibold' : 'text-stone-600'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin</span>
        </button>
      </div>
<<<<<<< HEAD

      {/* Backend API Configuration & Diagnostics Modal */}
      <ApiConfigModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />
=======
>>>>>>> 0097d09 (Initial commit: AtelierCycle Marketplace)
    </header>
  );
};
