import React, { useState } from 'react';
import { usePWA } from '../context/PWAContext';
import { Download, ExternalLink, Share, PlusSquare, X } from 'lucide-react';

export const InstallAppBanner: React.FC = () => {
  const { 
    isInstalled, 
    isStandalone, 
    isIframe, 
    isInstallable, 
    promptInstall, 
    isIOS, 
    isBannerDismissed, 
    dismissInstallBanner 
  } = usePWA();
  
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  // Hide if already installed, running as native app, or dismissed
  if (isStandalone || isInstalled || isBannerDismissed) {
    return null;
  }

  // Inside iframe (AI Studio preview), beforeinstallprompt doesn't fire natively.
  // We prompt the user to open in a new tab first.
  if (isIframe) {
    return (
      <div 
        onClick={() => window.open(window.location.href, '_blank', 'noopener,noreferrer')}
        className="bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer w-full z-50 relative"
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
              <ExternalLink className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">Install App</p>
              <p className="text-indigo-100 text-xs mt-0.5">Open in a new tab to install as a native app</p>
            </div>
          </div>
          <span className="text-white text-xs font-bold px-3 py-1.5 bg-indigo-700/50 rounded-lg">Open</span>
        </div>
      </div>
    );
  }

  // Only show banner if we can actually install (Android/Desktop) or provide iOS instructions
  if (!isInstallable && !isIOS) {
    return null;
  }

  const handleInstallClick = () => {
    if (isInstallable) {
      promptInstall();
    } else if (isIOS) {
      setShowIOSInstructions(true);
    }
  };

  return (
    <>
      <div className="bg-emerald-600 w-full z-40 relative animate-fadeIn">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer flex-1"
            onClick={handleInstallClick}
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
              <Download className="w-4 h-4 text-white animate-bounce" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">Install Expense Tracker</p>
              <p className="text-emerald-100 text-xs mt-0.5">
                {isIOS ? 'Tap here for iOS install instructions' : 'Click here to install directly to your device'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleInstallClick}
              className="text-white text-xs font-bold px-3 py-1.5 bg-emerald-700/50 hover:bg-emerald-700 rounded-lg whitespace-nowrap shadow-sm transition-colors"
            >
              Install
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); dismissInstallBanner(); }}
              className="p-1.5 text-emerald-100 hover:bg-emerald-700 hover:text-white rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

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

