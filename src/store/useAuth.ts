import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/userStore";

export function useAuth() {
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const router = useRouter();
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    // Only redirect if restoration is complete and the user is unauthenticated
    if (isRestored && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isRestored, router]);

  return { user, isAuthenticated };
}