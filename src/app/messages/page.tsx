"use client";

import dynamic from 'next/dynamic';
import LoadingPage from '@/components/loadingpage/LoadingPage';

// Dynamically import the messages page component
const MessagesPageContent = dynamic(
  () => import('@/components/messages/MessagesPageContent'),
  {
    ssr: false,
    loading: () => <LoadingPage />
  }
);

export default function MessagesPage() {
  return <MessagesPageContent />;
}