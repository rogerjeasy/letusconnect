import { useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import { getUnreadDirectMessageCount } from "@/services/message.service";
import { getGroupUnreadCount } from "@/services/groupchat.service";

// Type definitions
interface UnreadCounts {
  direct: number;
  group: number;
  total: number;
}

interface ChatMessage {
  senderId: string;
  receiverId: string;
}

interface GroupChat {
  id: string;
}

interface UnreadCountsReturn {
  getUnreadCount: (chatId: string, type: 'direct' | 'group') => number;
  totalUnreadCounts: UnreadCounts;
  isLoading: boolean;
  directUnreadCounts: Record<string, number>;
  groupUnreadCounts: Record<string, number>;
}

/**
 * Custom hook to manage unread message counts for both direct and group chats
 */
export const useUnreadMessageCounts = (
  currentUserId: string,
  directChats: ChatMessage[],
  groupChats: GroupChat[]
): UnreadCountsReturn => {
  const [directUnreadCounts, setDirectUnreadCounts] = useState<Record<string, number>>({});
  const [groupUnreadCounts, setGroupUnreadCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUnreadCounts = async (): Promise<void> => {
      setIsLoading(true);
      try {
        // Get unique partner IDs from direct chats
        const partnerIds = new Set(
          directChats.map(chat =>
            chat.senderId === currentUserId ? chat.receiverId : chat.senderId
          )
        );

        // Fetch unread counts for direct messages
        const directPromises = Array.from(partnerIds).map(async partnerId => {
          try {
            // Pass setDirectUnreadCounts and partnerId to get individual unread counts
            const count = await getUnreadDirectMessageCount(
              undefined,
              setDirectUnreadCounts,
              partnerId
            );
            return { partnerId, count };
          } catch (error) {
            console.error(`Error fetching direct count for ${partnerId}:`, error);
            return { partnerId, count: 0 };
          }
        });

        // Fetch unread counts for group messages
        const groupPromises = groupChats.map(async group => {
          try {
            // Pass setGroupUnreadCounts and group.id to get individual group unread counts
            const count = await getGroupUnreadCount(
              group.id,
              undefined,
              setGroupUnreadCounts
            );
            return { groupId: group.id, count };
          } catch (error) {
            console.error(`Error fetching group count for ${group.id}:`, error);
            return { groupId: group.id, count: 0 };
          }
        });

        // Wait for all promises to resolve
        await Promise.all([
          Promise.all(directPromises),
          Promise.all(groupPromises)
        ]);

        // Note: We don't need to manually update states here anymore
        // as the service functions will handle the state updates via the passed setters

      } catch (error) {
        console.error('Error fetching unread counts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnreadCounts();
  }, [currentUserId, directChats, groupChats]);

  // Calculate total unread counts
  const totalUnreadCounts = useMemo((): UnreadCounts => {
    const directTotal = Object.values(directUnreadCounts).reduce(
      (sum, count) => sum + count,
      0
    );
    const groupTotal = Object.values(groupUnreadCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    return {
      direct: directTotal,
      group: groupTotal,
      total: directTotal + groupTotal
    };
  }, [directUnreadCounts, groupUnreadCounts]);

  const getUnreadCount = (chatId: string, type: 'direct' | 'group'): number => {
    if (type === 'direct') {
      return directUnreadCounts[chatId] || 0;
    }
    return groupUnreadCounts[chatId] || 0;
  };

  return {
    getUnreadCount,
    totalUnreadCounts,
    isLoading,
    directUnreadCounts,
    groupUnreadCounts
  };
};