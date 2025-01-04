// store/notificationStatsStore.ts
import { create } from 'zustand';
import { getNotificationStats, getUnreadNotificationCount } from '@/services/notification.service';
import { NotificationStats } from '@/store/notification';

interface NotificationStatsState {
  stats: NotificationStats | null;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  // Actions
  decrementUnreadCount: () => void;
  updateStats: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  resetError: () => void;
}

export const useNotificationStatsStore = create<NotificationStatsState>((set, get) => ({
  stats: null,
  unreadCount: 0,
  isLoading: false,
  error: null,

  decrementUnreadCount: () => {
    set((state) => ({
      unreadCount: Math.max(0, state.unreadCount - 1),
      stats: state.stats
        ? {
            ...state.stats,
            unreadCount: Math.max(0, state.stats.unreadCount - 1),
          }
        : null,
    }));
  },

  updateStats: async () => {
    try {
      set({ isLoading: true, error: null });
      const newStats = await getNotificationStats();
      set({ stats: newStats });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch stats' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {  // Modified to not return anything
    try {
      set({ isLoading: true, error: null });
      const count = await getUnreadNotificationCount();
      set({ unreadCount: count });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch unread count' });
    } finally {
      set({ isLoading: false });
    }
  },

  resetError: () => set({ error: null }),
}));