import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeftRight,
  Check,
  DollarSign,
  MapPin,
  MessageSquare,
  Send,
  Sparkles,
  Store,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getFallbackForCategory, resolveArtImage } from '../utils/imageHelper';

export const ChatInbox: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    messages,
    sendMessage,
    currentUser,
    products,
    setSelectedProduct,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [counterPrice, setCounterPrice] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const activeMessages = activeConv ? messages[activeConv.id] || [] : [];

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, activeConversationId]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputMessage.trim());
    setInputMessage('');
  };

  const handleSendQuickNegotiation = (type: 'price' | 'location' | 'available') => {
    if (!activeConv) return;
    if (type === 'price') {
      setShowCounterModal(true);
    } else if (type === 'location') {
      sendMessage(
        activeConv.id,
        'Would you prefer to meet at the Campus Art Library Gate or the Student Canteen benches?',
        {
          type: 'handover_location',
          value: 'Campus Art Library Courtyard',
          status: 'pending',
        }
      );
    } else if (type === 'available') {
      sendMessage(
        activeConv.id,
        'Hi! Confirming that I have the supplies packed and ready for handover.'
      );
    }
  };

  const submitCounterOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterPrice || !activeConv) return;
    sendMessage(
      activeConv.id,
      `I'd like to counter-offer with $${counterPrice} for pickup this week.`,
      {
        type: 'price_offer',
        value: `$${counterPrice}`,
        status: 'pending',
      }
    );
    setShowCounterModal(false);
    setCounterPrice('');
  };

  const linkedProduct = activeConv ? products.find((p) => p.id === activeConv.productId) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px] max-h-[80vh]">
        
        {/* Left Column: Conversation Thread List */}
        <div className="md:col-span-4 border-r border-stone-200 flex flex-col bg-stone-50/50">
          <div className="p-4 border-b border-stone-200 bg-white">
            <h2 className="text-base font-serif font-bold text-stone-900">
              Messages & Negotiations
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Direct artist chats for purchases & material swaps
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
            {conversations.length > 0 ? (
              conversations.map((conv) => {
                const isSelected = conv.id === activeConv?.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                      isSelected ? 'bg-amber-50/80 border-r-2 border-amber-800' : 'hover:bg-stone-100/70'
                    }`}
                  >
                    <img
                      src={conv.otherUser.avatar}
                      alt={conv.otherUser.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-900 truncate">
                          {conv.otherUser.name}
                        </span>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {conv.lastTimestamp}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-600 font-medium truncate mt-0.5">
                        Re: {conv.productTitle}
                      </div>
                      <p className="text-xs text-stone-500 truncate mt-1">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-stone-400">
                No active conversations yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Chat Room & Negotiation Console */}
        {activeConv ? (
          <div className="md:col-span-8 flex flex-col bg-stone-50/30">
            
            {/* Header: User Info & Product Context Strip */}
            <div className="p-3.5 bg-white border-b border-stone-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={activeConv.otherUser.avatar}
                  alt={activeConv.otherUser.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-stone-200"
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-stone-900 truncate">
                    {activeConv.otherUser.name}
                  </h3>
                  <div className="text-xs text-stone-500 truncate">
                    {activeConv.otherUser.institution}
                  </div>
                </div>
              </div>

              {/* Linked Product Context Badge */}
              {linkedProduct && (
                <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg p-1.5 pl-2 max-w-[280px]">
                  <img
                    src={resolveArtImage(linkedProduct.images[0], linkedProduct.category)}
                    alt={linkedProduct.title}
                    onError={(e) => {
                      e.currentTarget.src = getFallbackForCategory(linkedProduct.category);
                    }}
                    className="w-8 h-8 rounded object-cover shrink-0"
                  />
                  <div className="min-w-0 text-left">
                    <span className="text-xs font-semibold text-stone-900 block truncate">
                      {linkedProduct.title}
                    </span>
                    <span className="text-[11px] font-mono text-stone-600 block">
                      ${linkedProduct.price} · {linkedProduct.condition}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(linkedProduct)}
                    className="text-[11px] font-medium text-amber-800 hover:text-amber-900 px-1.5 py-1 whitespace-nowrap"
                  >
                    View
                  </button>
                </div>
              )}
            </div>

            {/* Negotiation Quick Action Presets */}
            <div className="px-4 py-2 bg-stone-100/60 border-b border-stone-200 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
              <span className="text-stone-400 text-[11px] uppercase tracking-wider shrink-0">
                Quick Actions:
              </span>
              <button
                onClick={() => handleSendQuickNegotiation('price')}
                className="px-2.5 py-1 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 rounded-md font-medium shrink-0 transition-colors flex items-center gap-1"
              >
                <DollarSign className="w-3 h-3 text-amber-800" />
                <span>Make Counter Offer</span>
              </button>
              <button
                onClick={() => handleSendQuickNegotiation('location')}
                className="px-2.5 py-1 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 rounded-md font-medium shrink-0 transition-colors flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-stone-500" />
                <span>Suggest Handover Spot</span>
              </button>
              <button
                onClick={() => handleSendQuickNegotiation('available')}
                className="px-2.5 py-1 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 rounded-md font-medium shrink-0 transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Confirm Material Ready</span>
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {activeMessages.map((msg) => {
                const isMine = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        isMine
                          ? 'bg-amber-900 text-amber-50 rounded-br-xs'
                          : 'bg-white border border-stone-200 text-stone-900 rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Interactive Offer Card within message */}
                      {msg.offerCard && (
                        <div
                          className={`mt-2 p-2.5 rounded-lg text-xs border ${
                            isMine
                              ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                              : 'bg-stone-50 border-stone-200 text-stone-800'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-semibold">
                            {msg.offerCard.type === 'swap_offer' ? (
                              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
                            ) : msg.offerCard.type === 'handover_location' ? (
                              <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                            <span className="capitalize">{msg.offerCard.type.replace('_', ' ')}:</span>
                          </div>
                          <p className="mt-0.5 font-medium">{msg.offerCard.value}</p>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 px-1 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type a message or negotiation note..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 bg-amber-800 hover:bg-amber-700 disabled:opacity-40 text-white rounded-lg transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        ) : (
          <div className="md:col-span-8 flex flex-col items-center justify-center p-12 text-center text-stone-400">
            <MessageSquare className="w-12 h-12 mb-3 stroke-1" />
            <h3 className="font-serif font-bold text-stone-700">Select a Conversation</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xs">
              Coordinate supply pickups, negotiate prices, or discuss item conditions with other creators.
            </p>
          </div>
        )}

      </div>

      {/* Modal for sending counter offer */}
      {showCounterModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full border border-stone-200 shadow-xl space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-lg">Send Counter-Offer</h3>
            <p className="text-xs text-stone-500">
              Propose a revised cash price for {activeConv?.productTitle}.
            </p>
            <form onSubmit={submitCounterOffer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Proposed Price (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    placeholder="e.g. 25"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCounterModal(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-amber-800 text-white rounded-md hover:bg-amber-700"
                >
                  Send Counter Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
