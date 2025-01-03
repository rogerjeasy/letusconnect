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
    fromUid?: string;
    userId?: string;
  }[];
  onActionClick: (id: string, action: string) => void;
  onRefresh: () => void; 
}

const NotificationGroup: React.FC<NotificationGroupProps> = ({
  date,
  notifications,
  onActionClick,
  onRefresh
}) => {
  const [visibleCount, setVisibleCount] = useState(10);

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleSeeLess = () => {
    setVisibleCount((prev) => Math.max(10, prev - 10));
  };

  const createUniqueKey = (notification: NotificationGroupProps["notifications"][0], index: number) => {
    return `${date}_${notification.id}_${index}`;
  };

  const visibleNotifications = notifications.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Date Header with consistent spacing */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold text-gray-700">
          {date}
        </h1>
      </div>

      {/* Card Container with fixed width and spacing */}
      <div className="space-y-4">
        {visibleNotifications.map((notification, index) => {
          const uniqueKey = createUniqueKey(notification, index);
          return (
            <div key={uniqueKey} className="mx-auto">
              <NotificationCard
                id={notification.id} 
                title={notification.title}
                content={notification.content}
                type={notification.type}
                time={notification.time}
                priority={notification.priority}
                isRead={notification.isRead}
                fromUid={notification.userId}
                onActionClick={onActionClick}
                onReadStatusChange={onRefresh}
              />
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {(visibleCount > 10 || visibleCount < notifications.length) && (
        <div className="flex justify-center gap-4 mt-6 mb-8">
          {visibleCount > 10 && (
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              onClick={handleSeeLess}
            >
              Show Less
            </button>
          )}
          {visibleCount < notifications.length && (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={handleSeeMore}
            >
              Show More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationGroup;