"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../store/userStore";

interface AdminProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
  const { user, isAuthenticated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user?.role?.includes("admin")) {
      router.back(); // Redirect to the previous page
    }
  }, [isAuthenticated, user, router]);

  // Show nothing until the useEffect completes the check
  if (!isAuthenticated || !user?.role?.includes("admin")) {
    return null;
  }

  return <>{children}</>;
}