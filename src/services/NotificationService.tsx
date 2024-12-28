"use client";

import React, { useEffect } from "react";
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

    // Subscribe to user-specific notifications for group messages
    const groupNotificationChannel = pusher?.subscribe(`user-notifications-new-msg-${currentUser.uid}`);
    groupNotificationChannel?.bind(
      "new-unread-message",
      (data: { groupChatId: string; senderName: string; content: string }) => {
        // Suppress notification if the user is currently viewing the group
        if (selectedEntity?.type === "group" && selectedEntity?.id === data.groupChatId) {
          return;
        }

        const groupName = entities.find((entity) => entity.id === data.groupChatId)?.name || "a group";
        toast.info(`New message from ${data.senderName} in ${groupName}`);
      }
    );

    // Subscribe to direct message notifications
    const directNotificationChannel = pusher?.subscribe(`user-notifications-direct-msg-${currentUser.uid}`);
    directNotificationChannel?.bind(
      "update-unread-count",
      (data: { senderId: string; senderName: string; content: string }) => {
        // Suppress notification if the user is currently viewing the direct chat
        if (selectedEntity?.type === "user" && selectedEntity?.id === data.senderId) {
          return;
        }

        toast.info(`New direct message from ${data.senderName}`);
      }
    );

    // Clean up subscriptions
    return () => {
      groupNotificationChannel?.unbind_all();
      pusher?.unsubscribe(`user-notifications-new-msg-${currentUser.uid}`);

      directNotificationChannel?.unbind_all();
      pusher?.unsubscribe(`user-notifications-direct-msg-${currentUser.uid}`);
    };
  }, [currentUser?.uid, entities, selectedEntity]);

  return <>{children}</>;
};

export default NotificationProvider;
