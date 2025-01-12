"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { Spinner } from "@nextui-org/react";
import MessagesComponent from './MessagesComponent';

const MessagesPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading, hasChecked } = useUserStore();
  
  const current = searchParams.get('entityId') || '';

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
    <div className="min-h-screen">
      <MessagesComponent current={current} />
    </div>
  );
};

export default MessagesPageContent;