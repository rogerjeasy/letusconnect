"use client";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import SessionCheck from "./WhileLoadingComponent";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const checkSession = useUserStore((state) => state.checkSession);
  const loading = useUserStore((state) => state.loading);
  const hasChecked = useUserStore((state) => state.hasChecked);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
 
  useEffect(() => {
    if (hasChecked) {
      return; // Skip if we've already checked
    }

    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (!storedToken) {
      // If no token, immediately mark as checked without any API call
      useUserStore.setState({
        hasChecked: true,
        isAuthenticated: false,
        loading: false
      });
      return;
    }

    // Only run checkSession if we have a token
    checkSession();
  }, [hasChecked, checkSession]);

  if (loading) {
    return <SessionCheck onRetry={checkSession} />;
  }

  return <>{children}</>;
};

export default AuthWrapper;