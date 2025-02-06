"use client";

import React, { useEffect } from 'react';
import { useJobStore } from '@/store/useJobStore';
import JobCard from './job-card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";

const JobApplications = () => {
  const { jobs, fetchJobs, selectJob } = useJobStore();

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <TabsContent value="applications" className="mt-0">
      <ScrollArea className="h-[calc(100vh-24rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
          {jobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job}
              onSelect={selectJob}
            />
          ))}
        </div>
      </ScrollArea>
    </TabsContent>
  );
};

export default JobApplications;