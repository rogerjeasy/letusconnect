"use client";

import React, { useCallback, useState } from "react";
import { handleFetchNotificationStats, handleFetchUnreadCount } from "./HandleNotificationAPIs";
import { NotificationStats } from "@/store/notification";


// Custom hook for managing notification counts
export const useNotificationCount = (token: string) => {
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    const fetchUnreadCount = useCallback(async () => {
      try {
        setIsLoading(true);
        const count = await handleFetchUnreadCount(token);
        setUnreadCount(count);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch unread count');
      } finally {
        setIsLoading(false);
      }
    }, [token]);
  
    React.useEffect(() => {
      fetchUnreadCount();
    }, [fetchUnreadCount]);
  
    return {
      unreadCount,
      isLoading,
      error,
      refetch: fetchUnreadCount
    };
  };
  
  // Custom hook for managing notification statistics
export const useNotificationStats = (token: string) => {
    const [stats, setStats] = React.useState<NotificationStats | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
  
    const fetchStats = React.useCallback(async () => {
      try {
        setIsLoading(true);
        const fetchedStats = await handleFetchNotificationStats(token);
        setStats(fetchedStats);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notification stats');
      } finally {
        setIsLoading(false);
      }
    }, [token]);
  
    React.useEffect(() => {
      fetchStats();
    }, [fetchStats]);
  
    return {
      stats,
      isLoading,
      error,
      refetch: fetchStats
    };
  };