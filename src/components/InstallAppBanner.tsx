import React from 'react';
import { usePWA } from '../context/PWAContext';
import { Download, ExternalLink } from 'lucide-react';

export const InstallAppBanner: React.FC = () => {
  const { isInstalled, isStandalone, isIframe, isInstallable, promptInstall } = usePWA();

  // Hide if already installed or running as a native app
  if (isStandalone || isInstalled) {
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

  const handleInstallClick = () => {
    if (isInstallable) {
      promptInstall();
    } else {
      alert("Browser is preparing the install option. Please interact with the app for a few seconds or use the browser's menu to 'Add to Home screen'.");
    }
  };

  return (
    <div 
      onClick={handleInstallClick}
      className="bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer w-full z-50 relative animate-fadeIn"
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
            <Download className="w-4 h-4 text-white animate-bounce" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Install Expense Tracker</p>
            <p className="text-emerald-100 text-xs mt-0.5">Click here to install directly to your device</p>
          </div>
        </div>
        <span className="text-white text-xs font-bold px-3 py-1.5 bg-emerald-700/50 rounded-lg whitespace-nowrap shadow-sm">
          Install
        </span>
      </div>
    </div>
  );
};

