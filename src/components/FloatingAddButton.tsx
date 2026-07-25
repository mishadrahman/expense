import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingAddButtonProps {
  onClick: () => void;
}

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 md:bottom-8 right-5 z-40 flex items-center gap-2 px-4 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all group border border-emerald-300/40"
      aria-label="Add Expense"
    >
      <Plus className="w-5 h-5 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
      <span className="hidden sm:inline">Add Expense</span>
    </button>
  );
};
