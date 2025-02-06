import React, { useState } from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  PlusCircle,
  Filter,
  Search,
  Watch,
  CheckCircle2,
  XCircle
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

const JobTrackerAuth: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const jobStatuses = [
    {
      name: 'Applied',
      icon: <PlusCircle className="text-blue-500 mr-2" />,
      count: 15
    },
    {
      name: 'In Review',
      icon: <Watch className="text-yellow-500 mr-2" />,
      count: 5
    },
    {
      name: 'Interview',
      icon: <CheckCircle2 className="text-green-500 mr-2" />,
      count: 3
    },
    {
      name: 'Rejected',
      icon: <XCircle className="text-red-500 mr-2" />,
      count: 2
    }
  ];

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
            <Button className="w-full md:w-auto" size="lg" variant="default">
              <PlusCircle className="mr-2" /> Add New Application
            </Button>
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
            {jobStatuses.map((status) => (
              <Card key={status.name} className="w-full">
                <CardContent className="flex items-center justify-between p-4 md:p-6">
                  <div className="flex items-center">
                    {status.icon}
                    <span className="font-semibold text-sm md:text-base">{status.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-sm md:text-lg">
                    {status.count}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobTrackerAuth;