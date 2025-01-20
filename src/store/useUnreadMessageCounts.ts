import { useState, useEffect, useMemo, Dispatch, SetStateAction, useCallback } from 'react';
import { getUnreadDirectMessageCount } from "@/services/message.service";
import { getGroupUnreadCount, getAllUnreadGroupMessagesForUser } from "@/services/groupchat.service";
import { toast } from 'react-toastify';

// Type definitions remain the same
interface UnreadCounts {
  direct: number;
  group: number;
  total: number;
}

interface UnreadState {
  directCount: number;
  groupCount: number;
  totalCount: number;
  loading: boolean;
  error: string | null;
}

interface UseUnreadMessagesProps {
  userId?: string;
  maxRetries?: number;
  retryDelay?: number; 
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

export const useUnreadMessageCounts = (
  currentUserId: string,
  directChats: ChatMessage[] = [],
  groupChats: GroupChat[] = []
): UnreadCountsReturn => {
  const [directUnreadCounts, setDirectUnreadCounts] = useState<Record<string, number>>({});
  const [groupUnreadCounts, setGroupUnreadCounts] = useState<Record<string, number>>({});
  const [totalDirectUnread, setTotalDirectUnread] = useState<number>(0);
  const [totalGroupUnread, setTotalGroupUnread] = useState<number>(0);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const fetchUnreadCounts = async (isInitialFetch: boolean = false): Promise<void> => {
    if (isInitialFetch) {
      setIsInitialLoading(true);
    }

    try {
      // Fetch total counts
      const [totalDirect, totalGroup] = await Promise.all([
        getUnreadDirectMessageCount(setTotalDirectUnread),
        getAllUnreadGroupMessagesForUser(setTotalGroupUnread)
      ]);

      // Still fetch individual counts for the UI
      if (directChats.length > 0) {
        const partnerIds = new Set(
          directChats.map(chat =>
            chat.senderId === currentUserId ? chat.receiverId : chat.senderId
          )
        );

        await Promise.all(
          Array.from(partnerIds).map(async partnerId => {
            try {
              await getUnreadDirectMessageCount(
                undefined,
                setDirectUnreadCounts,
                partnerId
              );
            } catch (error) {
              console.error(`Error fetching direct count for ${partnerId}:`, error);
            }
          })
        );
      }

      if (groupChats.length > 0) {
        await Promise.all(
          groupChats.map(async group => {
            try {
              await getGroupUnreadCount(
                group.id,
                undefined,
                setGroupUnreadCounts
              );
            } catch (error) {
              console.error(`Error fetching group count for ${group.id}:`, error);
            }
          })
        );
      }

    } catch (error) {
      console.error('Error fetching unread counts:', error);
    } finally {
      if (isInitialFetch) {
        setIsInitialLoading(false);
        setIsInitialized(true);
      }
    }
  };

  useEffect(() => {
    if (!isInitialized && currentUserId) {
      fetchUnreadCounts(true);
    }
  }, [currentUserId, isInitialized]);

  const totalUnreadCounts = useMemo((): UnreadCounts => {
    return {
      direct: totalDirectUnread,
      group: totalGroupUnread,
      total: totalDirectUnread + totalGroupUnread
    };
  }, [totalDirectUnread, totalGroupUnread]);

  const getUnreadCount = (chatId: string, type: 'direct' | 'group'): number => {
    if (type === 'direct') {
      return directUnreadCounts[chatId] || 0;
    }
    return groupUnreadCounts[chatId] || 0;
  };

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

export const useUnreadMessages = ({
  userId,
  maxRetries = 3,
  retryDelay = 1000
}: UseUnreadMessagesProps) => {
  const [unreadState, setUnreadState] = useState<UnreadState>({
    directCount: 0,
    groupCount: 0,
    totalCount: 0,
    loading: true,
    error: null
  });

  const fetchUnreadCounts = useCallback(async (retryCount = 0) => {
    if (!userId || userId.trim() === '') {
      setUnreadState({
        directCount: 0,
        groupCount: 0,
        totalCount: 0,
        loading: false,
        error: null
      });
      return;
    }

    setUnreadState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [directCount, groupCount] = await Promise.all([
        getUnreadDirectMessageCount(undefined, undefined, undefined),
        getAllUnreadGroupMessagesForUser()
      ]);

      setUnreadState({
        directCount,
        groupCount,
        totalCount: directCount + groupCount,
        loading: false,
        error: null
      });
    } catch (error) {
      if (retryCount < maxRetries) {
        setTimeout(() => {
          fetchUnreadCounts(retryCount + 1);
        }, retryDelay * Math.pow(2, retryCount));
      } else {
        setUnreadState({
          directCount: 0,
          groupCount: 0,
          totalCount: 0,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch unread messages'
        });
        toast.error(error instanceof Error ? error.message : 'Failed to fetch unread messages');
      }
    }
  }, [userId, maxRetries, retryDelay]);

  useEffect(() => {
    let isActive = true;

    const fetch = async () => {
      if (!isActive) return;
      await fetchUnreadCounts();
    };

    fetch();

    return () => {
      isActive = false;
    };
  }, [fetchUnreadCounts]);

  const refetch = useCallback(() => {
    return fetchUnreadCounts(0);
  }, [fetchUnreadCounts]);

  return {
    ...unreadState,
    refetch
  };
};