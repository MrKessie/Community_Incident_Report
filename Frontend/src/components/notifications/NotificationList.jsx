import React from 'react';
import NotificationItem from './NotificationItem';
import EmptyState from '../common/EmptyState';

export default function NotificationList({ notifications = [], onMarkRead, onDelete }) {
  if (notifications.length === 0) {
    return <EmptyState title="No notifications" description="You have no notifications at this time." />;
  }

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} onMarkRead={onMarkRead} onDelete={onDelete} />
      ))}
    </div>
  );
}
