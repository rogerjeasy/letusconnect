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