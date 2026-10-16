import React, { useState } from 'react';
import { Check, ShieldCheck, User, UserPlus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserSwitchModal: React.FC = () => {
  const { isUserSwitchOpen, closeUserSwitch, users, currentUser, switchUserById } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newRole, setNewRole] = useState<'student' | 'artist'>('student');

  if (!isUserSwitchOpen) return null;

  const handleSelect = (userId: string) => {
    switchUserById(userId);
    closeUserSwitch();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-serif font-bold text-stone-900">
              Switch Artist Account
            </h2>
            <p className="text-xs text-stone-500">
              Test buyer, seller, and admin experiences across different studio roles.
            </p>
          </div>
          <button
            onClick={closeUserSwitch}
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User list */}
        <div className="p-4 space-y-2">
          {users.map((u) => {
            const isCurrent = u.id === currentUser.id;
            return (
              <button
                key={u.id}
                onClick={() => handleSelect(u.id)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'border-amber-800 bg-amber-50/60 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-stone-900">{u.name}</span>
                      {u.role === 'admin' ? (
                        <span className="text-[10px] font-mono font-bold bg-stone-900 text-white px-1.5 py-0.2 rounded">
                          ADMIN
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono uppercase text-stone-500 bg-stone-100 px-1 rounded">
                          {u.role}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500 block truncate max-w-[230px]">
                      {u.institution}
                    </span>
                    <span className="text-[10px] text-stone-400 block">
                      {u.location} · {u.swapsCompleted} swaps
                    </span>
                  </div>
                </div>

                {isCurrent && (
                  <div className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 rounded-b-2xl text-[11px] text-stone-500 text-center">
          Switching accounts immediately reconfigures your active inventory, message inbox, and swap proposals.
        </div>
      </div>
    </div>
  );
};
