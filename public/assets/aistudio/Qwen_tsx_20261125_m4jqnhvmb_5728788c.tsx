// src/components/NotificationSystem.tsx
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// --- Types ---
type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // en ms, 0 pour persistant
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

// --- Contexte ---
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    setNotifications((prev) => [...prev, newNotification]);

    // Auto-suppression après la durée définie
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification doit être utilisé dans un NotificationProvider');
  return context;
};

// --- Conteneur d'affichage ---
const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} onClose={() => removeNotification(notification.id)} />
      ))}
    </div>
  );
};

// --- Carte de notification ---
const NotificationCard: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
  const icons = {
    success: '✅',
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
  };

  const styles = {
    success: 'bg-klt-teal-50 border-klt-teal-500 text-klt-teal-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800',
    warning: 'bg-klt-gold-50 border-klt-gold-500 text-klt-gold-800',
    error: 'bg-red-50 border-red-500 text-red-800',
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 shadow-lg flex items-start gap-3 ${styles[notification.type]}`}>
      <span className="text-xl">{icons[notification.type]}</span>
      <div className="flex-1">
        <h4 className="font-bold text-sm">{notification.title}</h4>
        <p className="text-xs mt-1 opacity-90">{notification.message}</p>
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg leading-none">
        ×
      </button>
    </div>
  );
};

// --- Hook personnalisé pour surveiller la migration Raydium ---
export const useRaydiumMigrationWatcher = () => {
  const { addNotification } = useNotification();
  const [isMigrated, setIsMigrated] = useState(false);

  useEffect(() => {
    // Simule la vérification de la migration (à remplacer par un appel API réel)
    const checkMigration = async () => {
      try {
        // Exemple : fetch('/api/pumpfun/status')
        // const response = await fetch(...);
        // const data = await response.json();
        // if (data.migrated && !isMigrated) { ... }
        
        // Pour la démo, on simule un événement après 10 secondes
        setTimeout(() => {
          if (!isMigrated) {
            setIsMigrated(true);
            addNotification({
              type: 'success',
              title: '🎉 Migration Raydium Complétée !',
              message: 'La bonding curve a atteint 85 SOL. Le module de Staking 15% APY est maintenant débloqué.',
              duration: 10000,
            });
          }
        }, 10000);
      } catch (error) {
        console.error('Erreur de vérification de la migration:', error);
      }
    };

    checkMigration();
    const interval = setInterval(checkMigration, 30000); // Vérifie toutes les 30s

    return () => clearInterval(interval);
  }, [isMigrated, addNotification]);

  return { isMigrated };
};