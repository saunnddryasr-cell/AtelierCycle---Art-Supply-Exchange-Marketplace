import { Request, Response, Router } from 'express';
import { db } from '../data/store';
import { SwapOffer, SwapStatus } from '../types';

export const swapsRouter = Router();

// GET swaps
swapsRouter.get('/', (req: Request, res: Response) => {
  const { userId } = req.query;
  if (userId && typeof userId === 'string') {
    const filtered = db.swapOffers.filter(
      (s) => s.ownerId === userId || s.proposerId === userId
    );
    return res.json(filtered);
  }
  res.json(db.swapOffers);
});

// POST new swap offer
swapsRouter.post('/', (req: Request, res: Response) => {
  const newOffer: SwapOffer = {
    ...req.body,
    id: req.body.id || `swap-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.swapOffers.unshift(newOffer);
  res.status(201).json(newOffer);
});

// PATCH swap status
swapsRouter.patch('/:id/status', (req: Request, res: Response) => {
  const offer = db.swapOffers.find((s) => s.id === req.params.id);
  if (!offer) return res.status(404).json({ error: 'Swap offer not found' });

  const newStatus: SwapStatus = req.body.status;
  offer.status = newStatus;
  offer.updatedAt = new Date().toISOString();

  if (newStatus === 'accepted') {
    const reqProd = db.products.find((p) => p.id === offer.requestedProductId);
    if (reqProd) reqProd.status = 'reserved';
  } else if (newStatus === 'completed') {
    const reqProd = db.products.find((p) => p.id === offer.requestedProductId);
    if (reqProd) reqProd.status = 'swapped';
    if (offer.offeredProductId) {
      const offProd = db.products.find((p) => p.id === offer.offeredProductId);
      if (offProd) offProd.status = 'swapped';
    }
    // Credit users with impact
    db.users = db.users.map((u) => {
      if (u.id === offer.ownerId || u.id === offer.proposerId) {
        return {
          ...u,
          swapsCompleted: u.swapsCompleted + 1,
          itemsDivertedKg: Math.round((u.itemsDivertedKg + 1.8) * 10) / 10,
          moneySavedUsd: u.moneySavedUsd + offer.requestedProductPrice,
        };
      }
      return u;
    });
  }

  res.json(offer);
});
