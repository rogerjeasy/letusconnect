'use client';

import dynamic from 'next/dynamic';
import LoadingPage from '@/components/loadingpage/LoadingPage';

const JobTrackerMain = dynamic(
  () => import('@/components/job-tracker/job-main'),
  {
    ssr: false,
    loading: () => <LoadingPage />
  }
);

const JobTrackerPage = () => {
  return <JobTrackerMain />;
};

export default JobTrackerPage;

