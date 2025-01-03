"use client";

import { User } from "@/store/userStore";

// config/api.config.ts
export const API_CONFIG = {
    VERSION: '/api/v1',
    ENDPOINTS: {

        CONNECTIONS: {
            BASE: '/connections',
            GET_ALL: '/connections',
            GET_BY_UID: (uid: string) => `/connections/${uid}`,
            REMOVE: (uid: string) => `/connections/${uid}`,
            REQUESTS: {
                BASE: '/connections/requests',
                GET_ALL: '/connections/requests',
                SEND: '/connections/requests',
                ACCEPT: (fromUid: string) => `/connections/requests/${fromUid}/accept`,
                REJECT: (fromUid: string) => `/connections/requests/${fromUid}/reject`,
                CANCEL: (toUid: string) => `/connections/requests/${toUid}`,
            }
        },

      AUTH: {
        BASE: '/auth',
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        SESSION: '/auth/session',
        LOGOUT: '/auth/logout',
      },

      USERS: {
        BASE: '/users',
        COMPLETION: '/users/completion',
        BY_UID: (uid: string) => `/users/${uid}`,
      },

      FAQ: {
        BASE: '/faqs',
        BY_ID: (id: string) => `/faqs/${id}`,
      },

      PROJECTS: {
        BASE: '/projects',
        OWNER: '/projects/owner',
        PARTICIPATION: '/projects/participation',
        PUBLIC: '/projects/public',
        BY_ID: (id: string) => `/projects/${id}`,
        JOIN: (id: string) => `/projects/${id}/join`,
        JOIN_REQUESTS: (id: string, uid: string) => `/projects/${id}/join-requests/${uid}`,
        INVITE: (id: string) => `/projects/${id}/invite`,
        PARTICIPANTS: (id: string, uid: string) => `/projects/${id}/participants/${uid}`,
        TASKS: {
          CREATE: (id: string) => `/projects/${id}/tasks`,
          UPDATE: (id: string, taskId: string) => `/projects/${id}/tasks/${taskId}`,
          DELETE: (id: string, taskId: string) => `/projects/${id}/tasks/${taskId}`,
        },
      },

      NOTIFICATIONS: {
        BASE: '/notifications',
        TARGETED: '/notifications/targeted',
        UNREAD_COUNT: '/notifications/unread-count',
        STATS: '/notifications/stats',
        LIST: '/notifications',
        CREATE: '/notifications',
        BY_ID: (id: string) => `/notifications/${id}`,
        UPDATE: (id: string) => `/notifications/${id}`,
        DELETE: (id: string) => `/notifications/${id}`,
        MARK_READ: (id: string) => `/notifications/${id}/read`,
        GET_ONE: (id: string) => `/notifications/${id}`,
      },

      MESSAGES: {
        BASE: '/messages',
        SEND: '/messages/send',
        TYPING: '/messages/typing',
        DIRECT: '/messages/direct',
        UNREAD: '/messages/unread',
        MARK_READ: '/messages/mark-as-read',
      },

      NEWSLETTERS: {
        BASE: '/newsletters',
        SUBSCRIBE: '/newsletters/subscribe',
        UNSUBSCRIBE: '/newsletters/unsubscribe',
        SUBSCRIBERS: '/newsletters/subscribers',
        SUBSCRIBERS_COUNT: '/newsletters/subscribers/count',
      },

      GROUP_CHATS: {
        BASE: '/group-chats',
        BY_ID: (id: string) => `/group-chats/${id}`,
        BY_PROJECT: (projectId: string) => `/group-chats/projects/${projectId}/group-chats`,
        MY_CHATS: '/group-chats/my/group-chats',
        MESSAGES: '/group-chats/messages',
        MARK_READ: (groupChatId: string) => `/group-chats/${groupChatId}/mark-messages-read`,
        UNREAD_COUNT: '/group-chats/unread-messages/count',
        REMOVE_PARTICIPANTS: (groupChatId: string) => `/group-chats/${groupChatId}/remove-participants`,
        REPLY: '/group-chats/reply-message',
        ATTACH_FILES: '/group-chats/attach-files',
        PIN: {
          ADD: '/group-chats/pin-message',
          LIST: '/group-chats/pinned-messages',
          REMOVE: '/group-chats/unpin-message',
        },
        REACTIONS: '/group-chats/react-to-message',
        READ_RECEIPTS: (groupChatId: string, messageId: string) => 
          `/group-chats/message-read-receipts/${groupChatId}/${messageId}`,
        ROLES: '/group-chats/set-role',
        MUTE: '/group-chats/mute-participant',
        ONLINE_STATUS: (participantId: string) => `/group-chats/online-status/${participantId}`,
        SETTINGS: '/group-chats/update-settings',
        ARCHIVE: '/group-chats/archive',
        LEAVE: (groupChatId: string) => `/group-chats/${groupChatId}/participants/me`,
        ADD_PARTICIPANTS: {
          TO_CHAT: (groupChatId: string) => `/group-chats/${groupChatId}/participants`,
          TO_PROJECT: (projectId: string) => `/group-chats/projects/${projectId}/participants`,
        },
        REPORT: '/group-chats/report-message',
      },
    },
  } as const;

export interface LoginResponse {
    user: User;
    token: string;
  }
  
// Type for endpoint parameters
export type EndpointParams = {
    fromUID?: string;
    uid?: string;
    id?: string;
    projectId?: string;
    taskId?: string;
    groupChatId?: string;
    messageId?: string;
    participantId?: string;
  };
  
  // Helper function to build full API paths
  export const buildApiPath = (path: string): string => `${API_CONFIG.VERSION}${path}`;
  
  // Helper function to build parameterized paths
  export const buildPath = (
    pathFn: ((...args: string[]) => string) | string,
    params: EndpointParams
  ): string => {
    if (typeof pathFn === 'string') return pathFn;
    
    const args = Object.values(params).filter(Boolean) as string[];
    return pathFn(...args);
  };
