import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Check,
  CheckCircle,
  Clock,
  ExternalLink,
  MapPin,
  MessageSquare,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SwapOffer, SwapStatus } from '../types';
import { getFallbackForCategory, resolveArtImage } from '../utils/imageHelper';

export const SwapHub: React.FC = () => {
  const {
    currentUser,
    swapOffers,
    updateSwapStatus,
    startOrOpenChatWithSeller,
    products,
    setSelectedProduct,
    setActiveView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');

  // Filter swaps based on current user
  const incomingOffers = swapOffers.filter((s) => s.ownerId === currentUser.id);
  const outgoingOffers = swapOffers.filter((s) => s.proposerId === currentUser.id);

  const displayedOffers = activeTab === 'incoming' ? incomingOffers : outgoingOffers;

  const getStatusBadge = (status: SwapStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded">
            <Sparkles className="w-3 h-3" />
            Accepted · Ready for Pickup
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
            <CheckCircle className="w-3 h-3" />
            Completed Handover
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
            <X className="w-3 h-3" />
            Declined
          </span>
        );
      default:
        return null;
    }
  };

  const handleOpenProduct = (productId: string) => {
    const item = products.find((p) => p.id === productId);
    if (item) setSelectedProduct(item);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title & Philosophy Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Art Supply Swap & Exchange Hub
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-500">
            Direct artist-to-artist material barter. Exchange unused paints, surplus canvases, and tools without cash transactions.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'incoming'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Incoming Offers ({incomingOffers.length})
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'outgoing'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            My Sent Proposals ({outgoingOffers.length})
          </button>
        </div>
      </div>

      {/* Swaps Listing Container */}
      {displayedOffers.length > 0 ? (
        <div className="space-y-4">
          {displayedOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-4 transition-all hover:border-stone-300"
            >
              {/* Top Meta Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800">
                    {activeTab === 'incoming' ? `From: ${offer.proposerName}` : 'Sent to listing owner'}
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-stone-400">
                    {new Date(offer.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>{getStatusBadge(offer.status)}</div>
              </div>

              {/* Barter Exchange Visual Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Requested Item (The item owned by offer.ownerId) */}
                <div className="md:col-span-5 flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200/80">
                  <img
                    src={resolveArtImage(offer.requestedProductImage)}
                    alt={offer.requestedProductTitle}
                    onError={(e) => {
                      e.currentTarget.src = getFallbackForCategory();
                    }}
                    className="w-16 h-16 rounded-md object-cover border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold uppercase text-stone-400 block tracking-wider">
                      {activeTab === 'incoming' ? 'Your Item Requested' : 'Target Item'}
                    </span>
                    <button
                      onClick={() => handleOpenProduct(offer.requestedProductId)}
                      className="text-xs font-semibold text-stone-900 truncate hover:text-amber-800 transition-colors block w-full text-left"
                    >
                      {offer.requestedProductTitle}
                    </button>
                    <span className="text-xs font-mono text-stone-600 block mt-0.5">
                      Est. Value: ${offer.requestedProductPrice}
                    </span>
                  </div>
                </div>

                {/* Swap Icon Center */}
                <div className="md:col-span-2 flex justify-center py-2 md:py-0">
                  <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center">
                    <ArrowLeftRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Offered Item (The item proposed in exchange) */}
                <div className="md:col-span-5 flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200/80">
                  <img
                    src={resolveArtImage(offer.offeredProductImage)}
                    alt={offer.offeredProductTitle}
                    onError={(e) => {
                      e.currentTarget.src = getFallbackForCategory();
                    }}
                    className="w-16 h-16 rounded-md object-cover border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold uppercase text-amber-800 block tracking-wider">
                      {activeTab === 'incoming' ? 'Proposed in Exchange' : 'Your Offered Supply'}
                    </span>
                    <h4 className="text-xs font-semibold text-stone-900 truncate">
                      {offer.offeredProductTitle}
                    </h4>
                    <span className="text-xs font-mono text-stone-600 block mt-0.5">
                      Est. Value: ${offer.offeredProductValue}
                      {offer.cashAdjustment > 0 && ` + $${offer.cashAdjustment} cash`}
                    </span>
                  </div>
                </div>

              </div>

              {/* Note & Location Details */}
              <div className="bg-stone-50/70 p-3 rounded-lg border border-stone-200/60 text-xs space-y-1.5">
                <p className="text-stone-700">
                  <strong className="text-stone-900">Exchange Note: </strong>
                  "{offer.note}"
                </p>
                <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span>Proposed Handover Spot: {offer.proposedLocation}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const item = products.find((p) => p.id === offer.requestedProductId);
                    if (item) startOrOpenChatWithSeller(item);
                    else setActiveView('chat');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-700 hover:text-stone-900 border border-stone-300 hover:bg-stone-50 rounded-md transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                  <span>Coordinate in Chat</span>
                </button>

                {/* Handlers for incoming offers */}
                {activeTab === 'incoming' && offer.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateSwapStatus(offer.id, 'declined')}
                      className="px-3 py-1.5 text-xs text-stone-600 hover:text-red-700 hover:bg-red-50 border border-stone-300 rounded-md transition-colors"
                    >
                      Decline Offer
                    </button>
                    <button
                      onClick={() => updateSwapStatus(offer.id, 'accepted')}
                      className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-700 rounded-md transition-colors shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Swap</span>
                    </button>
                  </div>
                )}

                {/* Handlers if status is accepted: Mark Completed */}
                {offer.status === 'accepted' && (
                  <button
                    onClick={() => updateSwapStatus(offer.id, 'completed')}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-md transition-colors shadow-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Confirm Handover Completed</span>
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center max-w-md mx-auto">
          <ArrowLeftRight className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-serif font-bold text-stone-900">
            {activeTab === 'incoming' ? 'No incoming swap offers yet' : 'You haven’t proposed any swaps yet'}
          </h3>
          <p className="mt-2 text-xs text-stone-500 leading-relaxed">
            {activeTab === 'incoming'
              ? 'When other artists offer to exchange their materials for your supplies, proposals will appear here.'
              : 'Browse marketplace items open for swap and propose trades using your own studio supplies!'}
          </p>
          <div className="mt-5">
            <button
              onClick={() => setActiveView('marketplace')}
              className="px-4 py-2 bg-stone-900 text-stone-50 text-xs font-medium rounded-md hover:bg-stone-800 transition-colors"
            >
              Explore Swap Listings
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
