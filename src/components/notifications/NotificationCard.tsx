"use client";
import React, { useState } from "react";
import { Badge, Card, Divider, Avatar } from "@nextui-org/react";
import { FaEnvelope, FaCalendar, FaBell, FaExclamation, FaCog } from "react-icons/fa";
import NotificationModalPopup from "@/components/notifications/NotificationModalPopup";
import { handleMarkNotificationAsRead } from "./HandleNotificationAPIs";

interface NotificationCardProps {
  id: string;
  title: string;
  content: string;
  type: string;
  time: string;
  priority: string;
  isRead: boolean;
  token: string; 
  onActionClick: (id: string, action: string) => void;
  onReadStatusChange?: () => void; 
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  id,
  title,
  content,
  type,
  time,
  priority,
  isRead,
  token,
  onActionClick,
  onReadStatusChange,
}) => {
  const [read, setRead] = useState(isRead);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getOriginalId = (compositeId: string): string => {
    const parts = compositeId.split('_');
    return parts.length > 1 ? parts.slice(1).join('_') : compositeId;
  };

  const handleCardClick = async () => {
    if (!read && !isLoading) {
      setIsLoading(true);
      try {
        const originalId = getOriginalId(id);
        
        await handleMarkNotificationAsRead(token, originalId);
        setRead(true);
        // onActionClick(originalId, "mark-as-read");
        // onReadStatusChange?.();
      } catch (error) {
        // Error is already handled by handleMarkNotificationAsRead
        console.error("Failed to mark notification as read:", error);
      } finally {
        setIsLoading(false);
      }
    }
    setModalOpen(true);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "message":
        return <FaEnvelope className="text-blue-500" />;
      case "event":
        return <FaCalendar className="text-green-500" />;
      case "reminder":
        return <FaBell className="text-yellow-500" />;
      case "system":
        return <FaCog className="text-gray-500" />;
      case "custom":
        return <FaExclamation className="text-red-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const notification = {
    id: getOriginalId(id),
    title,
    content,
    type,
    time,
    priority,
  };

  return (
    <>
      <div onClick={handleCardClick} className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card
          isHoverable
          className={`shadow-md border transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl ${
            read ? "bg-white" : "bg-green-100"
          } hover:border-blue-200 hover:-translate-y-1`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
            {/* Icon Section */}
            <Avatar
              icon={getIconForType(type)}
              size="lg"
              className="flex-shrink-0 bg-gray-100 text-center p-2 rounded-full text-2xl self-center sm:self-start transition-transform duration-300 hover:rotate-12"
            />
           
            {/* Content Section */}
            <div className="flex flex-col flex-grow w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                <h3 className="font-bold text-base sm:text-lg md:text-xl line-clamp-1">
                  {title}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <Badge color={read ? "success" : "danger"} size="sm">
                    {read ? "Read" : "Unread"}
                  </Badge>
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-600 line-clamp-2 mt-1">
                {content}
              </p>
            </div>
          </div>

          <Divider className="my-2" />

          {/* Footer Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-4">
            <p className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
              {time}
            </p>
            <Badge
              className="order-1 sm:order-2"
              color={
                priority === "High"
                  ? "danger"
                  : priority === "Medium"
                  ? "warning"
                  : "success"
              }
            >
              {priority}
            </Badge>
          </div>
        </Card>
      </div>

      <NotificationModalPopup
        isOpen={modalOpen}
        notification={notification}
        onClose={() => setModalOpen(false)}
        onAction={(actionId, action) => onActionClick(getOriginalId(actionId), action)}
      />
    </>
  );
};

export default NotificationCard;