import React from 'react';
import { ArrowLeftRight, Filter, RotateCcw, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FilterState, ProductCategory } from '../types';
import { InstitutionalBanner } from './InstitutionalBanner';
import { ProductCard } from './ProductCard';

const CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'Oils & Acrylics',
  'Watercolors & Gouache',
  'Brushes & Tools',
  'Canvases & Surfaces',
  'Sketchbooks & Paper',
  'Printmaking & Inks',
  'Sculpture & Pottery',
  'Easels & Studio Gear',
];

const LOCATIONS = [
  'All',
  'Ahmedabad - Paldi Campus',
  'New Delhi - Mandi House',
  'Bengaluru - Indiranagar',
  'Mumbai - Bandra West',
];

const CONDITIONS = [
  'All',
  'Brand New',
  'Like New',
  'Gently Used',
  'Half Used',
  'Surplus / Studio Lot',
];

export const Marketplace: React.FC = () => {
  const { products, filterState, setFilterState, openCreateListing } = useApp();

  // Apply filters & search & sorting
  const filteredProducts = products.filter((item) => {
    // Only show approved items in public catalog
    if (item.moderationStatus === 'flagged') return false;

    // Search query
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchBrand = item.brand.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchBrand && !matchDesc && !matchTag) return false;
    }

    // Category
    if (filterState.category !== 'All' && item.category !== filterState.category) {
      return false;
    }

    // Location
    if (filterState.location !== 'All' && item.location !== filterState.location) {
      return false;
    }

    // Condition
    if (filterState.condition !== 'All' && item.condition !== filterState.condition) {
      return false;
    }

    // Swap only
    if (filterState.swapOnly && !item.isAvailableForSwap) {
      return false;
    }

    // Max Price
    if (item.price > filterState.maxPrice) {
      return false;
    }

    return true;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filterState.sortBy === 'price_asc') return a.price - b.price;
    if (filterState.sortBy === 'price_desc') return b.price - a.price;
    if (filterState.sortBy === 'discount') {
      const discA = ((a.originalPrice - a.price) / a.originalPrice) || 0;
      const discB = ((b.originalPrice - b.price) / b.originalPrice) || 0;
      return discB - discA;
    }
    // Newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleResetFilters = () => {
    setFilterState({
      searchQuery: '',
      category: 'All',
      condition: 'All',
      maxPrice: 150,
      swapOnly: false,
      location: 'All',
      sortBy: 'newest',
    });
  };

  return (
    <div className="space-y-8 pb-16">
      <InstitutionalBanner />

      {/* Storefront Hero: 1 disciplined editorial campaign anchor */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-stone-100 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch shadow-md">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
            <div>
              {/* Quiet kicker */}
              <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Circular Art Supply Exchange</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-100 tracking-tight leading-tight [text-wrap:balance]">
                Pass on what you don't use. Acquire what you need.
              </h1>

              <p className="mt-4 text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Art supplies should never sit dormant in storage boxes. Connect with fine art students, academy fellows, and makers to buy second-hand pigments, trade studio gear, and build a zero-waste creative community.
              </p>
            </div>

            {/* Quick Action row */}
            <div className="mt-8 pt-6 border-t border-stone-800 flex flex-wrap items-center gap-4">
              <button
                onClick={openCreateListing}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs tracking-wider uppercase rounded-md transition-colors shadow-xs"
              >
                List Your Unused Supplies
              </button>
              
              <button
                onClick={() => setFilterState((prev) => ({ ...prev, swapOnly: true }))}
                className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-medium text-xs rounded-md transition-colors flex items-center gap-2"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
                <span>Browse Supplies Open to Swap</span>
              </button>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full">
            <img
              src="/frontend/assets/images/hero_art_materials_studio_1791822503385.jpg"
              alt="Authentic artist studio workbench with paints and brushes"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-stone-900/50 lg:to-transparent" />
          </div>

        </div>

        {/* 4-Column Proof & Impact Metrics Strip */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white border border-stone-200 rounded-xl">
          <div className="border-r border-stone-100 last:border-0 pr-3">
            <span className="block text-2xl font-bold font-mono text-stone-900 tabular-nums">1,480+</span>
            <span className="text-xs text-stone-500">Materials Circulated</span>
          </div>
          <div className="border-r border-stone-100 last:border-0 pr-3">
            <span className="block text-2xl font-bold font-mono text-emerald-800 tabular-nums">58% - 75%</span>
            <span className="text-xs text-stone-500">Average Student Savings</span>
          </div>
          <div className="border-r border-stone-100 last:border-0 pr-3">
            <span className="block text-2xl font-bold font-mono text-amber-800 tabular-nums">3.4 Tons</span>
            <span className="text-xs text-stone-500">Studio Waste Diverted</span>
          </div>
          <div>
            <span className="block text-2xl font-bold font-mono text-stone-900 tabular-nums">380+</span>
            <span className="text-xs text-stone-500">Verified Artist Swaps</span>
          </div>
        </div>
      </section>

      {/* Main Catalog Viewport */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Search, Location & Control Bar */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search art supplies, brands (Winsor & Newton, Sennelier, Arches), mediums..."
                value={filterState.searchQuery}
                onChange={(e) => setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 transition-colors"
              />
              {filterState.searchQuery && (
                <button
                  onClick={() => setFilterState((prev) => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Location selector */}
            <div className="md:col-span-3">
              <select
                aria-label="Filter by Campus / City Location"
                value={filterState.location}
                onChange={(e) => setFilterState((prev) => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-700"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === 'All' ? 'All Campuses / Locations' : loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort order selector */}
            <div className="md:col-span-3">
              <select
                aria-label="Sort product listings"
                value={filterState.sortBy}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    sortBy: e.target.value as FilterState['sortBy'],
                  }))
                }
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-700"
              >
                <option value="newest">Sort: Newly Listed First</option>
                <option value="price_asc">Sort: Price (Low to High)</option>
                <option value="price_desc">Sort: Price (High to Low)</option>
                <option value="discount">Sort: Highest % Savings</option>
              </select>
            </div>

          </div>

          {/* Category Tabs: Interactive segmented buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = filterState.category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterState((prev) => ({ ...prev, category: cat }))}
                  className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-stone-900 text-stone-50'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sub-Filters: Condition, Swap toggle, Price Range */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600">
            <div className="flex flex-wrap items-center gap-4">
              
              {/* Swap-only toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filterState.swapOnly}
                  onChange={(e) => setFilterState((prev) => ({ ...prev, swapOnly: e.target.checked }))}
                  className="rounded text-amber-700 focus:ring-amber-700 w-4 h-4 border-stone-300"
                />
                <span className="font-medium text-stone-800">Only Open to Swaps</span>
              </label>

              {/* Condition picker */}
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400">Condition:</span>
                <select
                  aria-label="Filter by material condition"
                  value={filterState.condition}
                  onChange={(e) => setFilterState((prev) => ({ ...prev, condition: e.target.value }))}
                  className="bg-stone-100 border border-stone-200 rounded px-2 py-1 text-xs text-stone-800 focus:outline-none"
                >
                  {CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price filter label */}
              <div className="flex items-center gap-2">
                <span className="text-stone-400">Max Price:</span>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={filterState.maxPrice}
                  onChange={(e) => setFilterState((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                  className="w-24 accent-amber-800"
                />
                <span className="font-mono text-stone-800 font-semibold tabular-nums">
                  ${filterState.maxPrice}
                </span>
              </div>

            </div>

            {/* Result count & reset */}
            <div className="flex items-center gap-3">
              <span className="text-stone-500">
                Showing <strong className="text-stone-900 font-mono tabular-nums">{sortedProducts.length}</strong> supplies
              </span>
              {(filterState.searchQuery ||
                filterState.category !== 'All' ||
                filterState.location !== 'All' ||
                filterState.condition !== 'All' ||
                filterState.swapOnly ||
                filterState.maxPrice < 150) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-amber-800 hover:text-amber-900 font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
            <Filter className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-stone-900">No art supplies match your criteria</h3>
            <p className="mt-2 text-sm text-stone-500 leading-relaxed">
              Try adjusting your search terms, changing the campus location, or increasing the maximum price.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-stone-900 text-stone-100 text-xs font-medium rounded-md hover:bg-stone-800 transition-colors"
              >
                Clear All Filters
              </button>
              <button
                onClick={openCreateListing}
                className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-medium rounded-md hover:bg-stone-50 transition-colors"
              >
                List What You're Looking For
              </button>
            </div>
          </div>
        )}

      </section>
    </div>
  );
};
