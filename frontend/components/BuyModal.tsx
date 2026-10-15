import React, { useState } from 'react';
import { CheckCircle2, MapPin, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BuyModal: React.FC = () => {
  const { isBuyModalOpen, closeBuyModal, selectedProduct, currentUser, users, completePurchase } =
    useApp();

  const [pickupLocation, setPickupLocation] = useState(
    selectedProduct?.location || 'Central Art Library Courtyard'
  );
  const [preferredTime, setPreferredTime] = useState('Tomorrow afternoon (2:00 PM - 5:00 PM)');
  const [note, setNote] = useState('');

  if (!isBuyModalOpen || !selectedProduct) return null;

  const seller = users.find((u) => u.id === selectedProduct.sellerId);
  const savings = selectedProduct.originalPrice - selectedProduct.price;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completePurchase({
      productId: selectedProduct.id,
      pickupLocation: `${pickupLocation} (${preferredTime})`,
      note: note.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-stone-900">
                Studio Pickup & Purchase
              </h2>
              <span className="text-xs text-stone-500">In-person cash or donation handover</span>
            </div>
          </div>
          <button
            onClick={closeBuyModal}
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Order Item Summary */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
            <img
              src={selectedProduct.images[0]}
              alt={selectedProduct.title}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-stone-900 text-xs truncate">
                {selectedProduct.title}
              </h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-base font-bold font-mono text-stone-900 tabular-nums">
                  {selectedProduct.price === 0 ? 'Free Cycle' : `$${selectedProduct.price}`}
                </span>
                {selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                    ${selectedProduct.originalPrice}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  You save ${savings} compared to buying new!
                </span>
              )}
            </div>
          </div>

          {/* Seller details */}
          {seller && (
            <div className="flex items-center justify-between px-3 py-2 bg-stone-100/70 rounded-lg text-stone-700">
              <span>Seller: <strong>{seller.name}</strong></span>
              <span className="text-stone-500">{seller.institution}</span>
            </div>
          )}

          {/* Pickup location */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Select Handover Spot *
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>
            <span className="text-[11px] text-stone-400 mt-0.5 block">
              Default is seller's preferred campus location.
            </span>
          </div>

          {/* Preferred time */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Preferred Handover Time
            </label>
            <input
              type="text"
              required
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
            />
          </div>

          {/* Note to seller */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Pickup Note / Contact
            </label>
            <input
              type="text"
              placeholder="e.g. I will be wearing a navy apron by the ceramic kilns"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
            />
          </div>

          {/* Payment Terms Callout */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-stone-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Transparent Cash on Handover</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              No online processing fees. Pay directly to the artist when inspecting and collecting your supplies in person.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeBuyModal}
              className="px-3.5 py-2 text-stone-600 hover:text-stone-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-800 hover:bg-amber-700 text-white font-semibold rounded-lg uppercase tracking-wider text-xs transition-colors shadow-xs"
            >
              Confirm Order & Reserve
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
