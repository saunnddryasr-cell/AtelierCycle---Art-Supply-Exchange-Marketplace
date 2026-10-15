import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_CONVERSATIONS,
  INITIAL_DISPUTES,
  INITIAL_MESSAGES,
  INITIAL_PRODUCTS,
  INITIAL_SWAP_OFFERS,
  INITIAL_USERS,
} from '../data/mockData';
import { api } from '../services/api';
import {
  ArtProduct,
  ChatConversation,
  ChatMessage,
  DisputeRecord,
  FilterState,
  SwapOffer,
  SwapStatus,
  UserProfile,
} from '../types';

export type ActiveView = 'marketplace' | 'swaps' | 'chat' | 'dashboard' | 'admin';

export interface PurchaseTransaction {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  pickupLocation: string;
  paymentMethod: 'cash_on_pickup' | 'free_student_cycle';
  createdAt: string;
}

interface AppContextType {
  currentUser: UserProfile;
  users: UserProfile[];
  products: ArtProduct[];
  swapOffers: SwapOffer[];
  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>;
  disputes: DisputeRecord[];
  transactions: PurchaseTransaction[];
  savedProductIds: string[];
  activeView: ActiveView;
  selectedProduct: ArtProduct | null;
  activeConversationId: string | null;
  filterState: FilterState;
  toastMessage: string | null;
  isBackendConnected: boolean;
  lastSyncTime: string;

  // Modals
  isCreateListingOpen: boolean;
  isUserSwitchOpen: boolean;
  isSwapModalOpen: boolean;
  isBuyModalOpen: boolean;

  // Actions
  setActiveView: (view: ActiveView) => void;
  setCurrentUser: (user: UserProfile) => void;
  switchUserById: (userId: string) => void;
  setSelectedProduct: (product: ArtProduct | null) => void;
  setActiveConversationId: (convId: string | null) => void;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  setToastMessage: (msg: string | null) => void;
  showToast: (msg: string) => void;
  refreshData: () => Promise<void>;

  // Modal handlers
  openCreateListing: () => void;
  closeCreateListing: () => void;
  openUserSwitch: () => void;
  closeUserSwitch: () => void;
  openSwapModal: (product?: ArtProduct) => void;
  closeSwapModal: () => void;
  openBuyModal: (product?: ArtProduct) => void;
  closeBuyModal: () => void;

  // Product actions
  createProduct: (
    product: Omit<ArtProduct, 'id' | 'createdAt' | 'status' | 'moderationStatus'>
  ) => Promise<void>;
  updateProductStatus: (productId: string, status: ArtProduct['status']) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  toggleSaveProduct: (productId: string) => void;

  // Swap actions
  proposeSwap: (params: {
    requestedProductId: string;
    offeredProductId?: string;
    offeredCustomTitle?: string;
    offeredCustomValue?: number;
    cashAdjustment: number;
    note: string;
    proposedLocation: string;
  }) => Promise<void>;
  updateSwapStatus: (swapId: string, newStatus: SwapStatus) => Promise<void>;

  // Purchase action
  completePurchase: (params: {
    productId: string;
    pickupLocation: string;
    note?: string;
  }) => Promise<void>;

  // Chat actions
  sendMessage: (
    conversationId: string,
    text: string,
    offerCard?: ChatMessage['offerCard']
  ) => Promise<void>;
  startOrOpenChatWithSeller: (product: ArtProduct) => Promise<void>;

