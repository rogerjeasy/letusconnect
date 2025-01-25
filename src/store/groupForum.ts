import { User } from "./userStore";

export interface GroupForum {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    category: GroupCategory;
    activityLevel: string;
    createdAt: string;
    updatedAt: string;
    members: Member[];
    topics: Topic[];
    events: Event[];
    resources: Resource[];
    admins: User[];
    privacy: string;
    rules: Rule[];
    featured: boolean;
    size: string;
  }
  
export  interface GroupCategory {
    name: string;
    icon: string;
    description: string;
    count: number;
  }
  
export  interface Member {
    userId: string;
    groupId: string;
    joinedAt: string;
    role: string;
    status: string;
  }
  
export  interface Topic {
    id: string;
    name: string;
    color: string;
    description: string;
  }
  
export  interface Event {
    id: string;
    groupId: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    type: string;
    attendees: User[];
  }
  
export interface Resource {
    id: string;
    groupId: string;
    title: string;
    type: string;
    url: string;
    description: string;
    addedBy: string;
    addedAt: string;
  }
  
  
export interface Rule {
    id: string;
    groupId: string;
    title: string;
    description: string;
    order: number;
  }