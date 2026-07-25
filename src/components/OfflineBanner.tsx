import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { WifiOff, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOnline } = useExpense();

  if (isOnline) return null;

  return (
    <div className="bg-amber-950/90 border-b border-amber-800/80 px-4 py-2 text-amber-200 text-xs font-semibold flex items-center justify-center gap-2 shadow-inner">
      <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
      <span>Offline Mode Active. Expenses added now will save locally and auto-sync when reconnected.</span>
    </div>
  );
};
