import React from 'react';
import { usePWA } from '../context/PWAContext';
import { RefreshCw, Sparkles } from 'lucide-react';

export const UpdateBanner: React.FC = () => {
  const { hasUpdate, updateApp } = usePWA();

  if (!hasUpdate) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 bg-slate-900 border border-emerald-500/50 p-4 rounded-2xl shadow-2xl text-slate-100 flex items-center justify-between gap-3 animate-slideUp">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-slate-100">App Update Available</h4>
          <p className="text-[11px] text-slate-400">A new version of Expense Tracker is ready.</p>
        </div>
      </div>

      <button
        onClick={updateApp}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 shrink-0 transition-all"
      >
        <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Update</span>
      </button>
    </div>
  );
};
