import React, { useState } from 'react';
import { ArrowLeftRight, Heart, MapPin, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ArtProduct } from '../types';
import { getFallbackForCategory, resolveArtImage } from '../utils/imageHelper';

interface ProductCardProps {
  product: ArtProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, openSwapModal, toggleSaveProduct, savedProductIds, users } = useApp();
  const [imgSrc, setImgSrc] = useState(() => resolveArtImage(product.images[0], product.category));
  const [hasError, setHasError] = useState(false);

  const isSaved = savedProductIds.includes(product.id);
  const seller = users.find((u) => u.id === product.sellerId);

  // Calculate percentage discount
  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleCardClick = () => {
    setSelectedProduct(product);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group flex flex-col bg-white border border-stone-200/90 rounded-lg overflow-hidden hover:border-stone-400/80 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
    >
      {/* Visual Slot: Product Image */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        {!hasError ? (
          <img
            src={imgSrc}
            alt={product.title}
            onError={() => {
              const fallback = getFallbackForCategory(product.category);
              if (imgSrc !== fallback) {
                setImgSrc(fallback);
              } else {
                setHasError(true);
              }
            }}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          /* Zero-Broken-Image Fallback Container */
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 p-6 text-center">
            <Tag className="w-8 h-8 text-stone-400 mb-2" />
            <span className="text-xs font-serif text-stone-500 italic">{product.category}</span>
          </div>
        )}

        {/* Favorite Save Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveProduct(product.id);
          }}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
            isSaved
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/85 text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Status Overlay if Reserved or Sold */}
        {product.status !== 'available' && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 bg-white text-stone-900 font-semibold text-xs uppercase tracking-wider rounded-sm">
              {product.status === 'reserved' ? 'Reserved for Swap' : product.status}
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line with typographic separators (NO PILLS) */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5 font-medium truncate">
            <span>{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.condition}</span>
            {discountPercent > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-semibold">Save {discountPercent}%</span>
              </>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-stone-900 line-clamp-2 leading-snug group-hover:text-amber-950 transition-colors">
            {product.title}
          </h3>

          {/* Location & Seller info */}
          <div className="mt-2 flex items-center gap-1 text-xs text-stone-500">
            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="truncate">{product.location}</span>
          </div>
        </div>

        {/* Price & Action row */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
                {product.price === 0 ? 'Free (Gift)' : `$${product.price}`}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[11px] text-stone-500">
              {product.isAvailableForSwap ? 'Swap or Buy' : 'Direct Buy'}
            </span>
          </div>

          {/* Quick Swap CTA if available */}
          {product.isAvailableForSwap && product.status === 'available' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openSwapModal(product);
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded transition-colors whitespace-nowrap"
            >
              <ArrowLeftRight className="w-3 h-3 text-amber-800" />
              <span>Offer Swap</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
