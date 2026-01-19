import { useState, useEffect } from 'react';

// Hook pour la gestion des notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const markAsRead = (notificationId: string) => {
    // Logique pour marquer comme lu
    console.log('Marking as read:', notificationId);
  };

  const markAllAsRead = () => {
    // Marquer toutes les notifications comme lues
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId: string) => {
    // Supprimer une notification
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
