import React, { useState } from 'react';
import {
  ArrowLeftRight,
  CheckCircle2,
  Heart,
  MapPin,
  MessageSquare,
  PackageCheck,
  Scale,
  Shield,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    users,
    currentUser,
    openSwapModal,
    openBuyModal,
    startOrOpenChatWithSeller,
    toggleSaveProduct,
    savedProductIds,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedProduct) return null;

  const seller = users.find((u) => u.id === selectedProduct.sellerId);
  const isSaved = savedProductIds.includes(selectedProduct.id);
  const isOwner = selectedProduct.sellerId === currentUser.id;

  const discountPercent =
    selectedProduct.originalPrice > selectedProduct.price
      ? Math.round(
          ((selectedProduct.originalPrice - selectedProduct.price) /
            selectedProduct.originalPrice) *
            100
        )
      : 0;

  const savingsAmount = selectedProduct.originalPrice - selectedProduct.price;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span>{selectedProduct.category}</span>
            <span aria-hidden="true">·</span>
            <span>{selectedProduct.brand}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveProduct(selectedProduct.id)}
              aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
              className={`p-2 rounded-full border transition-colors ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setSelectedProduct(null)}
              aria-label="Close modal"
              className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two Column Contiguous Layout */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Gallery & Material Attributes */}
          <div className="md:col-span-6 space-y-4">
            {/* Main Featured Image */}
            <div className="aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                alt={selectedProduct.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail switcher if multiple images */}
            {selectedProduct.images.length > 1 && (
              <div className="flex gap-2">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? 'border-amber-800 scale-102' : 'border-stone-200 opacity-70'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Condition Grade Card */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-900">Condition Grade</span>
                <span className="font-medium text-amber-900 font-mono">{selectedProduct.condition}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {selectedProduct.conditionDetails}
              </p>
            </div>

            {/* Ecological / Circular Impact Card */}
            <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Eco-Impact & Zero Waste Contribution</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-stone-700">
                <div>
                  <span className="text-stone-400 block">Landfill Diverted:</span>
                  <strong className="font-mono">{selectedProduct.weightKg} kg</strong> art supplies
                </div>
                <div>
                  <span className="text-stone-400 block">Student Cost Saved:</span>
                  <strong className="font-mono text-emerald-800">${savingsAmount} USD</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase & Swap Module */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Product Title */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-stone-900 leading-snug">
                  {selectedProduct.title}
                </h2>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{selectedProduct.location}</span>
                </div>
              </div>

              {/* Price & Savings Block */}
              <div className="p-4 bg-stone-100/70 border border-stone-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                      {selectedProduct.price === 0 ? 'Free (Gift)' : `$${selectedProduct.price}`}
                    </span>
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-sm text-stone-400 line-through font-mono tabular-nums">
                        ${selectedProduct.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-stone-500">
                    Estimated retail replacement: ${selectedProduct.originalPrice}
                  </span>
                </div>

                {discountPercent > 0 && (
                  <div className="text-right">
                    <span className="inline-block text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                      Save {discountPercent}%
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                  Item Description
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Swap Preferences if Open to Swap */}
              {selectedProduct.isAvailableForSwap && (
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>Open to Material Swap / Exchange</span>
                  </div>
                  <p className="text-xs text-stone-700">
                    <strong>Seller's Wishlist: </strong>
                    {selectedProduct.preferredSwaps || 'Open to all fine art materials & studio gear.'}
                  </p>
                </div>
              )}

              {/* Seller Card */}
              {seller && (
                <div className="p-3.5 border border-stone-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={seller.avatar}
                      alt={seller.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-stone-300"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-stone-900">{seller.name}</span>
                        {seller.verified && (
                          <span title="Verified Artist">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stone-500 block truncate max-w-[200px]">
                        {seller.institution}
                      </span>
                      <div className="text-[11px] text-stone-400">
                        {seller.swapsCompleted} swaps completed · {seller.rating} ★
                      </div>
                    </div>
                  </div>

                  {!isOwner && (
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        startOrOpenChatWithSeller(selectedProduct);
                      }}
                      className="p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors flex items-center gap-1.5 text-xs"
                      title="Direct message seller"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Message</span>
                    </button>
                  )}
                </div>
              )}

            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-stone-200 space-y-2.5">
              {isOwner ? (
                <div className="p-3 bg-stone-100 rounded-lg text-center text-xs text-stone-600 font-medium">
                  This is your listed art supply. You can manage or edit it in{' '}
                  <strong className="text-stone-900">My Studio</strong>.
                </div>
              ) : selectedProduct.status !== 'available' ? (
                <div className="p-3 bg-stone-100 rounded-lg text-center text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Item is currently {selectedProduct.status}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProduct.isAvailableForSwap && (
                    <button
                      onClick={() => openSwapModal(selectedProduct)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold tracking-wider uppercase rounded-lg transition-colors shadow-xs"
                    >
                      <ArrowLeftRight className="w-4 h-4 text-amber-400" />
                      <span>Propose a Swap</span>
                    </button>
                  )}

                  <button
                    onClick={() => openBuyModal(selectedProduct)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold tracking-wider uppercase rounded-lg transition-colors shadow-xs ${
                      !selectedProduct.isAvailableForSwap ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {selectedProduct.price === 0 ? 'Claim Free Supply' : `Buy ($${selectedProduct.price})`}
                    </span>
                  </button>
                </div>
              )}

              {/* Safety reassurance note */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 pt-1">
                <Shield className="w-3.5 h-3.5 text-stone-400" />
                <span>In-person studio pickup · Cash on handover · Zero platform commission</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
