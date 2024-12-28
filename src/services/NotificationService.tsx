"use client";

import React, { useEffect } from 'react';
import { getPusherInstance } from "@/helpers/pusher";
import { toast } from "react-toastify";
import { useUserStore } from "@/store/userStore";
import { useChatEntitiesStore } from "@/store/chatEntitiesStore";

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUser = useUserStore((state) => state.user);
  const entities = useChatEntitiesStore((state) => state.entities);
  const selectedEntity = useChatEntitiesStore((state) => state.selectedEntity);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const pusher = getPusherInstance();
    
    // Subscribe to user-specific notifications
    const userNotificationChannel = pusher?.subscribe(`user-notifications-new-msg-${currentUser.uid}`);
    
    userNotificationChannel?.bind(
      "new-unread-message",
      (data: { 
        groupChatId: string; 
        senderName: string; 
        content: string; 
        messageId: string 
      }) => {
        // Don't show notification if this group is currently selected
        if (selectedEntity?.id === data.groupChatId) {
          return;
        }

        const groupName = entities.find((entity) => entity.id === data.groupChatId)?.name || "a group";
        toast.info(`New message from ${data.senderName} in ${groupName}`);
      }
    );

    return () => {
      userNotificationChannel?.unbind_all();
      pusher?.unsubscribe(`user-notifications-new-msg-${currentUser.uid}`);
    };
  }, [currentUser?.uid, entities, selectedEntity]);

  return <>{children}</>;
};

export default NotificationProvider;