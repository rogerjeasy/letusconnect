"use client";

import dynamic from 'next/dynamic';
import LoadingPage from '@/components/loadingpage/LoadingPage';

// Dynamically import the actual connections page component
const PlatformSettingPageContent = dynamic(
    () => import('@/components/profile/PlatformSettingContent'),
    {
      ssr: false,
      loading: () => <LoadingPage />
    }
  );


const Settings = () => {

  return (
      <PlatformSettingPageContent />
  );
};

export default Settings;