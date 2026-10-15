import React, { useState } from 'react';
import { ArrowLeftRight, Image as ImageIcon, Sparkles, Upload, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCategory, ProductCondition } from '../types';

const CATEGORIES: ProductCategory[] = [
  'Oils & Acrylics',
  'Watercolors & Gouache',
  'Brushes & Tools',
  'Canvases & Surfaces',
  'Sketchbooks & Paper',
  'Printmaking & Inks',
  'Sculpture & Pottery',
  'Easels & Studio Gear',
];

const CONDITIONS: ProductCondition[] = [
  'Brand New',
  'Like New',
  'Gently Used',
  'Half Used',
  'Surplus / Studio Lot',
];

const PRESET_STUDIO_IMAGES = [
  {
    name: 'Oil Paint Palette & Tubes',
    url: '/src/assets/images/art_oil_paint_set_1791822520887.jpg',
  },
  {
    name: 'Kolinsky Sable Brushes Roll',
    url: '/src/assets/images/art_sable_brush_bundle_1791822539044.jpg',
  },
  {
    name: 'Belgian Linen & Beech Easel',
    url: '/src/assets/images/art_stretched_canvas_easel_1791822554143.jpg',
  },
  {
    name: 'Studio Workbench Materials',
    url: '/src/assets/images/hero_art_materials_studio_1791822503385.jpg',
  },
];

export const CreateListingModal: React.FC = () => {
  const { isCreateListingOpen, closeCreateListing, createProduct, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Oils & Acrylics');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState<ProductCondition>('Gently Used');
  const [conditionDetails, setConditionDetails] = useState('');
  const [price, setPrice] = useState('20');
  const [originalPrice, setOriginalPrice] = useState('50');
  const [isAvailableForSwap, setIsAvailableForSwap] = useState(true);
  const [preferredSwaps, setPreferredSwaps] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(currentUser.location);
  const [weightKg, setWeightKg] = useState('0.8');
  const [selectedImage, setSelectedImage] = useState(PRESET_STUDIO_IMAGES[0].url);
  const [tagsInput, setTagsInput] = useState('Paints, Fine Art');

  if (!isCreateListingOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !brand.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    createProduct({
      title: title.trim(),
      category,
      brand: brand.trim(),
      condition,
      conditionDetails: conditionDetails.trim() || `${condition} condition, inspected before listing.`,
      price: Math.max(0, Number(price) || 0),
      originalPrice: Math.max(Number(price) || 0, Number(originalPrice) || 0),
      isAvailableForSwap,
      preferredSwaps: preferredSwaps.trim(),
      description: description.trim() || 'Well-preserved studio supplies ready for creative reuse.',
      location: location.trim() || currentUser.location,
      images: [selectedImage],
      sellerId: currentUser.id,
      weightKg: Math.max(0.1, Number(weightKg) || 0.5),
      tags: tags.length > 0 ? tags : ['Art Supplies'],
    });

    closeCreateListing();
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">List an Art Supply</h2>
            <p className="text-xs text-stone-500">
              Pass on unused paints, surfaces, or tools to fellow student artists.
            </p>
          </div>
          <button
            onClick={closeCreateListing}
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {/* Title */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Supply Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Winsor & Newton Professional Artists Oil Paint (37ml Tubes Lot)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
            />
          </div>

          {/* Category & Brand row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-amber-700"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Brand / Manufacturer *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Winsor & Newton, Sennelier, Gamblin, Holbein"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              >
              </input>
            </div>
          </div>

          {/* Condition & Detailed Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Condition Grade *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ProductCondition)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 bg-white focus:outline-none focus:ring-1 focus:ring-amber-700"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Condition Specifics (Transparency)
              </label>
              <input
                type="text"
                placeholder="e.g. 80% remaining, caps clean, stored away from heat"
                value={conditionDetails}
                onChange={(e) => setConditionDetails(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>
          </div>

          {/* Price & Original Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Listing Price ($) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                placeholder="0 for free cycle donation"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
              <span className="text-[11px] text-stone-400 mt-0.5 block">
                Set to 0 for free student gift
              </span>
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Original Retail Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 55"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
              <span className="text-[11px] text-stone-400 mt-0.5 block">
                Shows student savings
              </span>
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Est. Weight (kg)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
              <span className="text-[11px] text-stone-400 mt-0.5 block">
                Calculates waste diverted
              </span>
            </div>
          </div>

          {/* Open to Swap checkbox & Preferred items */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailableForSwap}
                onChange={(e) => setIsAvailableForSwap(e.target.checked)}
                className="rounded text-amber-800 focus:ring-amber-800 w-4 h-4"
              />
              <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-amber-800" />
                Open to Material Swap / Exchange
              </span>
            </label>

            {isAvailableForSwap && (
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  What materials or tools would you like in exchange?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gouache set, linocut tools, cold-press watercolor sheets, or drawing ink"
                  value={preferredSwaps}
                  onChange={(e) => setPreferredSwaps(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>
            )}
          </div>

          {/* Studio Image Picker */}
          <div>
            <label className="block font-semibold text-stone-800 mb-2">
              Product Photography
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {PRESET_STUDIO_IMAGES.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`aspect-4/3 rounded-lg overflow-hidden border-2 relative transition-all ${
                    selectedImage === img.url
                      ? 'border-amber-800 ring-2 ring-amber-800/20'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-stone-900/70 text-stone-100 text-[9px] p-0.5 truncate text-center">
                    {img.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom file upload option */}
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded text-stone-700 text-xs font-medium transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomImageUpload}
                  className="hidden"
                />
              </label>
              <span className="text-stone-400 text-[11px]">Supports JPG, PNG</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Description & Studio Notes
            </label>
            <textarea
              rows={3}
              placeholder="Tell buyers why you're passing this on, its condition, storage history, or how you used it..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
            />
          </div>

          {/* Location & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Handover Location / Campus *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Acrylic, Impasto, Fine Art"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
            </div>
          </div>

          {/* Submit buttons */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeCreateListing}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-800 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors shadow-xs uppercase tracking-wider text-xs"
            >
              Publish Listing
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
