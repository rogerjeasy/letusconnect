"use client";

import dynamic from 'next/dynamic';
import LoadingPage from '@/components/loadingpage/LoadingPage';

const ChatContainerPageContent = dynamic(
    () => import('@/components/chat/ChatContainerPageContent'),
    {
      ssr: false,
      loading: () => <LoadingPage />
    }
  );

export default function ChatPage() {
  return <ChatContainerPageContent />;
}