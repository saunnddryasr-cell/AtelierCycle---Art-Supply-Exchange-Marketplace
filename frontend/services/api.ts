import {
  ArtProduct,
  ChatConversation,
  ChatMessage,
  DisputeRecord,
  SwapOffer,
  SwapStatus,
  UserProfile,
} from '../types';

export const DEFAULT_VERCEL_BACKEND_URL =
  'https://ateliercycle-art-supply-exchange-marketplace-backend-5nv3xb24a.vercel.app';

export function getApiBaseUrl(): string {
  // 1. User manual override stored in localStorage
  if (typeof window !== 'undefined') {
    const userOverride = localStorage.getItem('ateliercycle_api_url');
    if (userOverride && userOverride.trim()) {
      const trimmed = userOverride.trim();
      return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
    }
  }

  // 2. Explicit environment variable override
  if (import.meta.env.VITE_BACKEND_URL) {
    const raw = (import.meta.env.VITE_BACKEND_URL as string).trim();
    return raw.endsWith('/api') ? raw : `${raw}/api`;
  }

  // 3. Same-origin relative path for local development, AI Studio preview, and Vercel single-project deployments
  return '/api';
}

export function setCustomApiBaseUrl(url: string | null) {
  if (typeof window !== 'undefined') {
    if (url && url.trim()) {
      localStorage.setItem('ateliercycle_api_url', url.trim());
    } else {
      localStorage.removeItem('ateliercycle_api_url');
    }
  }
}

export async function testApiEndpoint(targetBaseUrl?: string): Promise<{
  success: boolean;
  latencyMs?: number;
  statusText?: string;
  data?: any;
  error?: string;
}> {
  const base = targetBaseUrl !== undefined ? targetBaseUrl : getApiBaseUrl();
  const normalized = base.endsWith('/api') ? base : `${base}/api`;
  const url = `${normalized}/health`;
  const start = performance.now();

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    const latencyMs = Math.round(performance.now() - start);

    if (!res.ok) {
      return {
        success: false,
        latencyMs,
        statusText: `HTTP ${res.status} ${res.statusText}`,
        error: `Server returned status ${res.status}`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      latencyMs,
      statusText: 'Connected (200 OK)',
      data,
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      success: false,
      latencyMs,
      error: err.message || 'Network request failed (possibly blocked by CORS or SSO redirect)',
    };
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
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
