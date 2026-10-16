import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Globe,
  Radio,
  RefreshCw,
  Server,
  ShieldAlert,
  Sliders,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  DEFAULT_VERCEL_BACKEND_URL,
  getApiBaseUrl,
  setCustomApiBaseUrl,
  testApiEndpoint,
} from '../services/api';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({ isOpen, onClose }) => {
  const { isBackendConnected, lastSyncTime, refreshData, showToast } = useApp();

  const [activeUrl, setActiveUrl] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    loading: boolean;
    success?: boolean;
    latencyMs?: number;
    statusText?: string;
    error?: string;
  }>({ tested: false, loading: false });

  useEffect(() => {
    if (isOpen) {
      const current = getApiBaseUrl();
      setActiveUrl(current);
      setCustomInput(current.startsWith('http') ? current : '');
      runTest(current);
    }
  }, [isOpen]);

  const runTest = async (urlToTest: string) => {
    setTestResult({ tested: true, loading: true });
    const res = await testApiEndpoint(urlToTest);
    setTestResult({
      tested: true,
      loading: false,
      success: res.success,
      latencyMs: res.latencyMs,
      statusText: res.statusText,
      error: res.error,
    });
  };

  const handleApplyUrl = async (url: string | null) => {
    setCustomApiBaseUrl(url);
    const updated = getApiBaseUrl();
    setActiveUrl(updated);
    await runTest(updated);
    await refreshData();
    showToast(`API target updated to: ${updated}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-stone-900">
                Backend API & Synchronization Status
              </h2>
              <span className="text-xs text-stone-500">Live endpoint configuration & diagnostics</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Live Status Card */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-700">Live API Health:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                  isBackendConnected
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isBackendConnected ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}
                />
                {isBackendConnected ? 'Connected & Synchronized' : 'Reconnecting'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-stone-600 pt-1 text-[11px]">
              <div>
                <span className="text-stone-400 block">Active Endpoint:</span>
                <span className="font-mono font-medium text-stone-900 truncate block">
                  {activeUrl || '/api'}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block">Last Sync Time:</span>
                <span className="font-mono font-medium text-stone-900 block">{lastSyncTime}</span>
              </div>
            </div>

            {testResult.tested && (
              <div
                className={`mt-2 p-2.5 rounded-lg border flex items-center justify-between text-[11px] ${
                  testResult.success
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {testResult.loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-stone-500" />
                  ) : testResult.success ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  )}
                  <span className="truncate">
                    {testResult.loading
                      ? 'Pinging endpoint...'
                      : testResult.success
                      ? `Response 200 OK (${testResult.latencyMs}ms)`
                      : testResult.error || testResult.statusText}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => runTest(activeUrl)}
                  disabled={testResult.loading}
                  className="px-2 py-0.5 bg-white border border-stone-200 rounded text-stone-700 hover:bg-stone-50 text-[10px] shrink-0 font-medium ml-2"
                >
                  Test Again
                </button>
              </div>
            )}
          </div>

          {/* Quick Preset Selector */}
          <div>
            <label className="block font-semibold text-stone-800 mb-2">
              Select API Backend Source:
            </label>
            <div className="space-y-2">
              {/* Option 1: Built-in Express Backend */}
              <button
                type="button"
                onClick={() => handleApplyUrl(null)}
                className={`w-full p-3 rounded-xl border text-left flex items-start justify-between transition-colors ${
                  activeUrl === '/api'
                    ? 'border-amber-800 bg-amber-50/60 ring-1 ring-amber-800/20'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-900">
                      Built-in Express Backend (Recommended)
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                      DEFAULT
                    </span>
                  </div>
                  <span className="text-stone-500 text-[11px] block mt-0.5">
                    Endpoint: <code className="font-mono text-stone-700">/api</code> · Runs on port 3000 with zero CORS or auth limits.
                  </span>
                </div>
                {activeUrl === '/api' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                )}
              </button>

              {/* Option 2: Vercel Backend */}
              <button
                type="button"
                onClick={() => handleApplyUrl(DEFAULT_VERCEL_BACKEND_URL)}
                className={`w-full p-3 rounded-xl border text-left flex items-start justify-between transition-colors ${
                  activeUrl.includes('vercel.app')
                    ? 'border-amber-800 bg-amber-50/60 ring-1 ring-amber-800/20'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-900">Vercel Backend Service</span>
                  </div>
                  <span className="text-stone-500 text-[11px] block mt-0.5 truncate font-mono">
                    {DEFAULT_VERCEL_BACKEND_URL}
                  </span>
                </div>
                {activeUrl.includes('vercel.app') && (
                  <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                )}
              </button>
            </div>
          </div>

          {/* Custom URL Input */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Custom Backend URL:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://your-custom-backend.vercel.app"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
              <button
                type="button"
                onClick={() => handleApplyUrl(customInput.trim())}
                disabled={!customInput.trim()}
                className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white rounded-lg font-semibold transition-colors text-xs whitespace-nowrap"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Vercel Deployment Note */}
          <div className="p-3 bg-stone-100 rounded-xl text-[11px] text-stone-600 space-y-1.5 leading-relaxed">
            <span className="font-semibold text-stone-800 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <span>Deployment & URL Notes:</span>
            </span>
            <p>
              • <strong>Built-in Server (`/api`)</strong>: Works instantly with zero setup on Google AI Studio live links and local development.
            </p>
            <p>
              • <strong>Vercel Backend Deployment</strong>: If your Vercel URL redirects to SSO login, open your Vercel Dashboard $\to$ <em>Settings $\to$ Deployment Protection</em> and set it to <strong>Disabled</strong> to enable public API access.
            </p>
          </div>

          {/* Footer action */}
          <div className="pt-2 border-t border-stone-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs uppercase tracking-wider"
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
