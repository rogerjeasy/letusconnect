"use client";

import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import {
  Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line
} from "recharts";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { TrendingUp, Users, Award, Rocket, Globe, Book, Brain, Target, Briefcase } from "lucide-react";
import { allStats, getTopPerformers } from "@/components/utils/allStatData";
import { SwissDistributionChart } from "./SwissCantonData";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface ClientOnlyCountUpProps {
  end: number;
  duration?: number;
  separator?: string;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

const numberFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const ClientOnlyCountUp: React.FC<ClientOnlyCountUpProps> = ({ 
  end, 
  duration = 2.5, 
  ...props 
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <span>{numberFormatter.format(end)}{props.suffix || ''}</span>;
  }

  return <CountUp end={end} duration={duration} {...props} />;
};

export default function CommunityStats() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  // Get top performers for different categories
  const topSkills = getTopPerformers('skillDevelopment', 6);
  const topRegions = getTopPerformers('geographicReach', 4);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
            Platform Analytics & Community Insights 📊
          </h2>
          <p className="text-lg text-gray-600">
            Explore our community&apos;s growth and impact through interactive visualizations
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <ClientOnlyCountUp end={allStats.platformMetrics.activeUsers.monthly} separator="," />
            </div>
            <p className="text-xs text-muted-foreground">
              +{allStats.platformMetrics.activeUsers.yearlyGrowth}% yearly growth
            </p>
          </CardContent>
        </Card>

          <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Rocket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <ClientOnlyCountUp end={allStats.projectCollaborations.activeProjects} />
              </div>
              <p className="text-xs text-muted-foreground">
                {allStats.projectCollaborations.successRate}% success rate
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Global Reach</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <ClientOnlyCountUp end={allStats.geographicReach.countries} suffix="+" />
              </div>
              <p className="text-xs text-muted-foreground">
                {allStats.geographicReach.cities} cities worldwide
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <ClientOnlyCountUp end={allStats.platformMetrics.userSatisfaction.overall} decimals={1} suffix="/5" />
              </div>
              <p className="text-xs text-muted-foreground">Overall satisfaction score</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Monthly Engagement Chart */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Monthly Engagement Metrics</CardTitle>
              <CardDescription>Track community participation across different activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={allStats.monthlyTrends.engagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="events" fill="#8884d8" name="Events" />
                  <Bar dataKey="mentoring" fill="#82ca9d" name="Mentoring Sessions" />
                  <Bar dataKey="workshops" fill="#ffc658" name="Workshops" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>User distribution by region</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={allStats.geographicReach.regions}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, users }) => `${name} (${users})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="users"
                  >
                    {allStats.geographicReach.regions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Skills Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Community Skills</CardTitle>
              <CardDescription>Skill proficiency and demand</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart outerRadius="80%" data={allStats.skillDevelopment.skillsTracked}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar name="Proficiency" dataKey="proficiency" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Demand" dataKey="demand" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <SwissDistributionChart />

          {/* Project Growth Trends */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Project Growth Trends</CardTitle>
              <CardDescription>Monthly project initiatives by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={allStats.monthlyTrends.projectGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="academic" stroke="#8884d8" name="Academic Projects" />
                  <Line type="monotone" dataKey="industry" stroke="#82ca9d" name="Industry Collaborations" />
                  <Line type="monotone" dataKey="research" stroke="#ffc658" name="Research Initiatives" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Mentors</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <ClientOnlyCountUp end={allStats.mentorshipStats.activeMentors} />
              </div>
              <p className="text-xs text-muted-foreground">
                {numberFormatter.format(allStats.mentorshipStats.totalSessions)} total sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Publications</CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <ClientOnlyCountUp end={allStats.academicMetrics.researchOutput.publications} />
              </div>
              <p className="text-xs text-muted-foreground">
                {allStats.academicMetrics.researchOutput.citations} citations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Career Impact</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <ClientOnlyCountUp 
                  end={allStats.careerImpact.salaryIncrease.averagePercentage}
                  suffix="%" 
                />
              </div>
              <p className="text-xs text-muted-foreground">Average salary increase</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Startups</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <ClientOnlyCountUp end={allStats.innovationMetrics.startups.launched} />
              </div>
              <p className="text-xs text-muted-foreground">
                ${numberFormatter.format(allStats.innovationMetrics.startups.fundingRaised / 1000000)}M raised
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-gradient-x"></div>
          <Card className="max-w-4xl mx-auto relative backdrop-blur-sm bg-white/90 border-2 border-blue-100 shadow-xl transform hover:scale-[1.01] transition-all duration-300">
            <CardHeader className="space-y-6 text-center pb-8">
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Join Our Growing Community
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Connect with <span className="font-semibold text-blue-600">{allStats.mentorshipStats.industryExperts}+ industry experts</span>,
                  collaborate on innovative projects, and accelerate your career growth
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="text-center pb-8">
              <div className="space-y-6">
                <div className="flex gap-4 justify-center items-center">
                  <Button 
                    className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                    onPress={() => router.push('/get-started')}
                  >
                    <span className="absolute inset-0 w-full h-full mt-1 ml-1 transition-all duration-300 ease-in-out bg-purple-600 rounded-lg group-hover:mt-0 group-hover:ml-0"></span>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></span>
                    <span className="relative flex items-center gap-2">
                      Get Started Today
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Button>
                  
                  <Button 
                    className="px-8 py-3 font-semibold text-blue-600 transition-all duration-300 ease-in-out border-2 border-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    onPress={() => router.push('/explore-the-community')}
                  >
                    Learn More
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500">
                  Join {numberFormatter.format(allStats.platformMetrics.activeUsers.monthly)}+ members already growing their careers
                </p>
              </div>
            </CardContent>

            {/* Trust Badges */}
            <div className="border-t border-gray-100 py-6 px-8 bg-gray-50/50">
              <div className="flex justify-center items-center gap-8">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">SSL Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">100% Safe & Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-gray-600">{allStats.platformMetrics.userSatisfaction.overall}/5 User Rating</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}