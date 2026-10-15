import { Request, Response, Router } from 'express';
import { db } from '../data/store';
import { ArtProduct } from '../types';

export const productsRouter = Router();

// GET all products with filtering & sorting
productsRouter.get('/', (req: Request, res: Response) => {
  let result = [...db.products];
  const { category, condition, location, swapOnly, maxPrice, q, sort } = req.query;

  if (category && category !== 'All') {
    result = result.filter((p) => p.category === category);
  }
  if (condition && condition !== 'All') {
    result = result.filter((p) => p.condition === condition);
  }
  if (location && location !== 'All') {
    result = result.filter((p) => p.location === location);
  }
  if (swapOnly === 'true') {
    result = result.filter((p) => p.isAvailableForSwap);
  }
  if (maxPrice) {
    result = result.filter((p) => p.price <= Number(maxPrice));
  }
  if (q && typeof q === 'string' && q.trim()) {
    const query = q.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  if (sort === 'price_asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'discount') {
    result.sort((a, b) => {
      const discA = (a.originalPrice - a.price) / (a.originalPrice || 1);
      const discB = (b.originalPrice - b.price) / (b.originalPrice || 1);
      return discB - discA;
    });
  } else {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json(result);
});

// GET product by ID
productsRouter.get('/:id', (req: Request, res: Response) => {
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST new product
productsRouter.post('/', (req: Request, res: Response) => {
  const newProduct: ArtProduct = {
    ...req.body,
    id: req.body.id || `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'available',
    moderationStatus: 'approved',
  };
  db.products.unshift(newProduct);
  res.status(201).json(newProduct);
});

// PATCH status
productsRouter.patch('/:id/status', (req: Request, res: Response) => {
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  product.status = req.body.status;
  res.json(product);
});

// PATCH moderation
productsRouter.patch('/:id/moderate', (req: Request, res: Response) => {
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  product.moderationStatus = req.body.moderationStatus;
  res.json(product);
});

// DELETE product
productsRouter.delete('/:id', (req: Request, res: Response) => {
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  const deleted = db.products.splice(idx, 1)[0];
  res.json({ success: true, deletedProduct: deleted });
});
