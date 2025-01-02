"use client";

import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";
import type { LoginResponse } from "@/config/api.config";
import { User } from "@/store/userStore";
import { RegisterData } from "@/models/RegisterData";

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      data
    );

    if (!response.data.token || !response.data.user) {
      throw new Error("Invalid response from server");
    }

    return response.data;
  } catch (error) {
    throw new Error(handleError(error) || "Login failed");
  }
};

export const registerUser = async (data: RegisterData): Promise<{ token: string; user: User }> => {
    try {
      const response = await api.post<{ token: string; user: User }>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        data
      );
      if (!response.data.token || !response.data.user) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error) {
      throw new Error(handleError(error) || "Registration failed");
    }
  };

  export const getSession = async (): Promise<User> => {
    try {
      const response = await api.get<{ user: User }>(
        API_CONFIG.ENDPOINTS.AUTH.SESSION
      );
      if (!response.data.user) {
        throw new Error("Invalid session response from server");
      }
      return response.data.user;
    } catch (error) {
      throw new Error(handleError(error) || "Failed to get session");
    }
  };
  
  export const logout = async (): Promise<void> => {
    try {
      await api.patch(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      throw new Error(handleError(error) || "Logout failed");
    }
  };