  // Admin actions
  moderateProduct: (productId: string, status: 'approved' | 'flagged') => Promise<void>;
  resolveDispute: (disputeId: string, note: string) => Promise<void>;
  dismissDispute: (disputeId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_SAVED = 'ateliercycle_saved_v2';
const STORAGE_KEY_USER = 'ateliercycle_user_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);

  const [currentUser, setCurrentUserState] = useState<UserProfile>(() => {
    const savedUserId = localStorage.getItem(STORAGE_KEY_USER);
    if (savedUserId) {
      const found = INITIAL_USERS.find((u) => u.id === savedUserId);
      if (found) return found;
    }
    return INITIAL_USERS[0];
  });

  const [products, setProducts] = useState<ArtProduct[]>(INITIAL_PRODUCTS);
  const [swapOffers, setSwapOffers] = useState<SwapOffer[]>(INITIAL_SWAP_OFFERS);
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [disputes, setDisputes] = useState<DisputeRecord[]>(INITIAL_DISPUTES);
  const [transactions, setTransactions] = useState<PurchaseTransaction[]>([]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Syncing...');

  const [savedProductIds, setSavedProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED);
      return saved ? JSON.parse(saved) : ['prod-oil-set-01', 'prod-brush-bundle-02'];
    } catch {
      return ['prod-oil-set-01', 'prod-brush-bundle-02'];
    }
  });

  const [activeView, setActiveView] = useState<ActiveView>('marketplace');
  const [selectedProduct, setSelectedProduct] = useState<ArtProduct | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-01');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isUserSwitchOpen, setIsUserSwitchOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  // Filter state
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    category: 'All',
    condition: 'All',
    maxPrice: 150,
    swapOnly: false,
    location: 'All',
    sortBy: 'newest',
  });

  // Load and synchronize data from backend on mount
  const refreshData = async () => {
    try {
      // Test health
      await api.health();
      setIsBackendConnected(true);

      const [prods, usrList, swaps, convs, disps, txns] = await Promise.all([
        api.getProducts().catch(() => INITIAL_PRODUCTS),
        api.getUsers().catch(() => INITIAL_USERS),
        api.getSwaps().catch(() => INITIAL_SWAP_OFFERS),
        api.getConversations().catch(() => INITIAL_CONVERSATIONS),
        api.getDisputes().catch(() => INITIAL_DISPUTES),
        api.getTransactions().catch(() => []),
      ]);

      if (prods && prods.length > 0) setProducts(prods);
      if (usrList && usrList.length > 0) setUsers(usrList);
      if (swaps) setSwapOffers(swaps);
      if (convs && convs.length > 0) setConversations(convs);
      if (disps) setDisputes(disps);
      if (txns) setTransactions(txns);

      // Load messages for conversations
      if (convs && convs.length > 0) {
        const msgsObj: Record<string, ChatMessage[]> = {};
        await Promise.all(
          convs.map(async (c) => {
            try {
              const msgs = await api.getMessages(c.id);
              msgsObj[c.id] = msgs;
            } catch {
              msgsObj[c.id] = INITIAL_MESSAGES[c.id] || [];
            }
          })
        );
        setMessages((prev) => ({ ...prev, ...msgsObj }));
      }

      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.warn('[Sync Warning] Backend API unreachable, operating with local state cache:', err);
      setIsBackendConnected(false);
      setLastSyncTime('Local fallback');
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedProductIds));
  }, [savedProductIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const switchUserById = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUserState(found);
      localStorage.setItem(STORAGE_KEY_USER, found.id);
      showToast(`Switched active profile to ${found.name} (${found.institution})`);
    }
  };

  const openCreateListing = () => setIsCreateListingOpen(true);
  const closeCreateListing = () => setIsCreateListingOpen(false);
  const openUserSwitch = () => setIsUserSwitchOpen(true);
  const closeUserSwitch = () => setIsUserSwitchOpen(false);

  const openSwapModal = (product?: ArtProduct) => {
    if (product) setSelectedProduct(product);
    setIsSwapModalOpen(true);
  };
  const closeSwapModal = () => setIsSwapModalOpen(false);

  const openBuyModal = (product?: ArtProduct) => {
    if (product) setSelectedProduct(product);
    setIsBuyModalOpen(true);
  };
  const closeBuyModal = () => setIsBuyModalOpen(false);

  // Sync Create Product
  const createProduct = async (
    itemData: Omit<ArtProduct, 'id' | 'createdAt' | 'status' | 'moderationStatus'>
  ) => {
    const optimisticProduct: ArtProduct = {
      ...itemData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'available',
      moderationStatus: 'approved',
    };

    setProducts((prev) => [optimisticProduct, ...prev]);
    setIsCreateListingOpen(false);
    showToast(`"${optimisticProduct.title}" has been listed on AtelierCycle!`);

    try {
      const serverProduct = await api.createProduct(optimisticProduct);
      if (serverProduct) {
        setProducts((prev) => [serverProduct, ...prev.filter((p) => p.id !== optimisticProduct.id)]);
      }
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.warn('API sync failed on createProduct; kept in local state', err);
    }
  };

  // Sync Update Status
  const updateProductStatus = async (productId: string, status: ArtProduct['status']) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status } : p))
    );
    showToast(`Listing status updated to ${status}.`);

    try {
      await api.updateProductStatus(productId, status);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.warn('API sync failed on updateProductStatus', err);
    }
  };

  // Sync Delete Product
  const deleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (selectedProduct?.id === productId) setSelectedProduct(null);
    showToast('Listing removed successfully.');

    try {
      await api.deleteProduct(productId);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.warn('API sync failed on deleteProduct', err);
    }
  };

  const toggleSaveProduct = (productId: string) => {
    setSavedProductIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from saved wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your wishlist!');
        return [...prev, productId];
      }
    });
  };

  // Sync Propose Swap
  const proposeSwap = async ({
    requestedProductId,
    offeredProductId,
    offeredCustomTitle,
    offeredCustomValue,
    cashAdjustment,
    note,
    proposedLocation,
  }: {
    requestedProductId: string;
    offeredProductId?: string;
    offeredCustomTitle?: string;
    offeredCustomValue?: number;
    cashAdjustment: number;
    note: string;
    proposedLocation: string;
  }) => {
    const targetProduct = products.find((p) => p.id === requestedProductId);
    if (!targetProduct) return;

    let offerTitle = offeredCustomTitle || 'Custom Studio Materials Lot';
    let offerValue = offeredCustomValue || targetProduct.price;
    let offerImage = '/src/assets/images/hero_art_materials_studio_1791822503385.jpg';

    if (offeredProductId) {
      const myProduct = products.find((p) => p.id === offeredProductId);
      if (myProduct) {
        offerTitle = myProduct.title;
        offerValue = myProduct.price;
        offerImage = myProduct.images[0] || offerImage;
      }
    }

    const newOffer: SwapOffer = {
      id: `swap-${Date.now()}`,
      requestedProductId: targetProduct.id,
      requestedProductTitle: targetProduct.title,
      requestedProductImage: targetProduct.images[0] || offerImage,
      requestedProductPrice: targetProduct.price,
      ownerId: targetProduct.sellerId,
      proposerId: currentUser.id,
      proposerName: currentUser.name,
      offeredProductId,
      offeredProductTitle: offerTitle,
      offeredProductImage: offerImage,
      offeredProductValue: offerValue,
      cashAdjustment,
      status: 'pending',
      note,
      proposedLocation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSwapOffers((prev) => [newOffer, ...prev]);
    setIsSwapModalOpen(false);
    showToast(`Swap proposal sent to the seller for "${targetProduct.title}"!`);

    try {
      await api.createSwap(newOffer);
    } catch (err) {
      console.warn('API sync failed on proposeSwap', err);
    }

    const sellerUser = users.find((u) => u.id === targetProduct.sellerId) || INITIAL_USERS[1];
    const existingConv = conversations.find(
      (c) =>
        c.productId === targetProduct.id &&
        c.participantIds.includes(currentUser.id) &&
        c.participantIds.includes(targetProduct.sellerId)
    );

    if (existingConv) {
      await sendMessage(
        existingConv.id,
        `Sent a formal swap proposal: "${offerTitle}" ${
          cashAdjustment > 0 ? `+ $${cashAdjustment}` : ''
        } for your "${targetProduct.title}".`,
        {
          type: 'swap_offer',
          value: offerTitle,
          status: 'pending',
        }
      );
    } else {
      const convId = `conv-${Date.now()}`;
      const newConv: ChatConversation = {
        id: convId,
        productId: targetProduct.id,
        productTitle: targetProduct.title,
        productImage: targetProduct.images[0] || offerImage,
        productPrice: targetProduct.price,
        participantIds: [currentUser.id, targetProduct.sellerId],
        otherUser: sellerUser,
        lastMessage: `Swap proposed: ${offerTitle}`,
        lastTimestamp: 'Just now',
        unreadCount: 0,
      };

      setConversations((prev) => [newConv, ...prev]);
      try {
        await api.createOrGetConversation(newConv);
      } catch (err) {
        console.warn('API sync failed on createOrGetConversation', err);
      }

      await sendMessage(
        convId,
        `Hi ${sellerUser.name}! I proposed an exchange for your ${targetProduct.title}. Note: "${note}"`,
        {
          type: 'swap_offer',
          value: offerTitle,
          status: 'pending',
        }
      );
    }
  };

  // Sync Update Swap Status
  const updateSwapStatus = async (swapId: string, newStatus: SwapStatus) => {
    setSwapOffers((prev) =>
      prev.map((s) => (s.id === swapId ? { ...s, status: newStatus, updatedAt: new Date().toISOString() } : s))
    );

    const offer = swapOffers.find((s) => s.id === swapId);
    if (offer && newStatus === 'accepted') {
      setProducts((prev) =>
        prev.map((p) => (p.id === offer.requestedProductId ? { ...p, status: 'reserved' } : p))
      );
      showToast(`Swap proposal accepted! Item reserved for handover.`);
    } else if (offer && newStatus === 'completed') {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === offer.requestedProductId || (offer.offeredProductId && p.id === offer.offeredProductId)) {
            return { ...p, status: 'swapped' };
          }
          return p;
        })
      );
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === offer.ownerId || u.id === offer.proposerId) {
            return {
              ...u,
              swapsCompleted: u.swapsCompleted + 1,
              itemsDivertedKg: Math.round((u.itemsDivertedKg + 1.8) * 10) / 10,
              moneySavedUsd: u.moneySavedUsd + offer.requestedProductPrice,
            };
          }
          return u;
        })
      );
      showToast(`Exchange marked as Completed! Impact credited to both artist profiles.`);
    } else if (newStatus === 'declined') {
      showToast('Swap offer declined.');
    }

    try {
      await api.updateSwapStatus(swapId, newStatus);
    } catch (err) {
      console.warn('API sync failed on updateSwapStatus', err);
    }
  };

  // Sync Complete Purchase
  const completePurchase = async ({
    productId,
    pickupLocation,
    note,
  }: {
    productId: string;
    pickupLocation: string;
    note?: string;
  }) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const seller = users.find((u) => u.id === product.sellerId) || INITIAL_USERS[1];

    const newTxn: PurchaseTransaction = {
      id: `txn-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0] || '',
      price: product.price,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId: seller.id,
      sellerName: seller.name,
      pickupLocation,
      paymentMethod: product.price === 0 ? 'free_student_cycle' : 'cash_on_pickup',
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTxn, ...prev]);
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status: 'sold' } : p))
    );
    setIsBuyModalOpen(false);

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            moneySavedUsd: u.moneySavedUsd + (product.originalPrice - product.price),
            itemsDivertedKg: Math.round((u.itemsDivertedKg + product.weightKg) * 10) / 10,
          };
        }
        return u;
      })
    );

    showToast(`Order confirmed for "${product.title}"! Pickup coordinated at ${pickupLocation}.`);

    try {
      await api.createTransaction(newTxn);
    } catch (err) {
      console.warn('API sync failed on createTransaction', err);
    }

    const convId = `conv-${Date.now()}`;
    const newConv: ChatConversation = {
      id: convId,
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0] || '',
      productPrice: product.price,
      participantIds: [currentUser.id, seller.id],
      otherUser: seller,
      lastMessage: `Purchase order confirmed for $${product.price}`,
      lastTimestamp: 'Just now',
      unreadCount: 0,
    };

    setConversations((prev) => [newConv, ...prev]);
    try {
      await api.createOrGetConversation(newConv);
    } catch (err) {
      console.warn('API sync failed on conversation creation', err);
    }

    await sendMessage(
      convId,
      `Hi ${seller.name}! I have reserved this item to purchase on pickup. Pickup spot: ${pickupLocation}. ${
        note ? `Note: "${note}"` : ''
      }`,
      {
        type: 'price_offer',
        value: `$${product.price} (Cash on Pickup)`,
        status: 'accepted',
      }
    );
  };

  // Sync Send Message
  const sendMessage = async (
    conversationId: string,
    text: string,
    offerCard?: ChatMessage['offerCard']
  ) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: 'Just now',
      offerCard,
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: text,
              lastTimestamp: 'Just now',
            }
          : c
      )
    );

    try {
      await api.sendMessage(conversationId, newMsg);
    } catch (err) {
      console.warn('API sync failed on sendMessage', err);
    }

    const currentConv = conversations.find((c) => c.id === conversationId);
    if (currentConv && currentConv.otherUser.id !== currentUser.id) {
      setTimeout(async () => {
        const replies = [
          `Thanks ${currentUser.name}! That works perfectly. I will have the supplies packed carefully in archival tissue.`,
          `Sounds good! Looking forward to meeting up. See you at the studio!`,
          `Great question! All materials were stored properly away from sunlight and moisture. Ready for your creative projects!`,
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const replyMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          conversationId,
          senderId: currentConv.otherUser.id,
          senderName: currentConv.otherUser.name,
          text: randomReply,
          timestamp: 'Just now',
        };

        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), replyMsg],
        }));

        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: randomReply,
                  lastTimestamp: 'Just now',
                }
              : c
          )
        );

        try {
          await api.sendMessage(conversationId, replyMsg);
        } catch (err) {
          console.warn('API sync failed on simulated reply', err);
        }
      }, 1500);
    }
  };

  const startOrOpenChatWithSeller = async (product: ArtProduct) => {
    const seller = users.find((u) => u.id === product.sellerId) || INITIAL_USERS[1];
    const existing = conversations.find(
      (c) =>
        c.productId === product.id &&
        c.participantIds.includes(currentUser.id) &&
        c.participantIds.includes(seller.id)
    );

    if (existing) {
      setActiveConversationId(existing.id);
      setActiveView('chat');
    } else {
      const convId = `conv-${Date.now()}`;
      const newConv: ChatConversation = {
        id: convId,
        productId: product.id,
        productTitle: product.title,
        productImage: product.images[0] || '',
        productPrice: product.price,
        participantIds: [currentUser.id, seller.id],
        otherUser: seller,
        lastMessage: `Inquired about ${product.title}`,
        lastTimestamp: 'Just now',
        unreadCount: 0,
      };

      setConversations((prev) => [newConv, ...prev]);
      try {
        await api.createOrGetConversation(newConv);
      } catch (err) {
        console.warn('API sync failed on startOrOpenChatWithSeller', err);
      }

      await sendMessage(
        convId,
        `Hi ${seller.name}, I'm interested in your "${product.title}". Is it still available for pickup or swap?`
      );

      setActiveConversationId(convId);
      setActiveView('chat');
    }
  };

  // Sync Moderate Product
  const moderateProduct = async (productId: string, status: 'approved' | 'flagged') => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, moderationStatus: status } : p))
    );
    showToast(`Listing marked as ${status}.`);

    try {
      await api.moderateProduct(productId, status);
    } catch (err) {
      console.warn('API sync failed on moderateProduct', err);
    }
  };

  // Sync Resolve Dispute
  const resolveDispute = async (disputeId: string, note: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId ? { ...d, status: 'resolved', resolutionNote: note } : d
      )
    );
    showToast('Dispute resolved successfully.');

    try {
      await api.resolveDispute(disputeId, note);
    } catch (err) {
      console.warn('API sync failed on resolveDispute', err);
    }
  };

  // Sync Dismiss Dispute
  const dismissDispute = async (disputeId: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId ? { ...d, status: 'dismissed', resolutionNote: 'Dismissed by moderator' } : d
      )
    );
    showToast('Dispute dismissed.');

    try {
      await api.dismissDispute(disputeId);
    } catch (err) {
      console.warn('API sync failed on dismissDispute', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        products,
        swapOffers,
        conversations,
        messages,
        disputes,
        transactions,
        savedProductIds,
        activeView,
        selectedProduct,
        activeConversationId,
        filterState,
        toastMessage,
        isBackendConnected,
        lastSyncTime,
        isCreateListingOpen,
        isUserSwitchOpen,
        isSwapModalOpen,
        isBuyModalOpen,
        setActiveView,
        setCurrentUser: setCurrentUserState,
        switchUserById,
        setSelectedProduct,
        setActiveConversationId,
        setFilterState,
        setToastMessage,
        showToast,
        refreshData,
        openCreateListing,
        closeCreateListing,
        openUserSwitch,
        closeUserSwitch,
        openSwapModal,
        closeSwapModal,
        openBuyModal,
        closeBuyModal,
        createProduct,
        updateProductStatus,
        deleteProduct,
        toggleSaveProduct,
        proposeSwap,
        updateSwapStatus,
        completePurchase,
        sendMessage,
        startOrOpenChatWithSeller,
        moderateProduct,
        resolveDispute,
        dismissDispute,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
