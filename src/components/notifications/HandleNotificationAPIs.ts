import { api, handleError } from "@/helpers/api";
import { toast } from "react-toastify";
import { Notification } from "@/store/notification";

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
      toast.success(response.data.message);
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
 * Example usage:
 * 
 * // Fetch first page of notifications
 * const notifications = await handleFetchTargetedNotifications(token);
 * 
 * // Fetch next page using last notification ID
 * const nextPage = await handleFetchTargetedNotifications(
 *   token, 
 *   20, 
 *   notifications[notifications.length - 1]?.id
 * );
 */