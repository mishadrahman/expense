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
      {/* Install App Popup Modal */}
      {!showIOSInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 relative text-center">
            <button 
              onClick={(e) => { e.stopPropagation(); dismissInstallBanner(); }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <Download className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-100 mb-2">Install App</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {isIframe 
                ? 'Open the app in a new tab to install it as a native app and enable notifications.' 
                : 'Install Expense Tracker for a full-screen, offline-ready experience.'}
            </p>
            
            {isIframe ? (
              <button 
                onClick={() => {
                  window.open(window.location.href, '_blank', 'noopener,noreferrer');
                  dismissInstallBanner();
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-sm font-bold transition-colors shadow-lg shadow-indigo-500/20"
              >
                <ExternalLink className="w-4 h-4" /> Open in New Tab
              </button>
            ) : (
              <button 
                onClick={handleInstallClick}
                className="w-full px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition-colors shadow-lg shadow-emerald-500/20"
              >
                {isIOS ? 'View Install Instructions' : 'Install Now'}
              </button>
            )}
            
            <button
              onClick={dismissInstallBanner}
              className="w-full mt-3 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold transition-colors"
            >
              Maybe Later
            </button>
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

