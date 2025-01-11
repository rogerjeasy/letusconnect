// Notification Types
export type NotificationType = 
  | "message" | "event" | "reminder" | "system" | "custom"
  | "job" | "project" | "mentorship" | "collaboration" | "resource"
  | "task" | "goal" | "survey" | "feedback" | "announcement"
  | "meeting" | "request" | "approval" | "review"
  | "feedback_loop" | "feedback_form" | "feedback_peer" | "feedback_360"
  | "feedback_self" | "feedback_team" | "feedback_manager" | "feedback_custom"
  | "feedback_request" | "feedback_response" | "feedback_review"
  | "feedback_reminder" | "feedback_summary" | "feedback_report"
  | "feedback_analysis" | "feedback_action" | "feedback_goal"
  | "new_user" | "new_mentor" | "new_mentee" | "new_request"
  | "new_review" | "new_feedback" | "join_project_request";

export type NotificationStatus = "unread" | "read" | "hidden" | "archived" | "deleted";

export type NotificationPriority = "low" | "normal" | "high" | "urgent";

export interface NotificationAction {
  label: string;
  url: string;
  isPrimary: boolean;
  actionType: string;
}

export interface EntityReference {
  id: string;
  type: string;
}

export interface Notification {
  id: string;
  userId: string;
  actorId?: string;
  actorName?: string;
  actorType?: string;
  type: NotificationType;
  title: string;
  content: string;
  category: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  relatedEntities?: EntityReference[];
  metadata?: Record<string, any>;
  actions?: NotificationAction[];
  isRead: boolean;
  isArchived: Record<string, boolean>;
  isImportant: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  readAt?: string;
  source?: string;
  tags?: string[];
  groupId?: string;
  deliveryChannel?: string;
  targetedUsers?: string[];
}

type OmittedCreateFields = "id" | "createdAt" | "updatedAt" | "readAt" | "sentAt";
type OmittedUpdateFields = "id";

export type CreateNotificationDto = Omit<Notification, OmittedCreateFields>;
export type UpdateNotificationDto = Partial<Omit<Notification, OmittedUpdateFields>>;


export type UpdateNotificationInput = Partial<Omit<Notification, 'id'>>;

export const isNotificationRead = (notification: Notification, userId: string): boolean => {
  return notification.isRead ?? false;
};

export const isNotificationArchived = (notification: Notification, userId: string): boolean => {
  return notification.isArchived?.[userId] ?? false;
};

// Helper function to format notification dates
export const formatNotificationDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

  
export interface NotificationStats {
    totalCount: number;
    unreadCount: number;
    readCount: number;
    archivedCount: number;
    priorityStats: {
      [key: string]: number;
    };
    typeStats: {
      [key: string]: number;
    };
  }
  
  export interface UnreadCountResponse {
    unreadCount: number;
  }