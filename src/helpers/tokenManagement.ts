"use client";

import { api, fileApi } from "./api";

// Token management
export const setAuthToken = (token: string | null) => {
    if (token) {
      // Set token in localStorage (only in browser)
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", token);
      }
      
      // Set token in API instances
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fileApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      // Remove token from localStorage (only in browser)
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
      }
      
      // Remove token from API instances
      delete api.defaults.headers.common['Authorization'];
      delete fileApi.defaults.headers.common['Authorization'];
    }
  };
  
  // Initialize token from localStorage on load (only in browser)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
  }