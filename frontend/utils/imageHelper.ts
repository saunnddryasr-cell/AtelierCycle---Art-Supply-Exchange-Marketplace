import heroImg from '../assets/images/hero_art_materials_studio_1791822503385.jpg';
import oilPaintImg from '../assets/images/art_oil_paint_set_1791822520887.jpg';
import sableBrushImg from '../assets/images/art_sable_brush_bundle_1791822539044.jpg';
import canvasEaselImg from '../assets/images/art_stretched_canvas_easel_1791822554143.jpg';

export const LOCAL_IMAGES = {
  hero: heroImg,
  oilPaint: oilPaintImg,
  sableBrush: sableBrushImg,
  canvasEasel: canvasEaselImg,
};

export const FALLBACK_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
  oilPaint: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  sableBrush: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
  canvasEasel: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  gouache: 'https://images.unsplash.com/photo-1572945753563-804956783604?auto=format&fit=crop&w=800&q=80',
  watercolor: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&w=800&q=80',
  sculpture: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  printmaking: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=800&q=80',
};

export function resolveArtImage(url?: string, category?: string): string {
  if (!url) return getFallbackForCategory(category);

  // If already full HTTP URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Map local asset paths directly to Vite's hashed bundled assets
  if (url.includes('hero_art_materials_studio')) return heroImg;
  if (url.includes('art_oil_paint_set')) return oilPaintImg;
  if (url.includes('art_sable_brush_bundle')) return sableBrushImg;
  if (url.includes('art_stretched_canvas_easel')) return canvasEaselImg;

  return url;
}

export function getFallbackForCategory(category?: string): string {
  switch (category) {
    case 'Watercolors & Gouache':
      return FALLBACK_IMAGES.gouache;
    case 'Oils & Acrylics':
      return FALLBACK_IMAGES.oilPaint;
    case 'Brushes & Tools':
      return FALLBACK_IMAGES.sableBrush;
    case 'Canvas & Surfaces':
      return FALLBACK_IMAGES.canvasEasel;
    case 'Sculpture & Ceramics':
      return FALLBACK_IMAGES.sculpture;
    case 'Printmaking & Ink':
      return FALLBACK_IMAGES.printmaking;
    default:
      return FALLBACK_IMAGES.hero;
  }
}
