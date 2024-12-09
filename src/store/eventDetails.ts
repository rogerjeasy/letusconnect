"use client"

export interface EventDetails {
    id: string;
    hostedBy: string;
    hostEmail: string;
    appEmail: string;
    avatarUrl: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string; // e.g., "San Francisco, California"
    specificAddress?: string; // e.g., "555 California St suite 500"
    description: string;
    attendees: { name: string; avatarUrl: string }[];
    isOnline: boolean;
    eventLink?: string;
    street?: string; // e.g., "555 California St"
    city?: string; // e.g., "San Francisco"
    state?: string; // e.g., "CA"
    postalCode?: string; // e.g., "94103"
    country?: string; // e.g., "USA"
    isEditing: boolean;
  }
  