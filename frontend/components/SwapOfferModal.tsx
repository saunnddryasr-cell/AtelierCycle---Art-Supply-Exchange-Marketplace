import React, { useState } from 'react';
import { ArrowLeftRight, Check, DollarSign, MapPin, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getFallbackForCategory, resolveArtImage } from '../utils/imageHelper';

export const SwapOfferModal: React.FC = () => {
  const {
    isSwapModalOpen,
    closeSwapModal,
    selectedProduct,
    currentUser,
    products,
    proposeSwap,
  } = useApp();

  const [selectedMyProductId, setSelectedMyProductId] = useState<string>('');
  const [customOfferTitle, setCustomOfferTitle] = useState('');
  const [customOfferValue, setCustomOfferValue] = useState('');
  const [cashAdjustment, setCashAdjustment] = useState('0');
  const [note, setNote] = useState('');
  const [proposedLocation, setProposedLocation] = useState(
    currentUser.location || 'Campus Art Library Courtyard'
  );

  if (!isSwapModalOpen || !selectedProduct) return null;

  // Filter items owned by current user that are available
  const myAvailableProducts = products.filter(
    (p) => p.sellerId === currentUser.id && p.status === 'available'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    proposeSwap({
      requestedProductId: selectedProduct.id,
      offeredProductId: selectedMyProductId || undefined,
      offeredCustomTitle: selectedMyProductId ? undefined : customOfferTitle.trim(),
      offeredCustomValue: selectedMyProductId
        ? undefined
        : Number(customOfferValue) || selectedProduct.price,
      cashAdjustment: Math.max(0, Number(cashAdjustment) || 0),
      note: note.trim() || 'Excited to trade studio supplies with you!',
      proposedLocation: proposedLocation.trim(),
    });

    closeSwapModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-stone-900">
                Propose Material Swap
              </h2>
              <span className="text-xs text-stone-500">Direct material barter exchange</span>
            </div>
          </div>
          <button
            onClick={closeSwapModal}
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Target Product Summary Box */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
            <img
              src={resolveArtImage(selectedProduct.images[0], selectedProduct.category)}
              alt={selectedProduct.title}
              onError={(e) => {
                e.currentTarget.src = getFallbackForCategory(selectedProduct.category);
              }}
              className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Target Supply to Receive
              </span>
              <h3 className="font-semibold text-stone-900 text-xs truncate">
                {selectedProduct.title}
              </h3>
              <span className="text-xs font-mono text-stone-600 block mt-0.5">
                Value: ${selectedProduct.price} · {selectedProduct.condition}
              </span>
            </div>
          </div>

          {/* Seller's preferred trade wishlist */}
          {selectedProduct.preferredSwaps && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-stone-800">
              <span className="font-semibold text-amber-900 block mb-0.5">
                Seller is specifically looking for:
              </span>
              <p className="text-stone-700">{selectedProduct.preferredSwaps}</p>
            </div>
          )}

          {/* Select an item from user's inventory */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1.5">
              Choose an item to offer from your studio inventory:
            </label>
            {myAvailableProducts.length > 0 ? (
              <select
                value={selectedMyProductId}
                onChange={(e) => setSelectedMyProductId(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              >
                <option value="">-- Or enter a custom supply below --</option>
                {myAvailableProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} (${p.price} value)
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-stone-500 mb-2 italic">
                You have no active listings. You can enter custom supplies below!
              </p>
            )}
          </div>

          {/* Or Custom Item Offer */}
          {!selectedMyProductId && (
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <span className="font-semibold text-stone-800 block">
                Custom Material Offer:
              </span>
              <div>
                <label className="block text-stone-600 mb-1">What are you offering?</label>
                <input
                  type="text"
                  required={!selectedMyProductId}
                  placeholder="e.g. 100% Cotton Watercolor Paper Block + 3 Flat Brushes"
                  value={customOfferTitle}
                  onChange={(e) => setCustomOfferTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Estimated Value ($)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required={!selectedMyProductId}
                  placeholder="e.g. 30"
                  value={customOfferValue}
                  onChange={(e) => setCustomOfferValue(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>
            </div>
          )}

          {/* Cash top up adjustment */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Optional Cash Top-Up ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-mono">$</span>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={cashAdjustment}
                onChange={(e) => setCashAdjustment(e.target.value)}
                className="w-full pl-7 pr-3 py-2 border border-stone-300 rounded-lg font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>
            <span className="text-[11px] text-stone-400 mt-0.5 block">
              Offer extra cash if your material is worth slightly less than the target item.
            </span>
          </div>

          {/* Handover location */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Proposed Handover Location *
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={proposedLocation}
                onChange={(e) => setProposedLocation(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>
          </div>

          {/* Personal message note */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Note to Artist *
            </label>
            <textarea
              rows={2}
              required
              placeholder="Hi! I'd love to swap these supplies for my upcoming project..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeSwapModal}
              className="px-3.5 py-2 text-stone-600 hover:text-stone-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-800 hover:bg-amber-700 text-white font-semibold rounded-lg uppercase tracking-wider text-xs transition-colors shadow-xs"
            >
              Submit Swap Offer
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
