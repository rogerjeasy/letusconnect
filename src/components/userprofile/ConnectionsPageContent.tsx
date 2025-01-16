"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ManageUserConnections from "./ManageUserConnections";
import { useUserStore } from '@/store/userStore';
import { Spinner } from "@nextui-org/react";

const ConnectionsPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading, hasChecked } = useUserStore();
  const status = searchParams.get('status') || 'active';
  
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
    <div>
      <ManageUserConnections initialStatus={status} />
    </div>
  );
};

export default ConnectionsPageContent;