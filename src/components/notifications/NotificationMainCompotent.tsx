"use client";

import React, { useState, useEffect } from "react";
import SearchAndFilter from "@/components/notifications/SearchAndFilter";
import NotificationGroup from "@/components/notifications/NotificationGroup";
import { handleFetchTargetedNotifications } from "@/components/notifications/HandleNotificationAPIs";
import { Notification } from "@/store/notification";
import { Spinner } from "@nextui-org/react";
import _ from "lodash";

type GroupedNotifications = {
  [date: string]: Notification[];
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

  const groupNotificationsByDate = (notifs: Notification[]): GroupedNotifications => {
    return _.groupBy(notifs, (notification) => {
      const date = new Date(notification.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) return "Today";
      if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
      return "Earlier";
    });
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

  // Transform notifications for the NotificationGroup component
  const transformNotification = (notification: Notification) => ({
    id: notification.id,
    title: notification.title,
    content: notification.content,
    type: notification.type,
    time: new Date(notification.createdAt).toLocaleString(),
    priority: notification.priority,
    isRead: notification.isRead
  });

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  return (
    <div className="p-6">
      <SearchAndFilter
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      <div>
        {/* <h1 className="text-2xl font-bold mb-6">Notifications</h1> */}
        
        {error && (
          <div className="text-red-500 text-center p-4">
            {error}
          </div>
        )}

        {Object.entries(groupedNotifications).map(([date, notifications]) => (
          <div key={date} className="mt-6">
            <NotificationGroup
              date={date}
              notifications={notifications.map(transformNotification)}
              onActionClick={handleActionClick}
            />
          </div>
        ))}

        {loading && (
          <div className="flex justify-center p-4">
            <Spinner size="lg" />
          </div>
        )}

        {!loading && hasMore && notifications.length > 0 && (
          <div className="flex justify-center mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => fetchNotifications()}
            >
              Load More
            </button>
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="text-center text-gray-500 p-8">
            No notifications to display
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;