import { Request, Response, Router } from 'express';
import { db } from '../data/store';
import { DisputeRecord } from '../types';

export const disputesRouter = Router();

// GET all disputes
disputesRouter.get('/', (req: Request, res: Response) => {
  res.json(db.disputes);
});

// POST new dispute
disputesRouter.post('/', (req: Request, res: Response) => {
  const newDispute: DisputeRecord = {
    ...req.body,
    id: `disp-${Date.now()}`,
    status: 'under_investigation',
    createdAt: new Date().toISOString(),
  };
  db.disputes.unshift(newDispute);
  res.status(201).json(newDispute);
});

// PATCH resolve dispute
disputesRouter.patch('/:id/resolve', (req: Request, res: Response) => {
  const dispute = db.disputes.find((d) => d.id === req.params.id);
  if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
  dispute.status = 'resolved';
  dispute.resolutionNote = req.body.resolutionNote || 'Resolved by safety moderator';
  res.json(dispute);
});

// PATCH dismiss dispute
disputesRouter.patch('/:id/dismiss', (req: Request, res: Response) => {
  const dispute = db.disputes.find((d) => d.id === req.params.id);
  if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
  dispute.status = 'dismissed';
  dispute.resolutionNote = 'Dismissed by safety moderator';
  res.json(dispute);
});
