import { Request, Response, Router } from 'express';
import { db } from '../data/store';

export const statsRouter = Router();

// GET platform stats
statsRouter.get('/', (req: Request, res: Response) => {
  res.json(db.getStats());
});
