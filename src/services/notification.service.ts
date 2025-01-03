"use client";

import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";
import type { Notification, NotificationStats, UnreadCountResponse } from "@/store/notification";

interface NotificationResponse {
  message: string;
  notifications: Notification[];
  error?: string;
}

/**
 * Fetch targeted notifications with pagination support.
 */
export const getTargetedNotifications = async (
  limit: number = 20,
  lastNotificationId?: string
): Promise<Notification[]> => {
  try {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (lastNotificationId) {
      params.append('lastNotificationId', lastNotificationId);
    }

    const response = await api.get<NotificationResponse>(
      `${API_CONFIG.ENDPOINTS.NOTIFICATIONS.TARGETED}?${params.toString()}`
    );

    if (!response.data.notifications) {
      throw new Error("Failed to fetch notifications");
    }
    return response.data.notifications;
  } catch (error) {
    throw new Error(handleError(error) || "Failed to fetch notifications");
  }
};

/**
 * Fetch notification statistics.
 */
export const getNotificationStats = async (): Promise<NotificationStats> => {
  try {
    const response = await api.get<NotificationStats>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.STATS
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error) || "Failed to fetch notification statistics");
  }
};

/**
 * Fetch unread notification count.
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  try {
    const response = await api.get<UnreadCountResponse>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT
    );
    return response.data.unreadCount;
  } catch (error) {
    throw new Error(handleError(error) || "Failed to fetch unread notification count");
  }
};

/**
 * Mark a notification as read.
 */
export const markNotificationAsRead = async (notificationId: string): Promise<string> => {
  try {
    const response = await api.patch<{ message: string; error?: string }>(
      `${API_CONFIG.ENDPOINTS.NOTIFICATIONS.BY_ID(notificationId)}`
    );
    return response.data.message;
  } catch (error) {
    throw new Error(handleError(error) || "Failed to mark notification as read");
  }
};