"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const restoreUser = useUserStore((state) => state.restoreUser);

  useEffect(() => {
    restoreUser(); // Restore the user on client side
  }, [restoreUser]);

  return <>{children}</>;
};

export default AuthWrapper;