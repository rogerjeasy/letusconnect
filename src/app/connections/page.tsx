// app/connections/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ManageUserConnections from "@/components/userprofile/ManageUserConnections";
import { useUserStore } from '@/store/userStore';
import { Spinner } from "@nextui-org/react";

const ConnectionsPage = () => {
  const router = useRouter();
  const { isAuthenticated, loading, hasChecked } = useUserStore();
  
  useEffect(() => {
    if (hasChecked && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, hasChecked, router]);

  if (loading || !hasChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="mt-16">
      <ManageUserConnections />
    </div>
  );
};

export default ConnectionsPage;