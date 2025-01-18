"use client";

import dynamic from 'next/dynamic';
import LoadingPage from '@/components/loadingpage/LoadingPage';

// Dynamically import the actual connections page component
const ConnectionsPageContent = dynamic(
  () => import('@/components/userprofile/ConnectionsPageContent'),
  {
    ssr: false,
    loading: () => <LoadingPage />
  }
);

export default function ConnectionsPage() {
  return <ConnectionsPageContent />;
}