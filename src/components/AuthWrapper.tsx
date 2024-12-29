"use client";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import SessionCheck from "./WhileLoadingComponent";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const checkSession = useUserStore((state) => state.checkSession);
  const loading = useUserStore((state) => state.loading);
  const hasChecked = useUserStore((state) => state.hasChecked);
  
  useEffect(() => {
    // Check if there's a token in localStorage before initiating session check
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!hasChecked && storedToken) {
      checkSession();
    } else if (!hasChecked) {
      // If no token exists, mark as checked without loading state
      useUserStore.setState({ 
        loading: false, 
        hasChecked: true,
        isAuthenticated: false 
      });
    }
  }, [checkSession, hasChecked]);

  if (loading) {
    return <SessionCheck onRetry={checkSession} />;
  }

  return <>{children}</>;
};

export default AuthWrapper;