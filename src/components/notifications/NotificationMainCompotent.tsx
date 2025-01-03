"use client";

import React, { useState, useEffect } from "react";
import SearchAndFilter from "@/components/notifications/SearchAndFilter";
import { 
  Notification, 
} from "@/store/notification";
import _ from "lodash";
import { Spinner } from "@nextui-org/react";
import SearchAndFilterSkeleton from "./SearchSkeletonNotification";
import { getTargetedNotifications } from "@/services/notification.service";

// Define the transformed notification type that includes 'time' instead of 'createdAt'
export interface TransformedNotification extends Omit<Notification, 'createdAt' | 'updatedAt' | 'readAt' | 'sentAt'> {
  time: string;
}

export type TransformedGroupedNotifications = {
  [date: string]: TransformedNotification[];
};

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastNotificationId, setLastNotificationId] = useState<string | undefined>();

  const fetchNotifications = async (isInitial: boolean = false) => {
    try {
      if (isInitial) {
        setInitialLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const fetchedNotifications = await getTargetedNotifications();

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
      setInitialLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications(true);
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-red-500">
          {error}
          <button 
            onClick={() => fetchNotifications(true)}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center">
        <SearchAndFilterSkeleton />
      </div>
    );
  }

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

  // NotificationsPage.tsx
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
  
    // Transform the notifications in each group and ensure unique keys
    return Object.entries(grouped).reduce((acc, [date, notifications]) => {
      // Sort notifications by createdAt
      const sortedNotifications = _.sortBy(notifications, 'createdAt').reverse();
      
      // Add the date prefix to make IDs unique across groups
      acc[date] = sortedNotifications.map(notification => ({
        ...transformNotification(notification),
        id: `${date}_${notification.id}` // Make ID unique by prefixing with date
      }));
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

  const handleActionClick = async (id: string, action: string) => {
    try {
      // Extract the original ID by removing the index suffix
      const originalId = id.split('_')[1];
      console.log("Action:", action, "for ID:", originalId);
      
      switch (action) {
        case "mark-as-read":
          // Use the original ID for API calls
          break;
        default:
          console.log("Unhandled action:", action);
      }
      
      await fetchNotifications(true);
    } catch (error) {
      console.error("Error handling action:", error);
    }
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
        onRefreshNotifications={fetchNotifications}
        isRefreshing={isRefreshing} 
      />
      {isRefreshing && (
        <div className="fixed bottom-4 right-4 bg-white p-2 rounded-full shadow-lg">
          <Spinner size="sm" />
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;