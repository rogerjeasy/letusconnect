"use client";
import React, { useState, useEffect } from "react";
import { Spinner, Button, Card, Progress, Divider } from "@nextui-org/react";
import Footer from "./homepage/Footer";
import TopNav from "./navbar/TopNav";
import { 
  FiRefreshCw, 
  FiHeadphones, 
  FiShield, 
  FiUsers, 
  FiBookOpen,
  FiAward,
  FiTrendingUp,
  FiGlobe 
} from "react-icons/fi";

const SessionCheck = ({ onRetry }: { onRetry: () => void }) => {
  const [isTakingLong, setIsTakingLong] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const checkingSteps = [
    { 
      title: "Verifying credentials", 
      description: "Ensuring secure access to your account",
      color: "text-indigo-600"
    },
    { 
      title: "Loading your profile", 
      description: "Preparing your personalized experience",
      color: "text-violet-600"
    },
    { 
      title: "Checking network status", 
      description: "Connecting to your professional network",
      color: "text-purple-600"
    },
    { 
      title: "Preparing workspace", 
      description: "Setting up your collaboration environment",
      color: "text-blue-600"
    }
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTakingLong(true);
    }, 5000);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < checkingSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? 90 : prev + 10));
    }, 500);

    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const features = [
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Network & Collaborate",
      description: "Connect with fellow students, alumni, and industry experts",
      bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50",
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-100"
    },
    {
      icon: <FiAward className="w-6 h-6" />,
      title: "Learn & Grow",
      description: "Access resources, mentorship, and career opportunities",
      bgColor: "bg-gradient-to-br from-violet-50 to-purple-50",
      iconColor: "text-violet-600",
      borderColor: "border-violet-100"
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Secure Platform",
      description: "Your data is protected with enterprise-grade security",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-100"
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-gray-50 flex flex-col">
      <TopNav />
      {/* Content */}
      <div className="flex-grow flex items-center justify-center mt-16 sm:mt-20 md:mt-24 lg:mt-28">
        <Card className="max-w-2xl w-full mx-4 p-8 shadow-lg bg-white/70 backdrop-blur-sm">
          <div className="relative z-10 text-center">
            {/* Header */}
            <div className="mb-8 flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <h1 className="text-4xl font-bold text-white">LC</h1>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Let Us Connect
              </h2>
              <p className="text-gray-600 mt-2 font-medium">HSLU's Master's Program Networking Platform</p>
              <p className="text-sm text-gray-600 mt-2 max-w-md leading-relaxed">
                Your gateway to professional networking, mentorship, and career growth in Applied Information and Data Science
              </p>
            </div>

            {/* Loading Section */}
            <div className="space-y-8">
              {/* Progress Indicator */}
              <div className="w-full space-y-2">
                <Progress
                  aria-label="Session check progress"
                  value={progress}
                  className="max-w-md mx-auto"
                  color="primary"
                  showValueLabel={true}
                  size="md"
                />
                <p className="text-sm font-medium text-gray-600">
                  Step {currentStep + 1} of {checkingSteps.length}
                </p>
              </div>

              {/* Current Step Display */}
              <div className="bg-gradient-to-r from-blue-50 to-violet-50 p-6 rounded-xl max-w-md mx-auto border border-blue-100/50 shadow-sm">
                <h3 className={`font-semibold text-lg ${checkingSteps[currentStep].color}`}>
                  {checkingSteps[currentStep].title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {checkingSteps[currentStep].description}
                </p>
              </div>

              {/* Loading Animation */}
              <div className="flex justify-center">
                <Spinner size="lg" className="text-blue-600" />
              </div>

              {/* Feature Showcase */}
              {!isTakingLong && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  {features.map((feature, index) => (
                    <div 
                      key={index} 
                      className={`p-6 rounded-xl ${feature.bgColor} border ${feature.borderColor} shadow-sm transition-all duration-300 hover:shadow-md`}
                    >
                      <div className={`flex items-center justify-center ${feature.iconColor} mb-3`}>
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {isTakingLong && (
                <div className="space-y-6 max-w-md mx-auto">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-100">
                    <h3 className="text-red-700 font-semibold mb-3 text-lg">
                      Taking longer than expected
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      We're experiencing delays in establishing your secure connection. This might be due to network connectivity or high server load.
                    </p>
                    <div className="flex flex-col gap-3">
                      <Button
                        startContent={<FiRefreshCw className="w-5 h-5" />}
                        onClick={onRetry}
                        className="bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                        size="lg"
                      >
                        Try Again
                      </Button>
                      <Button
                        startContent={<FiHeadphones className="w-5 h-5" />}
                        onClick={() => (window.location.href = "/contact-us")}
                        variant="bordered"
                        className="border-2"
                        size="lg"
                      >
                        Contact Support
                      </Button>
                      <div className="text-sm text-gray-600 mt-2 bg-white/50 p-3 rounded-lg">
                        <p className="font-medium">Support ID: {Math.random().toString(36).substr(2, 9)}</p>
                        <p className="mt-1">Need immediate assistance? Contact our support team</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      <div className="relative w-full">
        <Footer />
      </div>
    </div>
  );
};

export default SessionCheck;

