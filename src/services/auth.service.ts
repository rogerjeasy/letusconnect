"use client";

import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";
import type { LoginResponse } from "@/config/api.config";
import { User } from "@/store/userStore";
import { RegisterData } from "@/models/RegisterData";

interface LoginData {
  emailOrUsername: string;
  password: string;
}

interface OAuthResponse {
  token: string;
  user: User;
}

// OAuth URL generation functions
export const getGoogleAuthUrl = (): string => {
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const REDIRECT_URI = `${window.location.origin}/api/auth/google/callback`;
  const STATE = generateRandomState();
  
  // Store state in sessionStorage for validation when the user returns
  sessionStorage.setItem('oauthState', STATE);
  
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID!,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'email profile',
    state: STATE,
    prompt: 'select_account',
    access_type: 'offline'
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const getGithubAuthUrl = (): string => {
  const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const REDIRECT_URI = `${window.location.origin}/api/auth/github/callback`;
  const STATE = generateRandomState();
  
  // Store state in sessionStorage for validation when the user returns
  sessionStorage.setItem('oauthState', STATE);
  
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID!,
    redirect_uri: REDIRECT_URI,
    state: STATE,
    scope: 'user:email'
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
};

const generateRandomState = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const handleGoogleAuth = async (code: string, state: string): Promise<OAuthResponse> => {
  try {
    const storedState = sessionStorage.getItem('oauthState');
    if (!storedState || storedState !== state) {
      throw new Error('Invalid state parameter');
    }
    
    const response = await api.post<OAuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.GOOGLE_CALLBACK,
      { code }
    );
    
    if (!response.data.token || !response.data.user) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  } catch (error) {
    throw new Error(handleError(error) || 'Google authentication failed');
  } finally {
    sessionStorage.removeItem('oauthState');
  }
};

export const handleGithubAuth = async (code: string, state: string): Promise<OAuthResponse> => {
  try {
    const storedState = sessionStorage.getItem('oauthState');
    if (!storedState || storedState !== state) {
      throw new Error('Invalid state parameter');
    }
    
    const response = await api.post<OAuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.GITHUB_CALLBACK,
      { code }
    );
    
    if (!response.data.token || !response.data.user) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  } catch (error) {
    throw new Error(handleError(error) || 'GitHub authentication failed');
  } finally {
    sessionStorage.removeItem('oauthState');
  }
};


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