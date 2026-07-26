import React from 'react';
import { usePWA } from '../context/PWAContext';
import { X, Zap, WifiOff, ExternalLink } from 'lucide-react';
import { InstallButton } from './InstallButton';

export const InstallAppBanner: React.FC = () => {
  const { isInstalled, isStandalone, isIframe, dismissInstallBanner, isBannerDismissed } = usePWA();

  // Hide if already installed, in standalone mode, or dismissed
  if (isStandalone || isInstalled || isBannerDismissed) {
    return null;
  }

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/80 border-b border-emerald-500/30 px-4 py-2.5 text-slate-100 shadow-xl relative z-40 animate-fadeIn">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left: App Icon & Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-900/40 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <img src="/icon-192.png" alt="Tracker Icon" className="w-5 h-5 rounded-lg object-cover" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-100 leading-tight">
                Install Expense Tracker App
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                PWA Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-300 flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400 inline" /> Standalone Mobile App
              </span>
              <span className="flex items-center gap-1">
                <WifiOff className="w-3 h-3 text-teal-400 inline" /> Offline Access
              </span>
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {isIframe ? (
            <button
              onClick={handleOpenNewTab}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              title="Open in new browser tab to trigger native Install App prompt"
            >
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>নতুন ট্যাবে খুলুন ও ইনস্টল করুন</span>
            </button>
          ) : (
            <InstallButton variant="compact" />
          )}

          <button
            onClick={dismissInstallBanner}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

