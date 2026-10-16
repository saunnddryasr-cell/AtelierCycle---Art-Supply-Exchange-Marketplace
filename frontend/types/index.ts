export type ProductCategory =
  | 'Oils & Acrylics'
  | 'Watercolors & Gouache'
  | 'Brushes & Tools'
  | 'Canvases & Surfaces'
  | 'Sketchbooks & Paper'
  | 'Printmaking & Inks'
  | 'Sculpture & Pottery'
  | 'Easels & Studio Gear';

export type ProductCondition =
  | 'Brand New'
  | 'Like New'
  | 'Gently Used'
  | 'Half Used'
  | 'Surplus / Studio Lot';

export type SwapStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  role: 'student' | 'artist' | 'educator' | 'admin';
  institution: string;
  location: string;
  bio: string;
  joinedDate: string;
  verified: boolean;
  rating: number;
  reviewsCount: number;
  swapsCompleted: number;
  itemsDivertedKg: number;
  moneySavedUsd: number;
}

export interface ArtProduct {
  id: string;
  title: string;
  category: ProductCategory;
  brand: string;
  price: number;
  originalPrice: number;
  condition: ProductCondition;
  conditionDetails: string;
  isAvailableForSwap: boolean;
  preferredSwaps?: string;
  images: string[];
  description: string;
  location: string;
  sellerId: string;
  createdAt: string;
  status: 'available' | 'reserved' | 'swapped' | 'sold';
  weightKg: number;
  tags: string[];
  moderationStatus: 'approved' | 'flagged' | 'pending';
}

export interface SwapOffer {
  id: string;
  requestedProductId: string;
  requestedProductTitle: string;
  requestedProductImage: string;
  requestedProductPrice: number;
  ownerId: string;
  proposerId: string;
  proposerName: string;
  offeredProductId?: string;
  offeredProductTitle: string;
  offeredProductImage: string;
  offeredProductValue: number;
  cashAdjustment: number;
  status: SwapStatus;
  note: string;
  proposedLocation: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  offerCard?: {
    type: 'price_offer' | 'swap_offer' | 'handover_location';
    value: string;
    status: 'pending' | 'accepted' | 'rejected';
  };
}

export interface ChatConversation {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  participantIds: string[];
  otherUser: UserProfile;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
}

export interface DisputeRecord {
  id: string;
  transactionId: string;
  reportedByUserId: string;
  reportedUserName: string;
  reportedAgainstUserId: string;
  productTitle: string;
  reason: 'item_not_as_described' | 'no_show_pickup' | 'toxic_material_concern' | 'other';
  description: string;
  status: 'under_investigation' | 'resolved' | 'dismissed';
  createdAt: string;
  resolutionNote?: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  condition: string;
  maxPrice: number;
  swapOnly: boolean;
  location: string;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'discount';
}
