import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle,
  Eye,
  FileText,
  Filter,
  Flame,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ArtProduct } from '../types';

export const AdminPanel: React.FC = () => {
  const {
    products,
    moderateProduct,
    deleteProduct,
    disputes,
    resolveDispute,
    dismissDispute,
    users,
    setSelectedProduct,
    swapOffers,
    showToast,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'moderation' | 'disputes' | 'users' | 'safety'>(
    'moderation'
  );
  const [resolutionInput, setResolutionInput] = useState<{ [id: string]: string }>({});

  // Summary calculations
  const totalWeightKg = products.reduce((acc, p) => acc + p.weightKg, 0);
  const totalApproved = products.filter((p) => p.moderationStatus === 'approved').length;
  const totalFlagged = products.filter((p) => p.moderationStatus === 'flagged').length;
  const pendingDisputes = disputes.filter((d) => d.status === 'under_investigation').length;

  const handleResolve = (disputeId: string) => {
    const note = resolutionInput[disputeId] || 'Issue investigated and resolved by safety desk.';
    resolveDispute(disputeId, note);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>AtelierCycle Trust, Safety & Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Curator & Moderation Desk
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-300 max-w-xl">
            Administering material safety guidelines, studio dispute mediation, and academic creator credentials in alignment with NID and Lalit Kala Akademi.
          </p>
        </div>

        {/* Global KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
          <div className="bg-stone-800/80 p-3 rounded-lg border border-stone-700">
            <span className="text-[11px] text-stone-400 block">Total Listings</span>
            <span className="text-lg font-bold font-mono text-white tabular-nums">{products.length}</span>
          </div>
          <div className="bg-stone-800/80 p-3 rounded-lg border border-stone-700">
            <span className="text-[11px] text-stone-400 block">Pending Disputes</span>
            <span className="text-lg font-bold font-mono text-amber-400 tabular-nums">{pendingDisputes}</span>
          </div>
          <div className="bg-stone-800/80 p-3 rounded-lg border border-stone-700 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-stone-400 block">Eco Waste Diverted</span>
            <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
              {Math.round(totalWeightKg * 10) / 10} kg
            </span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() => setActiveAdminTab('moderation')}
          className={`pb-3 px-3 font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
            activeAdminTab === 'moderation'
              ? 'border-amber-800 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Listing Moderation ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('disputes')}
          className={`pb-3 px-3 font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
            activeAdminTab === 'disputes'
              ? 'border-amber-800 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Dispute Mediation ({disputes.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`pb-3 px-3 font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
            activeAdminTab === 'users'
              ? 'border-amber-800 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Creator Community Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('safety')}
          className={`pb-3 px-3 font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
            activeAdminTab === 'safety'
              ? 'border-amber-800 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Studio Safety Standards</span>
        </button>
      </div>

      {/* Tab 1: Listing Moderation */}
      {activeAdminTab === 'moderation' && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-800">
              Audit Feed: Chemical Compliance & Material Integrity
            </span>
            <span className="text-stone-500">
              {totalApproved} Approved · {totalFlagged} Flagged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 font-semibold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="p-3.5">Material / Item</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Condition Claim</th>
                  <th className="p-3.5">Price / Swap</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Moderator Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-10 h-10 rounded-md object-cover border border-stone-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 max-w-xs">
                        <span className="font-semibold text-stone-900 block truncate">{p.title}</span>
                        <span className="text-stone-400 text-[11px] block">{p.location}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-stone-600">{p.category}</td>
                    <td className="p-3.5 text-stone-600">{p.condition}</td>
                    <td className="p-3.5 font-mono tabular-nums">
                      ${p.price} {p.isAvailableForSwap && <span className="text-amber-800">(Swap)</span>}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          p.moderationStatus === 'approved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {p.moderationStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-medium"
                      >
                        Preview
                      </button>
                      {p.moderationStatus === 'approved' ? (
                        <button
                          onClick={() => moderateProduct(p.id, 'flagged')}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-medium"
                        >
                          Flag
                        </button>
                      ) : (
                        <button
                          onClick={() => moderateProduct(p.id, 'approved')}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-medium"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1 text-stone-400 hover:text-red-700"
                        title="Remove product"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Dispute Mediation Center */}
      {activeAdminTab === 'disputes' && (
        <div className="space-y-4">
          {disputes.map((d) => (
            <div
              key={d.id}
              className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-rose-800 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Case #{d.id}
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-stone-600">
                    Reported by <strong>{d.reportedUserName}</strong>
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-stone-400 font-mono">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                    d.status === 'under_investigation'
                      ? 'bg-amber-100 text-amber-900'
                      : d.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {d.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-stone-900">
                  Item in question: {d.productTitle}
                </h4>
                <p className="text-xs text-stone-600 mt-1 bg-stone-50 p-3 rounded-lg border border-stone-200/80">
                  <strong>Complaint statement: </strong>"{d.description}"
                </p>
                {d.resolutionNote && (
                  <p className="text-xs text-emerald-800 mt-2 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                    <strong>Resolution audit: </strong>{d.resolutionNote}
                  </p>
                )}
              </div>

              {d.status === 'under_investigation' && (
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    placeholder="Enter mediator resolution note..."
                    value={resolutionInput[d.id] || ''}
                    onChange={(e) =>
                      setResolutionInput((prev) => ({ ...prev, [d.id]: e.target.value }))
                    }
                    className="flex-1 px-3 py-1.5 border border-stone-300 rounded text-xs text-stone-900 w-full"
                  />
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => dismissDispute(d.id)}
                      className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 border border-stone-200 rounded"
                    >
                      Dismiss Claim
                    </button>
                    <button
                      onClick={() => handleResolve(d.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-600 rounded transition-colors"
                    >
                      Resolve Amicably
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Creator Directory */}
      {activeAdminTab === 'users' && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-800">
            Registered Student, Artist & Educator Accounts
          </div>

          <div className="divide-y divide-stone-100">
            {users.map((u) => (
              <div key={u.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-stone-900">{u.name}</span>
                      {u.verified && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      <span className="text-[10px] font-mono uppercase bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                        {u.role}
                      </span>
                    </div>
                    <div className="text-stone-500 mt-0.5">
                      {u.institution} · {u.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-stone-900 font-mono font-bold block">
                      {u.swapsCompleted} Swaps
                    </span>
                    <span className="text-stone-400 text-[11px]">{u.rating} ★ Rating</span>
                  </div>

                  <button
                    onClick={() => {
                      showToast(`Verification status refreshed for ${u.name}`);
                    }}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium transition-colors"
                  >
                    Audit Credentials
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Studio Safety Standards & Chemical Guidelines */}
      {activeAdminTab === 'safety' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Community Health, Chemical Safety & Material Stewardship
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Guidelines adopted jointly with National Institute of Design & Lalit Kala Akademi to protect students and studio workshops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-800" />
                <span>Zero Hazardous Solvents</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Raw turpentine, benzene, and unsealed mineral spirits are banned from trade. Sellers must only exchange odorless mineral spirits (OMS) or plant-based citrus/walnut brush cleaners in original sealed containers.
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                <span>Toxic Pigment Labeling</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Heavy metal pigments (genuine Cadmiums, Cobalts, and Lead Whites) must have explicit series labels visible in photos so student buyers can practice proper hygiene and waste storage.
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-800" />
                <span>Verified Campus Handover Points</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Exchanges are strongly recommended at institutional safe spots: NID Central Library, Lalit Kala Akademi Reception, or art faculty common lounges.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
