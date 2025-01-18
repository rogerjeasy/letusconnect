"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MainSettingPage from "./MainSettingPage";
import { useUserStore } from '@/store/userStore';
import { Spinner } from "@nextui-org/react";

const PlatformSettingPageContent = () => {
  const router = useRouter();
  const { isAuthenticated, loading, hasChecked } = useUserStore();
  const searchParams = useSearchParams();
  const current = searchParams.get('current') || 'account';
  
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
      <MainSettingPage initialTab={current} />
    </div>
  );
};

export default PlatformSettingPageContent;