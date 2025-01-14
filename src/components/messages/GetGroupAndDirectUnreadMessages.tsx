"use client";

import { useCallback, useEffect, useState } from 'react';
import { getUnreadMessageCount } from '@/services/message.service';
import { getAllUnreadGroupMessagesForUser } from "@/services/groupchat.service";
import { toast } from "react-toastify";

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
        getUnreadMessageCount(undefined, undefined, undefined),
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

interface GetGroupAndDirectUnreadMessagesProps {
  userId?: string;
  onCountChange?: (count: number) => void;
  className?: string;
}

export const GetGroupAndDirectUnreadMessages: React.FC<GetGroupAndDirectUnreadMessagesProps> = ({
  userId,
  onCountChange,
  className
}) => {
  const { totalCount, loading, error, refetch } = useUnreadMessages({
    userId,
    maxRetries: 3
  });

  useEffect(() => {
    if (!loading && !error && onCountChange) {
      onCountChange(totalCount);
    }
  }, [totalCount, loading, error, onCountChange]);

  return null;
};

export default GetGroupAndDirectUnreadMessages;