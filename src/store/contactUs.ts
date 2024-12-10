export interface ContactUsInterface {
    id?: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status?: "unread" | "read" | "replied";
    attachmentUrls?: string[]; 
    createdAt?: string; 
    updatedAt?: string;
  }
  