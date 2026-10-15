import { Request, Response, Router } from 'express';
import { conversationsRouter } from './conversations';
import { disputesRouter } from './disputes';
import { productsRouter } from './products';
import { statsRouter } from './stats';
import { swapsRouter } from './swaps';
import { transactionsRouter } from './transactions';
import { usersRouter } from './users';

export const apiRouter = Router();

// Health check
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'AtelierCycle Marketplace Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount module routers
apiRouter.use('/stats', statsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/swaps', swapsRouter);
apiRouter.use('/conversations', conversationsRouter);
apiRouter.use('/disputes', disputesRouter);
apiRouter.use('/transactions', transactionsRouter);
