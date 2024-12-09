"use client";

import { EventDetails } from "@/store/eventDetails";
export function constructGoogleMapsUrl(event: EventDetails): string {
    if (event.isOnline) {
      return event.eventLink || "#";
    }
  
    const addressParts = [
      event.street,
      event.city,
      event.state,
      event.postalCode,
      event.country,
    ].filter(Boolean); // Filter out any undefined or empty parts
  
    const addressString = addressParts.join(", ");
    const encodedAddress = encodeURIComponent(addressString);
  
    return `https://www.google.com/maps/place/${encodedAddress}`;
  }
  