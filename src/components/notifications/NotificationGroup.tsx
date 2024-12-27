"use client";

import React, { useState } from "react";
import NotificationCard from "./NotificationCard";

interface NotificationGroupProps {
  date: string;
  notifications: {
    id: string;
    title: string;
    content: string;
    type: string;
    time: string;
    priority: string;
    isRead: boolean;
  }[];
  onActionClick: (id: string, action: string) => void;
}

const NotificationGroup: React.FC<NotificationGroupProps> = ({ date, notifications, onActionClick }) => {
  const [visibleCount, setVisibleCount] = useState(10);

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleSeeLess = () => {
    setVisibleCount((prev) => Math.max(10, prev - 10)); 
  };

  const visibleNotifications = notifications.slice(0, visibleCount);

  return (
    <div className="flex flex-col items-center">
      <h4 className="text-lg font-bold text-gray-700 mb-4">{date}</h4>
      <div className="grid gap-6 sm:grid-cols-1">
        {visibleNotifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            {...notification}
            onActionClick={(id, action) => onActionClick(id, action)}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-4">
        {visibleCount > 10 && (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={handleSeeLess}
          >
            Load Less
          </button>
        )}
        {visibleCount < notifications.length && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleSeeMore}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationGroup;