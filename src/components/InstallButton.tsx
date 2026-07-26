import React, { useState } from 'react';
import { usePWA } from '../context/PWAContext';
import { Download, Smartphone, CheckCircle2, Share, X, ExternalLink, Monitor, Info, Check } from 'lucide-react';

interface InstallButtonProps {
  variant?: 'header' | 'settings' | 'banner' | 'compact';
  className?: string;
}

export const InstallButton: React.FC<InstallButtonProps> = ({ variant = 'header', className = '' }) => {
  const { isInstallable, isInstalled, isStandalone, isIOS, isIframe, promptInstall } = usePWA();
  const [showModal, setShowModal] = useState(false);
  const [activeInstructionTab, setActiveInstructionTab] = useState<'android' | 'ios' | 'desktop'>('android');

  const handleClick = async () => {
    // If native browser prompt is available and not inside iframe, trigger native prompt directly
    if (isInstallable && !isIframe) {
      const success = await promptInstall();
      if (!success) {
        setShowModal(true);
      }
      return;
    }

    // Otherwise show the helpful installation guidance modal
    setShowModal(true);
  };

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank', 'noopener,noreferrer');
  };

  // If app is running as standalone app, show compact installed status
  if (isStandalone || isInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>App Installed & Running in Standalone Native Mode</span>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      {/* Header/Compact Variant */}
      {(variant === 'header' || variant === 'compact') && (
        <button
          onClick={handleClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold shadow-md shadow-emerald-500/20 active:scale-95 transition-all ${className}`}
          title="Install Expense Tracker as a real app on your home screen"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Install App</span>
        </button>
      )}

      {/* Settings Variant */}
      {variant === 'settings' && (
        <button
          onClick={handleClick}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 ${className}`}
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Install Expense Tracker App</span>
        </button>
      )}

      {/* Comprehensive Installation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <img src="/icon-192.png" alt="App Icon" className="w-7 h-7 rounded-lg object-cover" />
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-100">Install Expense Tracker</h3>
                <p className="text-xs text-emerald-400 font-semibold">Standalone PWA Mobile & Desktop App</p>
              </div>
            </div>

            {/* Iframe Warning / Direct Open Action */}
            {isIframe && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 text-xs text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Preview iFrame Detected</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-200/90">
                  Browsers block native PWA prompts inside preview frames. Open the app in a direct tab to install with 1 click:
                </p>
                <button
                  onClick={handleOpenNewTab}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all"
                >
                  <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                  <span>Open App in New Tab to Install</span>
                </button>
              </div>
            )}

            {/* Platform Selector Tabs */}
            <div className="space-y-3">
              <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveInstructionTab('android')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeInstructionTab === 'android'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Android / Chrome</span>
                </button>

                <button
                  onClick={() => setActiveInstructionTab('ios')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeInstructionTab === 'ios'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Share className="w-3.5 h-3.5" />
                  <span>iOS (iPhone)</span>
                </button>

                <button
                  onClick={() => setActiveInstructionTab('desktop')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeInstructionTab === 'desktop'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
              </div>

              {/* Step instructions per tab */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 space-y-3">
                {activeInstructionTab === 'android' && (
                  <>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Open the app in Chrome browser on your Android device.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        Tap the <strong>3-dots menu (⋮)</strong> at top right corner.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        Select <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.
                      </span>
                    </div>
                  </>
                )}

                {activeInstructionTab === 'ios' && (
                  <>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Open the app in <strong>Safari</strong> browser on your iPhone/iPad.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline text-sky-400 mx-1" /> in bottom navigation bar.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        Scroll down and tap <strong>"Add to Home Screen"</strong>.
                      </span>
                    </div>
                  </>
                )}

                {activeInstructionTab === 'desktop' && (
                  <>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Open the app in <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        Click the <strong>Install Icon (📥)</strong> in the right side of the address bar.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        Click <strong>Install</strong> to launch as a desktop app.
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* PWA Technical Specs Checklist */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 text-[11px] text-slate-400 space-y-1.5">
              <span className="font-bold text-slate-300 block">PWA Capabilities Enabled:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-3 h-3 stroke-[3]" /> Service Worker Cache
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-3 h-3 stroke-[3]" /> Standalone Display
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-3 h-3 stroke-[3]" /> Manifest 192/512
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-3 h-3 stroke-[3]" /> Maskable & Offline
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleOpenNewTab}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Open Direct App Link</span>
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
