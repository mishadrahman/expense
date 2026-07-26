import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { Expense, Category, UserSettings, DEFAULT_CATEGORIES, BANGLE_REMINDER_MESSAGES, ENGLISH_REMINDER_MESSAGES } from '../types';

interface ExpenseContextType {
  user: User | null;
  isAuthLoading: boolean;
  isOnline: boolean;
  expenses: Expense[];
  categories: Category[];
  settings: UserSettings;
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Omit<Expense, 'id' | 'userId' | 'createdAt'>>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  // Notification & PWA
  notificationPermission: NotificationPermission;
  requestNotificationPermission: () => Promise<boolean>;
  sendTestNotification: () => void;
  deferredPrompt: any;
  installApp: () => void;
  isStandalone: boolean;
  isInIframe: boolean;
  clearCacheAndReload: () => Promise<void>;
}

const DEFAULT_SETTINGS: UserSettings = {
  monthlyBudget: 25000,
  currency: '৳',
  notificationsEnabled: true,
  reminderTimes: ['09:00', '14:00', '21:00'],
  reminderLanguage: 'bn',
};

const ExpenseContext = createContext<ExpenseContextType | null>(null);

const STORAGE_EXPENSES_KEY = 'expensetracker_local_expenses';
const STORAGE_CATEGORIES_KEY = 'expensetracker_local_categories';
const STORAGE_SETTINGS_KEY = 'expensetracker_local_settings';

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://')
      );
    }
    return false;
  });
  const [isInIframe] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.self !== window.top;
    }
    return false;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Monitor network online/offline state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Listen for PWA beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const installApp = useCallback(() => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  }, [deferredPrompt]);

  const clearCacheAndReload = useCallback(async () => {
    try {
      // Unregister Service Workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }
      // Delete Cache Storage
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      // Clear session storage
      sessionStorage.clear();
      
      // Hard refresh with query parameter to bypass cache
      const freshUrl = window.location.origin + window.location.pathname + '?refresh=' + Date.now();
      window.location.href = freshUrl;
    } catch (err) {
      console.error('Error clearing cache:', err);
      window.location.reload();
    }
  }, []);

  // Handle Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load guest local state from localStorage when not signed in
  const loadLocalState = useCallback(() => {
    try {
      const storedExp = localStorage.getItem(STORAGE_EXPENSES_KEY);
      if (storedExp) {
        setExpenses(JSON.parse(storedExp));
      }
      const storedCat = localStorage.getItem(STORAGE_CATEGORIES_KEY);
      if (storedCat) {
        setCategories(JSON.parse(storedCat));
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }
      const storedSet = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (storedSet) {
        setSettings(JSON.parse(storedSet));
      }
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
  }, []);

  // Save guest local state
  const saveLocalExpenses = (data: Expense[]) => {
    setExpenses(data);
    localStorage.setItem(STORAGE_EXPENSES_KEY, JSON.stringify(data));
  };
  const saveLocalCategories = (data: Category[]) => {
    setCategories(data);
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(data));
  };
  const saveLocalSettings = (data: UserSettings) => {
    setSettings(data);
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(data));
  };

  // Sync data with Firestore when user is logged in
  useEffect(() => {
    if (!user) {
      loadLocalState();
      return;
    }

    // 1. Sync Expenses
    const expensesRef = collection(db, 'users', user.uid, 'expenses');
    const qExpenses = query(expensesRef, orderBy('date', 'desc'));

    const unsubExpenses = onSnapshot(
      qExpenses,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedExpenses: Expense[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Expense[];
          setExpenses(loadedExpenses);
        } else {
          // Check if there are local guest expenses to backup to Firestore
          try {
            const storedLocalExp = localStorage.getItem(STORAGE_EXPENSES_KEY);
            if (storedLocalExp) {
              const localExps: Expense[] = JSON.parse(storedLocalExp);
              if (localExps.length > 0) {
                console.log('[Firestore Sync] Migrating guest local expenses to user cloud backup...');
                localExps.forEach(async (exp) => {
                  try {
                    await setDoc(doc(db, 'users', user.uid, 'expenses', exp.id), {
                      ...exp,
                      userId: user.uid,
                    });
                  } catch (e) {
                    console.error('Failed to backup guest expense:', e);
                  }
                });
                setExpenses(localExps);
              } else {
                setExpenses([]);
              }
            } else {
              setExpenses([]);
            }
          } catch (e) {
            setExpenses([]);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/expenses`);
      }
    );

    // 2. Sync Categories
    const categoriesRef = collection(db, 'users', user.uid, 'categories');
    const unsubCategories = onSnapshot(
      categoriesRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedCats: Category[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Category[];
          setCategories(loadedCats);
        } else {
          // Initialize user categories with default if empty
          DEFAULT_CATEGORIES.forEach(async (cat) => {
            try {
              await setDoc(doc(db, 'users', user.uid, 'categories', cat.id), cat);
            } catch (err) {
              console.error('Failed to init default category', err);
            }
          });
          setCategories(DEFAULT_CATEGORIES);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/categories`);
      }
    );

    // 3. Sync Settings
    const settingsDocRef = doc(db, 'users', user.uid, 'settings', 'user_config');
    const unsubSettings = onSnapshot(
      settingsDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data() as UserSettings);
        } else {
          setDoc(settingsDocRef, DEFAULT_SETTINGS).catch((err) => {
            console.error('Failed to init user settings', err);
          });
          setSettings(DEFAULT_SETTINGS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}/settings/user_config`);
      }
    );

    return () => {
      unsubExpenses();
      unsubCategories();
      unsubSettings();
    };
  }, [user, loadLocalState]);

  // Add Expense
  const addExpense = async (data: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => {
    const id = 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const newExpense: Expense = {
      ...data,
      id,
      userId: user ? user.uid : 'guest',
      createdAt: Date.now(),
    };

    if (user) {
      const path = `users/${user.uid}/expenses/${id}`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'expenses', id), newExpense);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else {
      saveLocalExpenses([newExpense, ...expenses]);
    }
  };

  // Update Expense
  const updateExpense = async (id: string, updatedData: Partial<Omit<Expense, 'id' | 'userId' | 'createdAt'>>) => {
    if (user) {
      const path = `users/${user.uid}/expenses/${id}`;
      try {
        await updateDoc(doc(db, 'users', user.uid, 'expenses', id), updatedData);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      const updated = expenses.map((e) => (e.id === id ? { ...e, ...updatedData } : e));
      saveLocalExpenses(updated);
    }
  };

  // Delete Expense
  const deleteExpense = async (id: string) => {
    if (user) {
      const path = `users/${user.uid}/expenses/${id}`;
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'expenses', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    } else {
      const updated = expenses.filter((e) => e.id !== id);
      saveLocalExpenses(updated);
    }
  };

  // Category CRUD
  const addCategory = async (data: Omit<Category, 'id'>) => {
    const id = 'cat_' + Date.now();
    const newCategory: Category = {
      ...data,
      id,
      userId: user ? user.uid : 'guest',
    };

    if (user) {
      const path = `users/${user.uid}/categories/${id}`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'categories', id), newCategory);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else {
      saveLocalCategories([...categories, newCategory]);
    }
  };

  const updateCategory = async (id: string, updatedData: Partial<Category>) => {
    if (user) {
      const path = `users/${user.uid}/categories/${id}`;
      try {
        await updateDoc(doc(db, 'users', user.uid, 'categories', id), updatedData);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      const updated = categories.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
      saveLocalCategories(updated);
    }
  };

  const deleteCategory = async (id: string) => {
    if (user) {
      const path = `users/${user.uid}/categories/${id}`;
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'categories', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    } else {
      const updated = categories.filter((c) => c.id !== id);
      saveLocalCategories(updated);
    }
  };

  // Update Settings
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    if (user) {
      const path = `users/${user.uid}/settings/user_config`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'settings', 'user_config'), updated);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else {
      saveLocalSettings(updated);
    }
  };

  // Auth Methods
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsAuthModalOpen(false);
    } catch (e) {
      console.error('Google Sign In error:', e);
      alert('Sign in failed: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setIsAuthModalOpen(false);
    } catch (e) {
      console.error('Email Sign In error:', e);
      throw e;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      if (userCred.user && name) {
        await updateProfile(userCred.user, { displayName: name });
      }
      setIsAuthModalOpen(false);
    } catch (e) {
      console.error('Email Sign Up error:', e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Sign Out error:', e);
    }
  };

  // Notification API & Local Reminder System
  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return false;
    }
    const perm = await Notification.requestPermission();
    setNotificationPermission(perm);
    return perm === 'granted';
  };

  const sendTestNotification = () => {
    if (notificationPermission !== 'granted') {
      alert('Please allow notification permission first.');
      return;
    }

    const messages = settings.reminderLanguage === 'bn' ? BANGLE_REMINDER_MESSAGES : ENGLISH_REMINDER_MESSAGES;
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_LOCAL_NOTIFICATION',
        title: settings.reminderLanguage === 'bn' ? 'ব্যয় রিমাইন্ডার 💰' : 'Expense Reminder 💰',
        body: randomMsg,
      });
    } else {
      new Notification(settings.reminderLanguage === 'bn' ? 'ব্যয় রিমাইন্ডার 💰' : 'Expense Reminder 💰', {
        body: randomMsg,
        icon: '/favicon.ico',
      });
    }
  };

  // Local Daily Scheduled Reminders Timer (checks time every minute)
  useEffect(() => {
    if (!settings.notificationsEnabled || notificationPermission !== 'granted') return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      if (settings.reminderTimes.includes(currentHHMM)) {
        const messages = settings.reminderLanguage === 'bn' ? BANGLE_REMINDER_MESSAGES : ENGLISH_REMINDER_MESSAGES;
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];

        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_LOCAL_NOTIFICATION',
            title: settings.reminderLanguage === 'bn' ? 'দৈনিক ব্যয়ের হিসাব 📝' : 'Daily Expense Check 📝',
            body: randomMsg,
          });
        } else {
          new Notification(settings.reminderLanguage === 'bn' ? 'দৈনিক ব্যয়ের হিসাব 📝' : 'Daily Expense Check 📝', {
            body: randomMsg,
            icon: '/favicon.ico',
          });
        }
      }
    }, 60000); // Check every 60s

    return () => clearInterval(interval);
  }, [settings.notificationsEnabled, settings.reminderTimes, settings.reminderLanguage, notificationPermission]);

  return (
    <ExpenseContext.Provider
      value={{
        user,
        isAuthLoading,
        isOnline,
        expenses,
        categories,
        settings,
        addExpense,
        updateExpense,
        deleteExpense,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSettings,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        notificationPermission,
        requestNotificationPermission,
        sendTestNotification,
        deferredPrompt,
        installApp,
        isStandalone,
        isInIframe,
        clearCacheAndReload,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
