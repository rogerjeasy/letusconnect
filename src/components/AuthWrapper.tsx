"use client";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import SessionCheck from "./WhileLoadingComponent";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const checkSession = useUserStore((state) => state.checkSession);
  const loading = useUserStore((state) => state.loading);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const hasChecked = useUserStore((state) => state.hasChecked); // Add this to store

  useEffect(() => {
    // Only check once on initial mount
    if (!hasChecked) {
      checkSession();
    }
  }, [checkSession, hasChecked]);

  if (loading) {
    return (
      <SessionCheck
        onRetry={checkSession} 
      />
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;