"use client";

import React, { useState, useEffect } from "react";
import SearchAndFilter from "@/components/notifications/SearchAndFilter";
import { handleFetchTargetedNotifications } from "@/components/notifications/HandleNotificationAPIs";
import { 
  Notification, 
} from "@/store/notification";
import _ from "lodash";

// Define the transformed notification type that includes 'time' instead of 'createdAt'
export interface TransformedNotification extends Omit<Notification, 'createdAt' | 'updatedAt' | 'readAt' | 'sentAt'> {
  time: string;
}

// Define types for grouped notifications
type GroupedNotifications = {
  [date: string]: Notification[];
};

export type TransformedGroupedNotifications = {
  [date: string]: TransformedNotification[];
};

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastNotificationId, setLastNotificationId] = useState<string | undefined>();
  
  const token = localStorage.getItem("token") || "";

  const fetchNotifications = async (isInitial: boolean = false) => {
    try {
      setLoading(true);
      const fetchedNotifications = await handleFetchTargetedNotifications(
        token,
        20,
        isInitial ? undefined : lastNotificationId
      );

      if (fetchedNotifications.length < 20) {
        setHasMore(false);
      }

      const newNotifications = isInitial 
        ? fetchedNotifications 
        : [...notifications, ...fetchedNotifications];

      setNotifications(newNotifications);
      setFilteredNotifications(newNotifications);

      if (fetchedNotifications.length > 0) {
        setLastNotificationId(fetchedNotifications[fetchedNotifications.length - 1].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(true);
  }, [token]);

  const transformNotification = (notification: Notification): TransformedNotification => ({
    id: notification.id,
    userId: notification.userId,
    actorId: notification.actorId,
    actorName: notification.actorName,
    actorType: notification.actorType,
    type: notification.type,
    title: notification.title,
    content: notification.content,
    category: notification.category,
    priority: notification.priority,
    status: notification.status,
    relatedEntities: notification.relatedEntities,
    metadata: notification.metadata,
    actions: notification.actions,
    isRead: notification.isRead,
    isArchived: notification.isArchived,
    isImportant: notification.isImportant,
    expiresAt: notification.expiresAt,
    time: new Date(notification.createdAt).toLocaleString(),
    source: notification.source,
    tags: notification.tags,
    groupId: notification.groupId,
    deliveryChannel: notification.deliveryChannel,
    targetedUsers: notification.targetedUsers
  });

  const groupNotificationsByDate = (notifs: Notification[]): TransformedGroupedNotifications => {
    const grouped = _.groupBy(notifs, (notification) => {
      const date = new Date(notification.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) return "Today";
      if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
      return "Earlier";
    });

    // Transform the notifications in each group
    return Object.entries(grouped).reduce((acc, [date, notifications]) => {
      acc[date] = notifications.map(transformNotification);
      return acc;
    }, {} as TransformedGroupedNotifications);
  };

  const handleSearch = (query: string) => {
    const filtered = notifications.filter(
      (notification) =>
        notification.title.toLowerCase().includes(query.toLowerCase()) ||
        notification.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredNotifications(filtered);
  };

  const handleFilterChange = (filter: { type: string; status: string }) => {
    const filtered = notifications.filter((notification) => {
      const typeMatch = filter.type === "all" || notification.type === filter.type;
      const statusMatch =
        filter.status === "all" ||
        (filter.status === "unread" && !notification.isRead) ||
        (filter.status === "read" && notification.isRead);
      return typeMatch && statusMatch;
    });
    setFilteredNotifications(filtered);
  };

  const handleSortChange = (sort: string) => {
    const sorted = [...filteredNotifications].sort((a, b) => {
      if (sort === "date") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sort === "priority") {
        const priorityOrder: { [key: string]: number } = { 
          urgent: 0, high: 1, normal: 2, low: 3 
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sort === "type") {
        return a.type.localeCompare(b.type);
      }
      return 0;
    });
    setFilteredNotifications(sorted);
  };

  const handleActionClick = (id: string, action: string) => {
    console.log("Action:", action, "for ID:", id);
    // Implement your action handling logic here
  };

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  return (
    <div className="p-6">
      <SearchAndFilter
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        groupedNotifications={groupedNotifications}
        onActionClick={handleActionClick}
      />
    </div>
  );
};

export default NotificationsPage;