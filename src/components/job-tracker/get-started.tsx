import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  ClipboardList, 
  Bell, 
  Target, 
  ChevronRight, 
  LineChart,
  Calendar,
  Search
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUserStore } from '@/store/userStore';
import CreateJobDialog from './create-job-dialog';
import { LoginDialog, NewApplicationDialog } from '../utils/shadcn-dialogs';

// Step Card Sub-component
const StepCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="w-full"
  >
    <Card className="p-6 h-full bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 rounded-full bg-blue-500/10">
          <Icon className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </Card>
  </motion.div>
);

// Feature Item Sub-component
const FeatureItem = ({ 
  icon: Icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="flex items-start gap-4"
  >
    <div className="p-2 rounded-lg bg-blue-500/10 flex-shrink-0">
      <Icon className="w-6 h-6 text-blue-500" />
    </div>
    <div>
      <h4 className="text-lg font-semibold mb-1">{title}</h4>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
    </div>
  </motion.div>
);

// Process Step Sub-component
const ProcessStep = ({ 
  number, 
  title, 
  description, 
  delay 
}: { 
  number: number; 
  title: string; 
  description: string; 
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="flex items-start gap-4"
  >
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
      {number}
    </div>
    <div>
      <h4 className="text-lg font-semibold mb-1">{title}</h4>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
    </div>
  </motion.div>
);

// Main Component
const GetStartedWithJobTracker = () => {
  const currentUser = useUserStore(state => state.user);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showNewAppDialog, setShowNewAppDialog] = useState(false);

  const handleStartTracking = () => {
    if (!currentUser) {
      setShowLoginDialog(true);
    } else {
      setShowNewAppDialog(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Track Your Job Search Journey
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Simplify your job search process with our intelligent tracking system
        </p>
        <Button 
          size="lg"
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleStartTracking}
        >
          Start Tracking Now
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto mb-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StepCard
            icon={Search}
            title="Find Jobs"
            description="Search and discover relevant job opportunities across multiple platforms"
            delay={0.2}
          />
          <StepCard
            icon={ClipboardList}
            title="Track Applications"
            description="Easily log and monitor all your job applications in one place"
            delay={0.4}
          />
          <StepCard
            icon={Calendar}
            title="Manage Interviews"
            description="Schedule and prepare for interviews with built-in reminders"
            delay={0.6}
          />
          <StepCard
            icon={LineChart}
            title="Track Progress"
            description="Visualize your job search progress with detailed analytics"
            delay={0.8}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto mb-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          Powerful Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureItem
            icon={Target}
            title="Smart Application Tracking"
            description="Keep track of all your applications with custom status updates and notes"
            delay={0.2}
          />
          <FeatureItem
            icon={Bell}
            title="Automated Reminders"
            description="Never miss an interview or follow-up with timely notifications"
            delay={0.3}
          />
          <FeatureItem
            icon={LineChart}
            title="Progress Analytics"
            description="Gain insights into your job search performance with detailed metrics"
            delay={0.4}
          />
          <FeatureItem
            icon={Briefcase}
            title="Job Search Organization"
            description="Keep all your job-related information organized in one place"
            delay={0.5}
          />
        </div>
      </div>

      {/* Process Section */}
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          Getting Started is Easy
        </motion.h2>
        <div className="space-y-8">
          <ProcessStep
            number={1}
            title="Create Your Account"
            description="Sign up and set up your profile in just a few minutes"
            delay={0.2}
          />
          <ProcessStep
            number={2}
            title="Add Your Applications"
            description="Start logging your job applications with detailed information"
            delay={0.4}
          />
          <ProcessStep
            number={3}
            title="Track Your Progress"
            description="Monitor your applications and interview stages"
            delay={0.6}
          />
          <ProcessStep
            number={4}
            title="Stay Organized"
            description="Keep all your job search activities organized and up-to-date"
            delay={0.8}
          />
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center mt-20"
      >
        <h2 className="text-3xl font-bold mb-6">
          Ready to Streamline Your Job Search?
        </h2>
        <p className="text-gray-300 mb-8">
          Join thousands of job seekers who have simplified their job search process
        </p>
        <Button 
          size="lg"
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Get Started Now
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>

      {/* Dialogs */}
      <LoginDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)} 
      />
      
      <NewApplicationDialog 
        isOpen={showNewAppDialog}
        onClose={() => setShowNewAppDialog(false)}
      />
    </div>
  );
};

export default GetStartedWithJobTracker;