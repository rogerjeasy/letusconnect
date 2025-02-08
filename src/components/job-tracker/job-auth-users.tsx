"use client";

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  PlusCircle,
  Filter,
  Search
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet";
import { useJobStatusStore } from '@/store/useJobStatusStore';
import { JobStatusIcons } from "@/components/icons/job-status-icon";
import CreateJobDialog from './create-job-dialog';
import JobApplications from './job-application';
import AnalyticsDashboard from './job-analytics';
import { useJobStore } from '@/store/useJobStore';
import { useUserStore } from '@/store/userStore';
import { JobStatusEnum } from '@/store/jobStore';
import { z } from 'zod';

const JobTrackerContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { statusCounts, setInitialStatusCounts } = useJobStatusStore();
  const { jobs } = useJobStore();
  const currentUser = useUserStore(state => state.user);

  useEffect(() => {
    if (currentUser && Array.isArray(jobs) && jobs.length > 0) {
      const counts = jobs.reduce((acc, job) => {
        if (job && job.status && Object.values(JobStatusEnum.Values).includes(job.status)) {
          acc[job.status] = (acc[job.status] || 0) + 1;
        }
        return acc;
      }, {} as Record<z.infer<typeof JobStatusEnum>, number>);
  
      setInitialStatusCounts(counts);
    }
  }, [currentUser, jobs, setInitialStatusCounts]);
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Responsive Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 md:p-8 mb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-blue-900 mb-4 flex items-center justify-center gap-3">
            <Briefcase className="w-6 h-6 md:w-10 md:h-10" />
            Job Application Tracker
          </h1>
          <p className="text-sm md:text-xl text-blue-800 mb-6">
            Streamline your job search, track applications, and manage your career journey with precision and ease.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <CreateJobDialog />
            <Button className="w-full md:w-auto" size="lg" variant="outline">
              <Search className="mr-2" /> Explore Opportunities
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Toggle for Tabs */}
      <div className="md:hidden mb-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2" /> Select View
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Select View</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {['Overview', 'Applications', 'Analytics', 'Resources'].map((tab) => (
                <Button 
                  key={tab} 
                  variant="ghost" 
                  onClick={() => {
                    setActiveTab(tab.toLowerCase());
                    setIsMobileMenuOpen(false);
                  }}
                  className="justify-start"
                >
                  {tab}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Responsive Tabs */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="hidden md:grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="resources">Career Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Responsive Job Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(statusCounts).map(([statusKey, status]) => {
              const Icon = JobStatusIcons[statusKey as keyof typeof JobStatusIcons];

              return (
                <Card key={status.name} className="w-full">
                  <CardContent className="flex items-center justify-between p-4 md:p-6">
                    <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                      <span className="font-semibold text-sm md:text-base">{status.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-sm md:text-lg">
                      {status.count}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="applications">
            <JobApplications />
        </TabsContent>
        <TabsContent value="analytics">
            <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const JobTrackerAuth: React.FC = () => {
    return (
        <JobTrackerContent />
    );
  };

export default JobTrackerAuth;