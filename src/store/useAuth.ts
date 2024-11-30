import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/userStore";

export function useAuth() {
  const restoreUser = useUserStore((state) => state.restoreUser);
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const router = useRouter();
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    // Restore user from localStorage and set restoration state
    restoreUser();
    setIsRestored(true);
  }, [restoreUser]);

  useEffect(() => {
    // Only redirect if restoration is complete and the user is unauthenticated
    if (isRestored && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isRestored, router]);

  return { user, isAuthenticated };
}