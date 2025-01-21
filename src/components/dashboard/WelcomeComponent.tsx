"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  UserCircle,
  Settings,
  BadgeCheck,
  GraduationCap,
  LayoutDashboard,
  ChevronRight,
  Briefcase,
  Globe2,
  Award,
  Users,
  Medal,
  MessageSquare
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { getProfileCompletion } from "@/services/users.services";
import { cn } from '@/lib/utils';
import LoadingPage from '../loadingpage/LoadingPage';
import WelcomeAnimation from './WelcomeAnimation';

interface ProfileCompletion {
  completionPercentage: number;
  filledFields: number;
  totalFields: number;
  missingFields: string[];
  profileStatus: string;
}

const WelcomeComponent = () => {
  const { user, isAuthenticated, loading, hasChecked, checkSession } = useUserStore();
  const router = useRouter();
  const [profileStatus, setProfileStatus] = useState<ProfileCompletion | null>(null);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);

  useEffect(() => {
    if (!hasChecked) {
      checkSession();
    }
  }, [checkSession, hasChecked]);

  useEffect(() => {
    const fetchProfileStatus = async () => {
      if (isAuthenticated && hasChecked && !loading) {
        const status = await getProfileCompletion();
        setProfileStatus(status);
      }
    };
  
    fetchProfileStatus();
  }, [user, isAuthenticated, hasChecked, loading]);

  if (!hasChecked || loading) {
    return <LoadingPage />;
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 py-16">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-white rounded-lg p-6 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!isAuthenticated || !user) {
    router.replace('/login');
    return null;
  }

  const profileSections = [
    {
      icon: UserCircle,
      title: "Personal Information",
      description: "Add your basic information, bio, and profile picture",
      completed: !!(user.firstName && user.lastName && user.bio && user.profilePicture),
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      icon: Briefcase,
      title: "Professional Background",
      description: "Share your work experience and current role",
      completed: !!user.currentJobTitle,
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    },
    {
      icon: GraduationCap,
      title: "Educational Background",
      description: "Add your academic qualifications and achievements",
      completed: !!user.program,
      color: "text-green-500",
      bgColor: "bg-green-100"
    },
    {
      icon: Award,
      title: "Skills & Expertise",
      description: "List your skills and areas of expertise",
      completed: !!(user.skills?.length > 0 && user.areasOfExpertise?.length > 0),
      color: "text-amber-500",
      bgColor: "bg-amber-100"
    }
  ];

  const quickStats = [
    {
      icon: Users,
      label: "Connections Made",
      value: user.connectionsMade || 0,
      color: "text-indigo-500"
    },
    {
      icon: MessageSquare,
      label: "Messages Exchanged",
      value: "Coming Soon",
      color: "text-emerald-500"
    },
    {
      icon: Globe2,
      label: "Languages",
      value: user.languages?.length || 0,
      color: "text-cyan-500"
    },
    {
      icon: Medal,
      label: "Certifications",
      value: user.certifications?.length || 0,
      color: "text-rose-500"
    }
  ];

  return (
    <>
    {showWelcomeAnimation && <WelcomeAnimation username={user.username} onClose={() => setShowWelcomeAnimation(false)} />}
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="space-y-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-4xl md:text-6xl font-extrabold text-gray-800">
                    Quick Profile Overview, {user.username}! 👋
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">
                    {profileStatus?.profileStatus === 'COMPLETE' 
                      ? 'Your profile is complete! Start connecting with others and exploring opportunities.'
                      : 'Complete your profile to make meaningful connections and get the most out of our platform'}
                  </CardDescription>
                </div>
                {profileStatus?.completionPercentage === 100 && (
                  <div className="hidden md:block">
                    <div className="p-3 rounded-full bg-green-100">
                      <BadgeCheck className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Profile Completion</span>
                    <span className="text-xs text-gray-500">
                      ({profileStatus?.filledFields || 0}/{profileStatus?.totalFields || 0} fields)
                    </span>
                  </div>
                  <span className="text-sm font-medium">{profileStatus?.completionPercentage || 0}%</span>
                </div>
                <Progress 
                  value={profileStatus?.completionPercentage || 0} 
                  className="h-2 bg-gray-100"
                />
                {profileStatus?.missingFields && profileStatus.missingFields.length > 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    <p className="font-medium text-primary/80">Missing information:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {profileStatus.missingFields.map((field, index) => (
                        <li key={index} className="text-sm">{field}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-full", stat.color.replace("text", "bg").concat("/20"))}>
                        <stat.icon className={cn("h-5 w-5", stat.color)} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-lg font-semibold">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                onClick={() => router.push('/profile-settings')}
              >
                <Settings className="mr-2 h-5 w-5" />
                Complete Profile
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto border-2"
                onClick={() => router.push('/dashboard')}
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Go to Dashboard
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileSections.map((section, index) => (
              <Card 
                key={index} 
                className={cn(
                  "border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm",
                  section.completed && "bg-primary/5"
                )}
                onClick={() => router.push('/settings')}
              >
                <CardHeader className="flex flex-row items-center space-y-0 gap-4">
                  <div className={cn("p-3 rounded-full", section.completed ? section.bgColor : "bg-gray-100")}>
                    <section.icon className={cn("h-6 w-6", section.completed ? section.color : "text-gray-400")} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      {section.title}
                      {section.completed && (
                        <BadgeCheck className="h-5 w-5 text-green-500" />
                      )}
                    </CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                  <ChevronRight className={cn("h-5 w-5", section.completed ? "text-primary" : "text-gray-400")} />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default WelcomeComponent;