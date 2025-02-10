"use client";

import React, { useEffect } from 'react';
import { useJobStore } from '@/store/useJobStore';
import JobCard from './job-card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { Briefcase } from "lucide-react";
import CreateJobDialog from './create-job-dialog';
import { useUserStore } from '@/store/userStore';
import { useJobStatusStore } from '@/store/useJobStatusStore';

const JobApplications = () => {
    const { jobs, fetchJobs, selectJob } = useJobStore();
    const currentUser = useUserStore(state => state.user);
    const resetCounts = useJobStatusStore(state => state.resetCounts);
  
    useEffect(() => {
      if (currentUser?.uid) {
        fetchJobs();
      } else {
        resetCounts();
      }
    }, [currentUser?.uid, fetchJobs, resetCounts]);

  // Filter out null values from the jobs array
  const validJobs = jobs.filter(job => job !== null);

  return (
    <TabsContent value="applications" className="mt-0">
      <ScrollArea className="h-[calc(100vh-24rem)]">
        {validJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
            {validJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSelect={selectJob}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <Briefcase className="w-16 h-16 text-blue-500 mb-4" />
            <h2 className="text-xl font-semibold text-blue-900">
              No job applications found
            </h2>
            <p className="text-sm text-gray-600 max-w-sm">
              Start tracking your job applications to stay organized and keep track of your progress.
            </p>
            <div className="mt-6">
              <CreateJobDialog />
            </div>
          </div>
        )}
      </ScrollArea>
    </TabsContent>
  );
};

export default JobApplications;