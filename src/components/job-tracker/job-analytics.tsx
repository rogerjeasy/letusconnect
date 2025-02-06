"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useJobStore } from '@/store/useJobStore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface ChartDataPoint {
    name: string;
    value: number;
   }

type TimelineData = {
    [key: string]: number;
  };

const AnalyticsDashboard = () => {
  const jobs = useJobStore(state => state.jobs);

  // Application Timeline Data
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

  // Response Rate Data
  const getResponseRate = () => {
    const total = jobs.length;
    const responded = jobs.filter(job => 
      ['INTERVIEW', 'OFFER', 'REJECTED'].includes(job.status)
    ).length;
    
    return [
      { name: 'Responded', value: responded },
      { name: 'Pending', value: total - responded }
    ];
  };

  // Interview Success Rate
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

  // Job Types Distribution
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

  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="success">Success Metrics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="timeline">
          {/* Detailed application timeline visualization */}
        </TabsContent>

        <TabsContent value="success">
          {/* Detailed success metrics */}
        </TabsContent>

        <TabsContent value="insights">
          {/* AI-powered insights and recommendations */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;