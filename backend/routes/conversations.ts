import { Request, Response, Router } from 'express';
import { db } from '../data/store';
import { ChatConversation, ChatMessage } from '../types';

export const conversationsRouter = Router();

// GET all conversations
conversationsRouter.get('/', (req: Request, res: Response) => {
  const { userId } = req.query;
  if (userId && typeof userId === 'string') {
    const filtered = db.conversations.filter((c) => c.participantIds.includes(userId));
    return res.json(filtered);
  }
  res.json(db.conversations);
});

// POST create or get existing conversation
conversationsRouter.post('/', (req: Request, res: Response) => {
  const { productId, participantIds } = req.body;
  const existing = db.conversations.find(
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
  db.conversations.unshift(newConv);
  if (!db.messages[newConv.id]) {
    db.messages[newConv.id] = [];
  }
  res.status(201).json(newConv);
});

// GET messages for conversation
conversationsRouter.get('/:id/messages', (req: Request, res: Response) => {
  const convMessages = db.messages[req.params.id] || [];
  res.json(convMessages);
});

// POST message to conversation
conversationsRouter.post('/:id/messages', (req: Request, res: Response) => {
  const convId = req.params.id;
  if (!db.messages[convId]) {
    db.messages[convId] = [];
  }

  const newMsg: ChatMessage = {
    ...req.body,
    id: req.body.id || `msg-${Date.now()}`,
    conversationId: convId,
    timestamp: 'Just now',
  };

  db.messages[convId].push(newMsg);

  // Update last message in conversation
  const conv = db.conversations.find((c) => c.id === convId);
  if (conv) {
    conv.lastMessage = newMsg.text;
    conv.lastTimestamp = 'Just now';
  }

  res.status(201).json(newMsg);
});
