import {
  ArtProduct,
  ChatConversation,
  ChatMessage,
  DisputeRecord,
  SwapOffer,
  SwapStatus,
  UserProfile,
} from '../types';

const BASE_URL = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API Error ${res.status}: ${errText || res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API Client Warning] Failed request to ${url}:`, err);
    throw err;
  }
}

export const api = {
  // Health & Stats
  health: () => request<{ status: string; uptime: number }>('/health'),
  stats: () =>
    request<{
      totalListings: number;
      availableListings: number;
      completedSwaps: number;
      activeSwappers: number;
      totalWasteDivertedKg: number;
      totalStudentSavingsUsd: number;
      pendingDisputes: number;
    }>('/stats'),

  // Users
  getUsers: () => request<UserProfile[]>('/users'),
  getUserById: (id: string) => request<UserProfile>(`/users/${id}`),
  updateUser: (id: string, data: Partial<UserProfile>) =>
    request<UserProfile>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Products
  getProducts: (params?: Record<string, string | number | boolean>) => {
    let query = '';
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== 'All' && v !== '') {
          searchParams.append(k, String(v));
        }
      });
      const str = searchParams.toString();
      if (str) query = `?${str}`;
    }
    return request<ArtProduct[]>(`/products${query}`);
  },
  getProductById: (id: string) => request<ArtProduct>(`/products/${id}`),
  createProduct: (data: Partial<ArtProduct>) =>
    request<ArtProduct>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProductStatus: (id: string, status: ArtProduct['status']) =>
    request<ArtProduct>(`/products/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  moderateProduct: (id: string, moderationStatus: ArtProduct['moderationStatus']) =>
    request<ArtProduct>(`/products/${id}/moderate`, {
      method: 'PATCH',
      body: JSON.stringify({ moderationStatus }),
    }),
  deleteProduct: (id: string) =>
    request<{ success: boolean }>(`/products/${id}`, {
      method: 'DELETE',
    }),

  // Swaps
  getSwaps: (userId?: string) => {
    const q = userId ? `?userId=${userId}` : '';
    return request<SwapOffer[]>(`/swaps${q}`);
  },
  createSwap: (data: Partial<SwapOffer>) =>
    request<SwapOffer>('/swaps', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSwapStatus: (id: string, status: SwapStatus) =>
    request<SwapOffer>(`/swaps/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Conversations & Chat
  getConversations: (userId?: string) => {
    const q = userId ? `?userId=${userId}` : '';
    return request<ChatConversation[]>(`/conversations${q}`);
  },
  createOrGetConversation: (data: Partial<ChatConversation>) =>
    request<ChatConversation>('/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMessages: (conversationId: string) =>
    request<ChatMessage[]>(`/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string, data: Partial<ChatMessage>) =>
    request<ChatMessage>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Disputes
  getDisputes: () => request<DisputeRecord[]>('/disputes'),
  createDispute: (data: Partial<DisputeRecord>) =>
    request<DisputeRecord>('/disputes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  resolveDispute: (id: string, resolutionNote: string) =>
    request<DisputeRecord>(`/disputes/${id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ resolutionNote }),
    }),
  dismissDispute: (id: string) =>
    request<DisputeRecord>(`/disputes/${id}/dismiss`, {
      method: 'PATCH',
    }),

  // Transactions
  getTransactions: (buyerId?: string) => {
    const q = buyerId ? `?buyerId=${buyerId}` : '';
    return request<any[]>(`/transactions${q}`);
  },
  createTransaction: (data: any) =>
    request<any>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
