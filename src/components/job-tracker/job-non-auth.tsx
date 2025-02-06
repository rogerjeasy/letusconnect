"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  LogIn, 
  UserPlus, 
  CheckCircle, 
  BarChart, 
  Bell, 
  FileSpreadsheet,
  TrendingUp,
  Clock
} from "lucide-react";
import { useRouter } from "next/navigation";

export const JobTrackerNoAuth: React.FC = () => {
  const router = useRouter();

  const featureHighlights = [
    {
      icon: <CheckCircle className="w-8 h-8 text-blue-500" />,
      title: "Comprehensive Application Tracking",
      description: "Effortlessly monitor the status of every job application. Our intelligent system helps you stay organized with real-time updates and deadline reminders.",
      benefit: "Never miss a critical application deadline or follow-up opportunity."
    },
    {
      icon: <BarChart className="w-8 h-8 text-green-500" />,
      title: "Actionable Career Insights",
      description: "Gain deep insights into your job search performance through advanced analytics. Track application success rates, identify improvement areas, and optimize your strategy.",
      benefit: "Transform your job search from guesswork to a data-driven approach."
    },
    {
      icon: <Bell className="w-8 h-8 text-purple-500" />,
      title: "Intelligent Job Matching",
      description: "Receive personalized job alerts tailored to your professional profile, skills, and career aspirations. Our smart algorithm filters and recommends most relevant opportunities.",
      benefit: "Discover ideal job openings that align perfectly with your career goals."
    }
  ];

  const additionalFeatures = [
    {
      icon: <FileSpreadsheet className="w-6 h-6 text-orange-500" />,
      title: "Application Portfolio Management",
      description: "Create and maintain a comprehensive digital portfolio of your job applications, tracking every stage of your professional journey."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-teal-500" />,
      title: "Career Progression Tracking",
      description: "Monitor your career trajectory, identify skill gaps, and strategically plan your professional development."
    },
    {
      icon: <Clock className="w-6 h-6 text-indigo-500" />,
      title: "Time-Saving Automation",
      description: "Streamline your job search with automated tracking, reducing manual effort and increasing efficiency."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
          Revolutionize Your Job Search Strategy
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          A cutting-edge platform designed to transform your job application process from overwhelming to optimized, giving you a competitive edge in today's dynamic job market.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            size="lg" 
            onClick={() => router.push("/login")} 
            className="w-full sm:w-auto"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Login
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => router.push("/register")} 
            className="w-full sm:w-auto"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Register
          </Button>
        </div>
      </div>

      {/* Core Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {featureHighlights.map((feature, index) => (
          <Card 
            key={index} 
            className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200"
          >
            <CardHeader>
              <div className="flex items-center gap-4 mb-2">
                {feature.icon}
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800 font-medium">
                  {feature.benefit}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Features Section */}
      <div className="bg-gray-50 rounded-xl p-8 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Beyond Basic Tracking
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our Job Tracker offers comprehensive tools that go far beyond simple application monitoring.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {additionalFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                {feature.icon}
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Your Career Deserves Smart Management
        </h2>
        <p className="text-base md:text-lg mb-8 max-w-3xl mx-auto">
          Join thousands of ambitious professionals who have transformed their job search with our intelligent tracking platform. Your next career breakthrough starts here.
        </p>
        <Button
          variant="secondary"
          size="lg"
          className="bg-white text-blue-700 hover:bg-gray-100 w-full sm:w-auto"
          onClick={() => router.push("/register")}
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Start Your Journey Now
        </Button>
      </div>
    </div>
  );
};