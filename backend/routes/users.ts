import { Request, Response, Router } from 'express';
import { db } from '../data/store';

export const usersRouter = Router();

// GET all users
usersRouter.get('/', (req: Request, res: Response) => {
  res.json(db.users);
});

// GET user by ID
usersRouter.get('/:id', (req: Request, res: Response) => {
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// PUT update user profile
usersRouter.put('/:id', (req: Request, res: Response) => {
  const idx = db.users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  db.users[idx] = { ...db.users[idx], ...req.body, id: req.params.id };
  res.json(db.users[idx]);
});
