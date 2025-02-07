import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useJobStore } from '@/store/useJobStore';
import { BarChart3, Clock, TrendingUp, Lightbulb, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarProviderContext, useSidebar } from "@/components/SidebarProvider";
import CreateJobDialog from './create-job-dialog';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface ChartDataPoint {
  name: string;
  value: number;
}

type TimelineData = {
  [key: string]: number;
};

const AnalyticsDashboardContent = () => {
  const [selectedView, setSelectedView] = useState('overview');
  const jobs = useJobStore(state => state.jobs);
  const { isOpen, setIsOpen } = useSidebar();

  const getApplicationsOverTime = () => {
    const timeline = jobs.reduce<TimelineData>((acc, job) => {
      const month = new Date(job.applicationDate).toLocaleString('default', { 
        month: 'short', 
        year: '2-digit' 
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(timeline).map(([month, count]) => ({
      month,
      applications: count
    }));
  };

  const getResponseRate = () => {
    const total = jobs.length;
    const responded = jobs.filter(job => 
      ['INTERVIEWING', 'OFFERED', 'REJECTED'].includes(job.status)
    ).length;
    
    return [
      { name: 'Responded', value: responded },
      { name: 'Pending', value: total - responded }
    ];
  };

  const getInterviewSuccess = (): ChartDataPoint[] => {
    const interviewed = jobs.filter(job =>
      ['INTERVIEWING', 'OFFERED', 'REJECTED'].includes(job.status)
    ).length;
    const offers = jobs.filter(job => job.status === 'OFFERED').length;
    
    return [
      { name: 'Successful', value: offers },
      { name: 'Unsuccessful', value: interviewed - offers }
    ];
  };

  type JobTypeDistribution = {
    [K in string]: number;
  }
  
  const getJobTypeDistribution = () => {
    return jobs.reduce<JobTypeDistribution>((acc, job) => {
      if (job.jobType) {
        acc[job.jobType] = (acc[job.jobType] || 0) + 1;
      }
      return acc;
    }, {});
  };

  const SidebarItem = ({ value, label, icon: Icon, onClick }: { 
    value: string; 
    label: string; 
    icon: any;
    onClick?: () => void;
  }) => (
    <Button
      variant={selectedView === value ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-2",
        selectedView === value && "bg-secondary"
      )}
      onClick={() => {
        setSelectedView(value);
        onClick?.();
      }}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );

  const NavigationItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="space-y-2">
      <SidebarItem value="overview" label="Overview" icon={BarChart3} onClick={onItemClick} />
      <SidebarItem value="timeline" label="Timeline" icon={Clock} onClick={onItemClick} />
      <SidebarItem value="success" label="Success Metrics" icon={TrendingUp} onClick={onItemClick} />
      <SidebarItem value="insights" label="Insights" icon={Lightbulb} onClick={onItemClick} />
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <div className="w-full max-w-md px-4">
        <Card className="w-full">
            <CardContent className="pt-10 pb-8 px-6 text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold tracking-tight">
                  Start Tracking Your Applications
                </h3>
                <p className="text-muted-foreground">
                  Begin your job search journey by adding your first application. 
                  Track your progress, monitor responses, and gain valuable insights 
                  into your job search analytics.
                </p>
              </div>
                <div className="mt-6">
                    <CreateJobDialog />
                </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );

  const AnalyticsContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Applications Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getApplicationsOverTime()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response Rate</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getResponseRate()}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {getResponseRate().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interview Success Rate</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getInterviewSuccess()}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {getInterviewSuccess().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Types Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={Object.entries(getJobTypeDistribution()).map(([type, count]) => ({ type, count }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8">
                {Object.entries(getJobTypeDistribution()).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const getContent = () => {
    switch (selectedView) {
      case 'overview':
        return <AnalyticsContent />;
      case 'timeline':
        return <div>Timeline Content</div>;
      case 'success':
        return <div>Success Metrics Content</div>;
      case 'insights':
        return <div>Insights Content</div>;
      default:
        return null;
    }
  };

  if (jobs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex h-full">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex border-r">
        <SidebarHeader className="p-6">
          <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
        </SidebarHeader>
        <SidebarContent className="p-4">
          <NavigationItems />
        </SidebarContent>
      </Sidebar>

      {/* Mobile Sheet */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader className="space-y-1">
              <SheetTitle className="text-lg font-semibold">
                Analytics Dashboard
              </SheetTitle>
              <p className="text-sm text-muted-foreground">
                Navigate through different analytics views
              </p>
            </SheetHeader>
            <nav className="mt-6">
              <NavigationItems onItemClick={() => setIsOpen(false)} />
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          {getContent()}
        </div>
      </div>
    </div>
  );
};

const AnalyticsDashboard = () => {
    return (
        <SidebarProviderContext>
          <AnalyticsDashboardContent />
        </SidebarProviderContext>
    );
  };
  
  export default AnalyticsDashboard;