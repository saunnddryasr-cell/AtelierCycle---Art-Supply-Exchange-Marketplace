/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AdminPanel } from './components/AdminPanel';
import { BuyModal } from './components/BuyModal';
import { ChatInbox } from './components/ChatInbox';
import { CreateListingModal } from './components/CreateListingModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Marketplace } from './components/Marketplace';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SwapHub } from './components/SwapHub';
import { SwapOfferModal } from './components/SwapOfferModal';
import { Toast } from './components/Toast';
import { UserDashboard } from './components/UserDashboard';
import { UserSwitchModal } from './components/UserSwitchModal';
import { AppProvider, useApp } from './context/AppContext';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <main className="min-h-[calc(100vh-4rem-12rem)]">
      {activeView === 'marketplace' && <Marketplace />}
      {activeView === 'swaps' && <SwapHub />}
      {activeView === 'chat' && <ChatInbox />}
      {activeView === 'dashboard' && <UserDashboard />}
      {activeView === 'admin' && <AdminPanel />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-200">
        <Header />
        <MainContent />
        <Footer />

        {/* Interactive Modals */}
        <ProductDetailModal />
        <CreateListingModal />
        <SwapOfferModal />
        <BuyModal />
        <UserSwitchModal />
        <Toast />
      </div>
    </AppProvider>
  );
}
