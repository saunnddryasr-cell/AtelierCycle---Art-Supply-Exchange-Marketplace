import React, { useState } from 'react';
import {
  ArrowLeftRight,
  CheckCircle,
  Clock,
  Heart,
  Leaf,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ArtProduct } from '../types';
import { ProductCard } from './ProductCard';

export const UserDashboard: React.FC = () => {
  const {
    currentUser,
    products,
    updateProductStatus,
    deleteProduct,
    transactions,
    savedProductIds,
    swapOffers,
    openCreateListing,
    openUserSwitch,
    setSelectedProduct,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'orders' | 'saved' | 'swaps'>('listings');

  // Filter items owned by current user
  const myListings = products.filter((p) => p.sellerId === currentUser.id);
  const myOrders = transactions.filter((t) => t.buyerId === currentUser.id);
  const mySaved = products.filter((p) => savedProductIds.includes(p.id));
  const myCompletedSwaps = swapOffers.filter(
    (s) => (s.ownerId === currentUser.id || s.proposerId === currentUser.id) && s.status === 'completed'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* User Studio Profile Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-stone-200 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  {currentUser.name}
                </h1>
                {currentUser.verified && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <UserCheck className="w-3 h-3" />
                    Verified Artist
                  </span>
                )}
              </div>
              
              <div className="text-xs sm:text-sm text-stone-600 mt-1">
                {currentUser.institution} · <span className="text-stone-400">{currentUser.location}</span>
              </div>
              
              <p className="text-xs text-stone-500 mt-2 max-w-xl leading-relaxed">
                {currentUser.bio}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
            <button
              onClick={openUserSwitch}
              className="px-3.5 py-1.5 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md border border-stone-300 font-medium transition-colors"
            >
              Switch Demo Profile
            </button>
            <button
              onClick={openCreateListing}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-amber-800 hover:bg-amber-700 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List Material</span>
            </button>
          </div>

        </div>

        {/* Studio Sustainability & Community Impact Strip */}
        <div className="mt-8 pt-6 border-t border-stone-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-stone-500 text-xs block">Active Listings</span>
            <span className="text-xl font-bold font-mono text-stone-900 tabular-nums">
              {myListings.length}
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-stone-500 text-xs block">Completed Swaps</span>
            <span className="text-xl font-bold font-mono text-amber-800 tabular-nums">
              {currentUser.swapsCompleted}
            </span>
          </div>

          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <span className="text-emerald-800 text-xs block font-medium flex items-center gap-1 justify-center sm:justify-start">
              <Leaf className="w-3 h-3 text-emerald-600" />
              Waste Diverted
            </span>
            <span className="text-xl font-bold font-mono text-emerald-900 tabular-nums">
              {currentUser.itemsDivertedKg} kg
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-stone-500 text-xs block">Estimated Savings</span>
            <span className="text-xl font-bold font-mono text-stone-900 tabular-nums">
              ${currentUser.moneySavedUsd}
            </span>
          </div>
        </div>

      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 px-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'listings'
              ? 'border-amber-800 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          My Listed Supplies ({myListings.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'orders'
              ? 'border-amber-800 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Purchase Orders ({myOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('swaps')}
          className={`pb-3 px-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'swaps'
              ? 'border-amber-800 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Exchange History ({myCompletedSwaps.length})
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 px-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'saved'
              ? 'border-amber-800 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Saved Wishlist ({mySaved.length})
        </button>
      </div>

      {/* Tab Content Panels */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {myListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between"
                >
                  <div className="relative aspect-16/10 bg-stone-100">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-stone-900/80 text-white text-[10px] uppercase font-bold tracking-wider rounded">
                      {item.status}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-xs text-stone-500 font-mono">
                        {item.category} · {item.condition}
                      </div>
                      <h3 className="font-semibold text-stone-900 text-sm mt-1 line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="text-xs font-mono font-bold text-stone-900 mt-1">
                        ${item.price} {item.isAvailableForSwap && '· Open to Swap'}
                      </div>
                    </div>

                    {/* Manage actions */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <select
                        aria-label="Change supply status"
                        value={item.status}
                        onChange={(e) =>
                          updateProductStatus(item.id, e.target.value as ArtProduct['status'])
                        }
                        className="text-xs bg-stone-100 border border-stone-200 rounded px-2 py-1 text-stone-700 focus:outline-none"
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="swapped">Swapped</option>
                        <option value="sold">Sold</option>
                      </select>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedProduct(item)}
                          className="px-2 py-1 text-xs text-stone-700 hover:text-stone-900 border border-stone-200 rounded"
                        >
                          View
                        </button>
                        <button
                          onClick={() => deleteProduct(item.id)}
                          className="p-1 text-stone-400 hover:text-red-700 rounded transition-colors"
                          title="Delete listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-xl p-8 text-center max-w-sm mx-auto">
              <Package className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-stone-900">No active listings</h3>
              <p className="text-xs text-stone-500 mt-1">
                Share excess tubes of paint, sketchbooks, or tools with fellow student artists.
              </p>
              <button
                onClick={openCreateListing}
                className="mt-4 px-4 py-2 bg-amber-800 text-white text-xs font-semibold rounded-md hover:bg-amber-700"
              >
                List Supplies Now
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-3">
          {myOrders.length > 0 ? (
            myOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={order.productImage}
                    alt={order.productTitle}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900">{order.productTitle}</h3>
                    <div className="text-xs text-stone-500 mt-0.5">
                      Seller: <strong>{order.sellerName}</strong> · Pickup: {order.pickupLocation}
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                      Ordered on {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="text-right self-end sm:self-auto">
                  <span className="text-sm font-bold font-mono text-stone-900 block">
                    {order.price === 0 ? 'Free Cycle' : `$${order.price}`}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Pickup Confirmed
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-stone-200 rounded-xl p-8 text-center max-w-sm mx-auto">
              <ShoppingBag className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-stone-900">No purchase orders yet</h3>
              <p className="text-xs text-stone-500 mt-1">
                Browse our marketplace for affordable second-hand fine art materials.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'swaps' && (
        <div className="space-y-3">
          {myCompletedSwaps.length > 0 ? (
            myCompletedSwaps.map((swap) => (
              <div
                key={swap.id}
                className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">
                      Exchanged "{swap.requestedProductTitle}"
                    </h4>
                    <div className="text-xs text-stone-500 mt-0.5">
                      Traded with <strong>{swap.proposerName}</strong> for "{swap.offeredProductTitle}"
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-stone-600 block">Handover Completed</span>
                  <span className="text-[11px] text-emerald-700 font-medium">+1.8 kg Saved</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-stone-200 rounded-xl p-8 text-center max-w-sm mx-auto">
              <ArrowLeftRight className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-stone-900">No completed swaps yet</h3>
              <p className="text-xs text-stone-500 mt-1">
                Visit the Swap Hub to propose or accept material exchanges with other creators.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div>
          {mySaved.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mySaved.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-xl p-8 text-center max-w-sm mx-auto">
              <Heart className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-stone-900">No saved supplies</h3>
              <p className="text-xs text-stone-500 mt-1">
                Click the heart icon on any product card in the marketplace to bookmark it here.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
