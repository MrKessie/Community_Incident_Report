import { useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { notificationsApi } from '../api/notifications';

export function useNotifications() {
  const { notifications, unreadCount, setNotifications, setUnreadCount, markAsRead: storeMarkAsRead, markAllAsRead: storeMarkAllAsRead } = useNotificationStore();

  const markAsRead = async (id) => {
    storeMarkAsRead(id);
    try {
      await notificationsApi.markAsRead(id);
    } catch (err) {
      console.warn('Failed to sync mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    storeMarkAllAsRead();
    try {
      await notificationsApi.markAllAsRead();
    } catch (err) {
      console.warn('Failed to sync mark all as read:', err);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationsApi.getNotifications();
        if (res.data.notifications) {
          setNotifications(res.data.notifications);
          setUnreadCount(res.data.unread_count);
        }
      } catch (err) {
        // Fallback silently if offline
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // 15s live polling
    return () => clearInterval(interval);
  }, [setNotifications, setUnreadCount]);

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}
