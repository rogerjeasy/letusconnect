// app/connections/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ManageUserConnections from "@/components/userprofile/ManageUserConnections";
import { useUserStore } from '@/store/userStore';
import { Spinner } from "@nextui-org/react";

const ConnectionsPage = () => {
  const router = useRouter();
  const { token, isAuthenticated, loading, hasChecked } = useUserStore();
  
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

  if (!token || !isAuthenticated) {
    return null; // Return null while redirecting
  }

  return <ManageUserConnections token={token} />;
};

export default ConnectionsPage;