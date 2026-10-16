import {
  INITIAL_CONVERSATIONS,
  INITIAL_DISPUTES,
  INITIAL_MESSAGES,
  INITIAL_PRODUCTS,
  INITIAL_SWAP_OFFERS,
  INITIAL_USERS,
} from './mockData';
import {
  ArtProduct,
  ChatConversation,
  ChatMessage,
  DisputeRecord,
  PurchaseTransaction,
  SwapOffer,
  UserProfile,
} from '../types';

class BackendStore {
  public users: UserProfile[] = [...INITIAL_USERS];
  public products: ArtProduct[] = [...INITIAL_PRODUCTS];
  public swapOffers: SwapOffer[] = [...INITIAL_SWAP_OFFERS];
  public conversations: ChatConversation[] = [...INITIAL_CONVERSATIONS];
  public messages: Record<string, ChatMessage[]> = JSON.parse(JSON.stringify(INITIAL_MESSAGES));
  public disputes: DisputeRecord[] = [...INITIAL_DISPUTES];
  public transactions: PurchaseTransaction[] = [];

  public getStats() {
    const totalWeightKg = this.products.reduce((sum, p) => sum + (p.weightKg || 0), 0);
    const totalSavedUsd = this.users.reduce((sum, u) => sum + (u.moneySavedUsd || 0), 0);
    const completedSwapsCount = this.swapOffers.filter((s) => s.status === 'completed').length;

    return {
      totalListings: this.products.length,
      availableListings: this.products.filter((p) => p.status === 'available').length,
      completedSwaps: completedSwapsCount,
      activeSwappers: this.users.length,
      totalWasteDivertedKg: Math.round(totalWeightKg * 10) / 10,
      totalStudentSavingsUsd: totalSavedUsd,
      pendingDisputes: this.disputes.filter((d) => d.status === 'under_investigation').length,
    };
  }
}

export const db = new BackendStore();
