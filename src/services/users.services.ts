"use client";

import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";
import { User } from "@/store/userStore";

interface ProfileCompletion {
  completionPercentage: number;
  filledFields: number;
  totalFields: number;
  missingFields: string[];
  profileStatus: string;
}

/**
 * Function to fetch profile completion details.
 * @returns A promise that resolves to the profile completion data.
 */
export const getProfileCompletion = async (): Promise<ProfileCompletion> => {
  try {
    const response = await api.get<ProfileCompletion>(
      API_CONFIG.ENDPOINTS.USERS.COMPLETION
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error) || "Failed to fetch profile completion status");
  }
};

interface UsersResponse {
  users: User[];
}

/**
 * Function to fetch all users from the system.
 * @returns A promise that resolves to an array of User objects.
 */
export const getAllUsers = async (): Promise<User[]> => {
    try {
      const response = await api.get<UsersResponse>(API_CONFIG.ENDPOINTS.USERS.BASE);
      return response.data.users;
    } catch (error) {
      throw new Error(handleError(error) || "Failed to fetch users");
    }
  };
  
  interface UserResponse {
    user: User;
  }
  
  /**
   * Function to fetch a specific user by their UID.
   * @param uid - The unique identifier of the user to fetch.
   * @returns A promise that resolves to a User object.
   */
  export const getUserByUid = async (uid: string): Promise<User> => {
    try {
      const response = await api.get<UserResponse>(
        API_CONFIG.ENDPOINTS.USERS.BY_UID(uid)
      );
      return response.data.user;
    } catch (error) {
      throw new Error(handleError(error) || `Failed to fetch user with UID: ${uid}`);
    }
  };