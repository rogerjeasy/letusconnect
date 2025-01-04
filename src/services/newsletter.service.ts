"use client";

import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";

interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}

interface SubscribersResponse {
  subscribers: NewsletterSubscriber[];
}

interface SubscriberCountResponse {
    totalSubscribers: number;
  }

interface SubscriptionResponse {
  success: boolean;
  message: string;
}

/**
 * Function to subscribe to the newsletter.
 * @param email - The email address to subscribe
 * @returns A promise that resolves to the subscription response
 */
export const subscribeToNewsletter = async (
  email: string,
): Promise<SubscriptionResponse> => {
  try {
    const response = await api.post<SubscriptionResponse>(
      API_CONFIG.ENDPOINTS.NEWSLETTERS.SUBSCRIBE,
      { email }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error) || "Failed to subscribe to newsletter");
  }
};

/**
 * Function to unsubscribe from the newsletter.
 * @param email - The email address to unsubscribe
 * @returns A promise that resolves to the unsubscription response
 */
export const unsubscribeFromNewsletter = async (
  email: string
): Promise<SubscriptionResponse> => {
  try {
    const response = await api.post<SubscriptionResponse>(
      API_CONFIG.ENDPOINTS.NEWSLETTERS.UNSUBSCRIBE,
      { email }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error) || "Failed to unsubscribe from newsletter");
  }
};

/**
 * Function to fetch all newsletter subscribers.
 * @returns A promise that resolves to an array of newsletter subscribers
 */
export const getAllNewsletterSubscribers = async (): Promise<NewsletterSubscriber[]> => {
  try {
    const response = await api.get<SubscribersResponse>(
      API_CONFIG.ENDPOINTS.NEWSLETTERS.SUBSCRIBERS
    );
    console.log("response", response);
    return response.data.subscribers;
  } catch (error) {
    throw new Error(handleError(error) || "Failed to fetch newsletter subscribers");
  }
};

/**
 * Function to get the total count of newsletter subscribers.
 * @returns A promise that resolves to the total number of subscribers
 */
export const getNewsletterSubscriberCount = async (): Promise<number> => {
  try {
    const response = await api.get<SubscriberCountResponse>(
      API_CONFIG.ENDPOINTS.NEWSLETTERS.SUBSCRIBERS_COUNT
    );
    return response.data.totalSubscribers;
  } catch (error) {
    throw new Error(handleError(error) || "Failed to fetch subscriber count");
  }
};