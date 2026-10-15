import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_CONVERSATIONS,
  INITIAL_DISPUTES,
  INITIAL_MESSAGES,
  INITIAL_PRODUCTS,
  INITIAL_SWAP_OFFERS,
  INITIAL_USERS,
} from './src/data/mockData';
import {
  ArtProduct,
  ChatConversation,
  ChatMessage,
  DisputeRecord,
  SwapOffer,
  SwapStatus,
  UserProfile,
} from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Persistent Store on Server
let users: UserProfile[] = [...INITIAL_USERS];
let products: ArtProduct[] = [...INITIAL_PRODUCTS];
let swapOffers: SwapOffer[] = [...INITIAL_SWAP_OFFERS];
let conversations: ChatConversation[] = [...INITIAL_CONVERSATIONS];
let messages: Record<string, ChatMessage[]> = JSON.parse(JSON.stringify(INITIAL_MESSAGES));
let disputes: DisputeRecord[] = [...INITIAL_DISPUTES];
let transactions: Array<{
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  pickupLocation: string;
  paymentMethod: string;
  createdAt: string;
}> = [];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Request logger for API calls
  app.use('/api', (req, res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'AtelierCycle Marketplace Backend',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Platform Aggregate Stats
  app.get('/api/stats', (req: Request, res: Response) => {
    const totalWeightKg = products.reduce((sum, p) => sum + (p.weightKg || 0), 0);
    const totalSavedUsd = users.reduce((sum, u) => sum + (u.moneySavedUsd || 0), 0);
    const completedSwapsCount = swapOffers.filter((s) => s.status === 'completed').length;

    res.json({
      totalListings: products.length,
      availableListings: products.filter((p) => p.status === 'available').length,
      completedSwaps: completedSwapsCount,
      activeSwappers: users.length,
      totalWasteDivertedKg: Math.round(totalWeightKg * 10) / 10,
      totalStudentSavingsUsd: totalSavedUsd,
      pendingDisputes: disputes.filter((d) => d.status === 'under_investigation').length,
    });
  });

  // -------------------------------------------------------------
  // USERS API
  // -------------------------------------------------------------
  app.get('/api/users', (req: Request, res: Response) => {
    res.json(users);
  });

  app.get('/api/users/:id', (req: Request, res: Response) => {
    const user = users.find((u) => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });

  app.put('/api/users/:id', (req: Request, res: Response) => {
    const idx = users.findIndex((u) => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    users[idx] = { ...users[idx], ...req.body, id: req.params.id };
    res.json(users[idx]);
  });

  // -------------------------------------------------------------
  // PRODUCTS API
  // -------------------------------------------------------------
  app.get('/api/products', (req: Request, res: Response) => {
    let result = [...products];
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

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const newProduct: ArtProduct = {
      ...req.body,
      id: req.body.id || `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'available',
      moderationStatus: 'approved',
    };
    products.unshift(newProduct);
    res.status(201).json(newProduct);
  });

  app.patch('/api/products/:id/status', (req: Request, res: Response) => {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    product.status = req.body.status;
    res.json(product);
  });

  app.patch('/api/products/:id/moderate', (req: Request, res: Response) => {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    product.moderationStatus = req.body.moderationStatus;
    res.json(product);
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const idx = products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    const deleted = products.splice(idx, 1)[0];
    res.json({ success: true, deletedProduct: deleted });
  });

  // -------------------------------------------------------------
  // SWAP OFFERS API
  // -------------------------------------------------------------
  app.get('/api/swaps', (req: Request, res: Response) => {
    const { userId } = req.query;
    if (userId && typeof userId === 'string') {
      const filtered = swapOffers.filter(
        (s) => s.ownerId === userId || s.proposerId === userId
      );
      return res.json(filtered);
    }
    res.json(swapOffers);
  });

  app.post('/api/swaps', (req: Request, res: Response) => {
    const newOffer: SwapOffer = {
      ...req.body,
      id: req.body.id || `swap-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    swapOffers.unshift(newOffer);
    res.status(201).json(newOffer);
  });

  app.patch('/api/swaps/:id/status', (req: Request, res: Response) => {
    const offer = swapOffers.find((s) => s.id === req.params.id);
    if (!offer) return res.status(404).json({ error: 'Swap offer not found' });

    const newStatus: SwapStatus = req.body.status;
    offer.status = newStatus;
    offer.updatedAt = new Date().toISOString();

    if (newStatus === 'accepted') {
      const reqProd = products.find((p) => p.id === offer.requestedProductId);
      if (reqProd) reqProd.status = 'reserved';
    } else if (newStatus === 'completed') {
      const reqProd = products.find((p) => p.id === offer.requestedProductId);
      if (reqProd) reqProd.status = 'swapped';
      if (offer.offeredProductId) {
        const offProd = products.find((p) => p.id === offer.offeredProductId);
        if (offProd) offProd.status = 'swapped';
      }
      // Credit users with impact
      users = users.map((u) => {
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

  // -------------------------------------------------------------
  // CONVERSATIONS & CHAT API
  // -------------------------------------------------------------
  app.get('/api/conversations', (req: Request, res: Response) => {
    const { userId } = req.query;
    if (userId && typeof userId === 'string') {
      const filtered = conversations.filter((c) => c.participantIds.includes(userId));
      return res.json(filtered);
    }
    res.json(conversations);
  });

  app.post('/api/conversations', (req: Request, res: Response) => {
    const { productId, participantIds } = req.body;
    let existing = conversations.find(
      (c) =>
        c.productId === productId &&
        participantIds.every((pid: string) => c.participantIds.includes(pid))
    );

    if (existing) {
      return res.json(existing);
    }

    const newConv: ChatConversation = {
      ...req.body,
      id: req.body.id || `conv-${Date.now()}`,
      unreadCount: 0,
    };
    conversations.unshift(newConv);
    if (!messages[newConv.id]) {
      messages[newConv.id] = [];
    }
    res.status(201).json(newConv);
  });

  app.get('/api/conversations/:id/messages', (req: Request, res: Response) => {
    const convMessages = messages[req.params.id] || [];
    res.json(convMessages);
  });

  app.post('/api/conversations/:id/messages', (req: Request, res: Response) => {
    const convId = req.params.id;
    if (!messages[convId]) {
      messages[convId] = [];
    }

    const newMsg: ChatMessage = {
      ...req.body,
      id: req.body.id || `msg-${Date.now()}`,
      conversationId: convId,
      timestamp: 'Just now',
    };

    messages[convId].push(newMsg);

    // Update last message in conversation
    const conv = conversations.find((c) => c.id === convId);
    if (conv) {
      conv.lastMessage = newMsg.text;
      conv.lastTimestamp = 'Just now';
    }

    res.status(201).json(newMsg);
  });

  // -------------------------------------------------------------
  // DISPUTES API
  // -------------------------------------------------------------
  app.get('/api/disputes', (req: Request, res: Response) => {
    res.json(disputes);
  });

  app.post('/api/disputes', (req: Request, res: Response) => {
    const newDispute: DisputeRecord = {
      ...req.body,
      id: `disp-${Date.now()}`,
      status: 'under_investigation',
      createdAt: new Date().toISOString(),
    };
    disputes.unshift(newDispute);
    res.status(201).json(newDispute);
  });

  app.patch('/api/disputes/:id/resolve', (req: Request, res: Response) => {
    const dispute = disputes.find((d) => d.id === req.params.id);
    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
    dispute.status = 'resolved';
    dispute.resolutionNote = req.body.resolutionNote || 'Resolved by safety moderator';
    res.json(dispute);
  });

  app.patch('/api/disputes/:id/dismiss', (req: Request, res: Response) => {
    const dispute = disputes.find((d) => d.id === req.params.id);
    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
    dispute.status = 'dismissed';
    dispute.resolutionNote = 'Dismissed by safety moderator';
    res.json(dispute);
  });

  // -------------------------------------------------------------
  // TRANSACTIONS API
  // -------------------------------------------------------------
  app.get('/api/transactions', (req: Request, res: Response) => {
    const { buyerId, sellerId } = req.query;
    let list = [...transactions];
    if (buyerId) list = list.filter((t) => t.buyerId === buyerId);
    if (sellerId) list = list.filter((t) => t.sellerId === sellerId);
    res.json(list);
  });

  app.post('/api/transactions', (req: Request, res: Response) => {
    const newTxn = {
      ...req.body,
      id: req.body.id || `txn-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    transactions.unshift(newTxn);

    // Mark product as sold
    const prod = products.find((p) => p.id === newTxn.productId);
    if (prod) prod.status = 'sold';

    // Update buyer savings
    if (prod) {
      users = users.map((u) => {
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

  // -------------------------------------------------------------
  // FRONTEND INTEGRATION: Vite middlewares in dev, static in prod
  // -------------------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AtelierCycle Server] Full-stack backend active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
