"use client";

import React, { useCallback, useEffect, useState } from "react";
import { NotificationStats } from "@/store/notification";
import { getNotificationStats, getUnreadNotificationCount } from "@/services/notification.service";


// Custom hook for managing notification counts
export const useNotificationCount = () => {
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    const fetchUnreadCount = useCallback(async () => {
      try {
        setIsLoading(true);
        const count = await getUnreadNotificationCount();
        setUnreadCount(count);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch unread count');
      } finally {
        setIsLoading(false);
      }
    }, []);
  
    useEffect(() => {
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
export const useNotificationStats = () => {
    const [stats, setStats] = React.useState<NotificationStats | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
  
    const fetchStats = useCallback(async () => {
      try {
        setIsLoading(true);
        const fetchedStats = await getNotificationStats();
        setStats(fetchedStats);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notification stats');
      } finally {
        setIsLoading(false);
      }
    }, []);
  
    useEffect(() => {
      fetchStats();
    }, [fetchStats]);
  
    return {
      stats,
      isLoading,
      error,
      refetch: fetchStats
    };
  };