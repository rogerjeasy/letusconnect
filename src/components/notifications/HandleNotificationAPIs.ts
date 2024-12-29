import { api, handleError } from "@/helpers/api";
import { toast } from "react-toastify";
import { Notification, NotificationStats, UnreadCountResponse,  } from "@/store/notification";

export interface NotificationResponse {
  message: string;
  notifications: Notification[];
  error?: string;
}

/**
 * Function to fetch targeted notifications with pagination support.
 * @param token - Authorization token for API requests
 * @param limit - Maximum number of notifications to retrieve (default: 20)
 * @param lastNotificationId - ID of the last notification for pagination (optional)
 * @returns Promise containing the list of notifications
 */
export const handleFetchTargetedNotifications = async (
  token: string,
  limit: number = 20,
  lastNotificationId?: string
): Promise<Notification[]> => {
  try {
    // Construct query parameters
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (lastNotificationId) {
      params.append('lastNotificationId', lastNotificationId);
    }

    // Make API request
    const response = await api.get<NotificationResponse>(
      `/api/notifications/targeted?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Check if response is successful
    if (response.status >= 200 && response.status < 300) {
      return response.data.notifications || [];
    } else {
      throw new Error(response.data?.error || "Failed to fetch notifications");
    }
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error(errorMessage || "An error occurred while fetching notifications");
    throw errorMessage;
  }
};

/**
 * Function to fetch notification statistics.
 * @param token - Authorization token for API requests
 * @returns Promise containing notification statistics
 */
export const handleFetchNotificationStats = async (
    token: string
  ): Promise<NotificationStats> => {
    try {
      const response = await api.get<NotificationStats>(
        '/api/notifications/stats',
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error("Failed to fetch notification statistics");
      }
    } catch (error) {
      const errorMessage = handleError(error);
      toast.error(errorMessage || "An error occurred while fetching notification statistics");
      throw errorMessage;
    }
  };
  
  /**
   * Function to fetch unread notification count.
   * @param token - Authorization token for API requests
   * @returns Promise containing the number of unread notifications
   */
  export const handleFetchUnreadCount = async (
    token: string
  ): Promise<number> => {
    try {
      const response = await api.get<UnreadCountResponse>(
        '/api/notifications/unread-count',
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status >= 200 && response.status < 300) {
        return response.data.unreadCount;
      } else {
        throw new Error("Failed to fetch unread notification count");
      }
    } catch (error) {
      const errorMessage = handleError(error);
      toast.error(errorMessage || "An error occurred while fetching unread count");
      throw errorMessage;
    }
  };
  