import express, { Request, Response } from 'express';
import { apiRouter } from '../backend/routes';

const app = express();

app.use(express.json({ limit: '10mb' }));

// CORS headers for cross-origin Vercel deployments
app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Mount routes for both /api/* and root
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
