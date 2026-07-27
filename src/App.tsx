import React, { useState } from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import { Header } from './components/Header';
import { OfflineBanner } from './components/OfflineBanner';
import { InstallAppBanner } from './components/InstallAppBanner';
import { UpdateBanner } from './components/UpdateBanner';
import { NavigationTabs, TabType } from './components/NavigationTabs';
import { DashboardView } from './components/DashboardView';
import { ExpenseListView } from './components/ExpenseListView';
import { CategoryView } from './components/CategoryView';
import { SettingsView } from './components/SettingsView';
import { FloatingAddButton } from './components/FloatingAddButton';
import { ExpenseModal } from './components/ExpenseModal';
import { AuthModal } from './components/AuthModal';
import { Expense } from './types';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Clean up ?refresh= URL parameter if present (after clear cache reload)
  React.useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('refresh')) {
      url.searchParams.delete('refresh');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (exp: Expense) => {
    setEditingExpense(exp);
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Offline Alert Banner */}
      <OfflineBanner />

      {/* PWA Install Promo Banner */}
      <InstallAppBanner />

      {/* Top Header */}
      <Header onOpenSettings={() => setActiveTab('settings')} />

      {/* Navigation Tabs Bar (Desktop Header / Mobile Bottom) */}
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Screen Content View */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenAddModal={handleOpenAddModal}
            onEditExpense={handleOpenEditModal}
            onNavigateToExpenses={() => setActiveTab('expenses')}
          />
        )}
        {activeTab === 'expenses' && (
          <ExpenseListView
            onOpenAddModal={handleOpenAddModal}
            onEditExpense={handleOpenEditModal}
          />
        )}
        {activeTab === 'categories' && <CategoryView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Floating Add Expense Quick Button */}
      <FloatingAddButton onClick={handleOpenAddModal} />

      {/* Service Worker Update Alert Toast */}
      <UpdateBanner />

      {/* Add / Edit Expense Modal */}
      <ExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingExpense(null);
        }}
        editExpense={editingExpense}
      />

      {/* Auth Modal for Email/Password & Google Sign In */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}
