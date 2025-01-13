"use client";

import { useCallback, useEffect, useState } from 'react';
import { getUserConnectionsCount } from '@/services/connection.service';
import { ConnectionState } from '@/store/userConnections';

interface UseUserConnectionsProps {
  userId: string;
  initialCount?: number;
  maxRetries?: number;
  retryDelay?: number; 
}

export const useUserConnections = ({
  userId,
  initialCount = 0,
  maxRetries = 3,
  retryDelay = 1000
}: UseUserConnectionsProps) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    count: initialCount,
    loading: true,
    error: null
  });

  const fetchConnectionCount = useCallback(async (retryCount = 0) => {
    setConnectionState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await getUserConnectionsCount(userId);
      setConnectionState({
        count: response.count,
        loading: false,
        error: null
      });
    } catch (error) {
      if (retryCount < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s, etc.
        setTimeout(() => {
          fetchConnectionCount(retryCount + 1);
        }, retryDelay * Math.pow(2, retryCount));
      } else {
        setConnectionState({
          count: 0,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch connections'
        });
      }
    }
  }, [userId, maxRetries, retryDelay]);

  useEffect(() => {
    let isActive = true;
    
    const fetch = async () => {
      if (!isActive) return;
      await fetchConnectionCount();
    };
    
    fetch();
    
    return () => {
      isActive = false;
    };
  }, [userId, fetchConnectionCount]);

  const refetch = useCallback(() => {
    return fetchConnectionCount(0);
  }, [fetchConnectionCount]);

  return {
    ...connectionState,
    refetch
  };
};

interface GetUserConnectionNumberProps {
  userId: string;
  onCountChange?: (count: number) => void;
  className?: string;
}

export const GetUserConnectionNumber: React.FC<GetUserConnectionNumberProps> = ({
  userId,
  onCountChange,
  className
}) => {
  const { count, loading, error, refetch } = useUserConnections({
    userId,
    maxRetries: 3
  });

  useEffect(() => {
    if (!loading && !error && onCountChange) {
      onCountChange(count);
    }
  }, [count, loading, error, onCountChange]);

  return null;
};