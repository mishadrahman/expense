import React, { useState } from 'react';
import { usePWA } from '../context/PWAContext';
import { Download, ExternalLink, Share, PlusSquare, X, RefreshCw } from 'lucide-react';

export const InstallAppBanner: React.FC = () => {
  const { 
    isInstalled, 
    isStandalone, 
    isIframe, 
    isInstallable, 
    promptInstall, 
    isIOS, 
    isBannerDismissed, 
    dismissInstallBanner,
    hasUpdate,
    updateApp
  } = usePWA();
  
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  // If there is an update waiting, we should show this banner above everything else
  if (hasUpdate) {
    return (
      <div className="bg-blue-600 w-full z-40 relative animate-fadeIn">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer flex-1"
            onClick={() => updateApp()}
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4 text-white animate-spin-slow" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">App Update Available</p>
              <p className="text-blue-100 text-xs mt-0.5">Click here to update to the latest version</p>
            </div>
          </div>
          <button 
            onClick={() => updateApp()}
            className="text-white text-xs font-bold px-3 py-1.5 bg-blue-700/50 hover:bg-blue-700 rounded-lg whitespace-nowrap shadow-sm transition-colors"
          >
            Update Now
          </button>
        </div>
      </div>
    );
  }

  // Hide if already installed, running as native app, or dismissed
  if (isStandalone || isInstalled || isBannerDismissed) {
    return null;
  }

  const handleInstallClick = () => {
    if (isInstallable) {
      promptInstall();
    } else if (isIOS) {
      setShowIOSInstructions(true);
    }
  };

  // Only show the install modal if we can actually install, provide iOS instructions, or inside iframe
  if (!isInstallable && !isIOS && !isIframe) {
    return null;
  }

  return (
    <>
      {/* Top Banner Bar (Non-intrusive) */}
      {!showIOSInstructions && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/30 text-slate-100 w-full z-40 relative shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                <Download className="w-4 h-4 animate-bounce" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs sm:text-sm text-slate-100 truncate">
                  {isIframe ? 'Install Expense Tracker App' : 'Install App for Mobile & Desktop'}
                </p>
                <p className="text-[11px] text-slate-300 truncate hidden sm:block">
                  {isIframe
                    ? 'Open in a new tab to install as a native app with offline sync'
                    : 'Get instant access, full-screen experience & local notifications'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isIframe ? (
                <button
                  onClick={() => {
                    window.open(window.location.href, '_blank', 'noopener,noreferrer');
                    dismissInstallBanner();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Tab</span>
                </button>
              ) : (
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isIOS ? 'Install Info' : 'Install App'}</span>
                </button>
              )}

              <button
                onClick={dismissInstallBanner}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Dismiss"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 relative">
            <button 
              onClick={() => setShowIOSInstructions(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center space-y-4 mt-2">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <Download className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-xl text-slate-100">Install on iOS</h3>
              <p className="text-sm text-slate-400 leading-relaxed pb-2">
                Install this app on your iPhone or iPad for a full-screen, offline-ready experience.
              </p>
              
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-left space-y-5">
                <div className="flex items-start gap-3">
                  <div className="bg-slate-700 p-2 rounded-lg shrink-0 mt-0.5">
                    <Share className="w-4 h-4 text-slate-200" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">1. Tap Share</p>
                    <p className="text-xs text-slate-400 mt-1">Tap the share button at the bottom of your Safari browser.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-slate-700 p-2 rounded-lg shrink-0 mt-0.5">
                    <PlusSquare className="w-4 h-4 text-slate-200" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">2. Add to Home Screen</p>
                    <p className="text-xs text-slate-400 mt-1">Scroll down and tap "Add to Home Screen".</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowIOSInstructions(false)}
                className="w-full mt-6 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition-colors shadow-lg shadow-emerald-500/20"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

