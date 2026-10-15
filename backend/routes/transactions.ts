import { Request, Response, Router } from 'express';
import { db } from '../data/store';

export const transactionsRouter = Router();

// GET all transactions
transactionsRouter.get('/', (req: Request, res: Response) => {
  const { buyerId, sellerId } = req.query;
  let list = [...db.transactions];
  if (buyerId) list = list.filter((t) => t.buyerId === buyerId);
  if (sellerId) list = list.filter((t) => t.sellerId === sellerId);
  res.json(list);
});

// POST new transaction
transactionsRouter.post('/', (req: Request, res: Response) => {
  const newTxn = {
    ...req.body,
    id: req.body.id || `txn-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.transactions.unshift(newTxn);

  // Mark product as sold
  const prod = db.products.find((p) => p.id === newTxn.productId);
  if (prod) prod.status = 'sold';

  // Update buyer savings
  if (prod) {
    db.users = db.users.map((u) => {
      if (u.id === newTxn.buyerId) {
        return {
          ...u,
          moneySavedUsd: u.moneySavedUsd + (prod.originalPrice - prod.price),
          itemsDivertedKg: Math.round((u.itemsDivertedKg + (prod.weightKg || 0.5)) * 10) / 10,
        };
      }
      return u;
    });
  }

  res.status(201).json(newTxn);
});
