import { useState, useEffect, useMemo, Dispatch, SetStateAction, useCallback } from 'react';
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
  refreshUnreadCounts: () => Promise<void>;
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
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const fetchUnreadCounts = async (isInitialFetch: boolean = false): Promise<void> => {
    // Only show loading state on initial fetch
    if (isInitialFetch) {
      setIsInitialLoading(true);
    }

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

    } catch (error) {
      console.error('Error fetching unread counts:', error);
    } finally {
      if (isInitialFetch) {
        setIsInitialLoading(false);
        setIsInitialized(true);
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!isInitialized) {
      fetchUnreadCounts(true);
    }
  }, [currentUserId, directChats, groupChats, isInitialized]);

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

  // Expose a refresh function that doesn't trigger loading state
  const refreshUnreadCounts = useCallback(() => fetchUnreadCounts(false), []);

  return {
    getUnreadCount,
    totalUnreadCounts,
    isLoading: isInitialLoading,
    directUnreadCounts,
    groupUnreadCounts,
    refreshUnreadCounts
  };
};