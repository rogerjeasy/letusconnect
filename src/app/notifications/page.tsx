"use client";

import React, { useState } from "react";
import SearchAndFilter from "@/components/notifications/SearchAndFilter";
import NotificationGroup from "@/components/notifications/NotificationGroup";
import { dummyNotifications, Notification } from "@/store/notification";

type GroupedNotifications = {
  [date: string]: Notification[];
};

const groupNotificationsByDate = (notifications: Notification[]): GroupedNotifications => {
  const grouped: GroupedNotifications = {};
  const today = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  notifications.forEach((notification) => {
    const notificationDate = new Date(notification.time).toDateString();
    let group = "";

    if (notificationDate === today) {
      group = "Today";
    } else if (notificationDate === yesterday.toDateString()) {
      group = "Yesterday";
    } else {
      group = "Earlier";
    }

    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group].push(notification);
  });

  return grouped;
};

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<GroupedNotifications>(groupNotificationsByDate(dummyNotifications));

  const handleSearch = (query: string) => {
    const filteredNotifications: GroupedNotifications = {};
    Object.entries(groupNotificationsByDate(dummyNotifications)).forEach(([date, notifications]) => {
      filteredNotifications[date] = notifications.filter(
        (notification) =>
          notification.title.toLowerCase().includes(query.toLowerCase()) ||
          notification.content.toLowerCase().includes(query.toLowerCase())
      );
    });
    setNotifications(filteredNotifications);
  };

  const handleFilterChange = (filter: { type: string; status: string }) => {
    const filteredNotifications: GroupedNotifications = {};
    Object.entries(groupNotificationsByDate(dummyNotifications)).forEach(([date, notifications]) => {
      filteredNotifications[date] = notifications.filter((notification) => {
        const typeMatch = filter.type === "all" || notification.type === filter.type;
        const statusMatch =
          filter.status === "all" ||
          (filter.status === "unread" && !notification.isRead) ||
          (filter.status === "read" && notification.isRead);
        return typeMatch && statusMatch;
      });
    });
    setNotifications(filteredNotifications);
  };

  const handleSortChange = (sort: string) => {
    const sortedNotifications: GroupedNotifications = {};
    Object.entries(notifications).forEach(([date, notifications]) => {
      sortedNotifications[date] = [...notifications].sort((a, b) => {
        if (sort === "date") {
          return new Date(b.time).getTime() - new Date(a.time).getTime();
        }
        if (sort === "priority") {
          const priorityOrder: { [key: string]: number } = { High: 1, Medium: 2, Low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        if (sort === "type") {
          return a.type.localeCompare(b.type);
        }
        return 0;
      });
    });
    setNotifications(sortedNotifications);
  };

  const handleActionClick = (id: string, action: string) => {
    console.log("Action:", action, "for ID:", id);
  };

  return (
    <div className="p-6">
      {/* <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=1600&q=80')" }}
      ></div> */}
      {/* Overlay for Readability */}
      {/* <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-0"></div> */}
      <SearchAndFilter
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      <div className="mt-6">
        {Object.entries(notifications).map(([date, notifications]) => (
          <NotificationGroup
            key={date}
            date={date}
            notifications={notifications}
            onActionClick={handleActionClick}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;