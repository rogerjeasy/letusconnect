export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
    messageType: string;
    attachments: string[];
    senderName: string;
  }

export interface DirectMessage extends Message {
    receiverId: string;
    receiverName: string;
}

export interface Messages {
  channelID: string;
  directMessages: DirectMessage[];
}

export interface MarkReadRequest {
  senderId: string;
}

export interface TypingStatusRequest {
  receiverId: string;
  isTyping: boolean;
}

export interface SendMessageRequest {
  receiverId: string;
  content: string;
  messageType?: string;
  attachments?: string[];
}