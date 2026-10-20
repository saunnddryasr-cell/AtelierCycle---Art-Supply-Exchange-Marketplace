import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { Request, Response } from 'express';
import { apiRouter } from '../backend/routes';

const app = express();

app.use(express.json({ limit: '10mb' }));

// Permissive CORS headers for cross-origin Vercel deployments
app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Support both /api/* and root mount
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Standard Vercel Serverless Function handler
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
