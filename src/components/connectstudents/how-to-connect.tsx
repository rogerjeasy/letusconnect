import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Search,
  UserPlus,
  MessageSquare,
  Check,
  ArrowRight,
  AlertCircle,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const HowToConnect = () => {
  const router = useRouter();
  
  const steps = [
    {
      icon: <Search className="h-12 w-12 text-blue-500" />,
      title: "Find Users",
      description: "Search for students and alumni using the directory. Filter by program, interests, or expertise.",
      tip: "Use specific keywords in your search to find the most relevant connections.",
      action: () => router.push('/users-directory')
    },
    {
      icon: <UserPlus className="h-12 w-12 text-green-500" />,
      title: "Send Connection Request",
      description: "Click 'Connect' and include a personalized message explaining why you'd like to connect.",
      tip: "A personalized message increases the chances of your request being accepted.",
      action: null
    },
    {
      icon: <MessageSquare className="h-12 w-12 text-purple-500" />,
      title: "Start a Conversation",
      description: "Once connected, engage through direct messages or join common interest groups.",
      tip: "Start with shared interests or experiences to build rapport.",
      action: () => router.push('/groups')
    },
    {
      icon: <Users className="h-12 w-12 text-orange-500" />,
      title: "Grow Your Network",
      description: "Participate in events, join groups, and engage with the community to expand your connections.",
      tip: "Regular engagement helps build stronger professional relationships.",
      action: () => router.push('/events/networking')
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How to Connect
          </h1>
          <p className="text-xl text-gray-600">
            Follow these simple steps to start building your professional network
          </p>
        </motion.div>

        <Alert className="mb-8 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            Pro tip: Building meaningful connections starts with genuine interactions and shared interests.
          </AlertDescription>
        </Alert>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
            >
              {index !== steps.length - 1 && (
                <div className="absolute left-8 top-24 bottom-0 w-0.5 bg-gray-200" />
              )}
              <Card className="relative z-10 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 p-3 bg-white rounded-full shadow-sm">
                      {step.icon}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Tip: {step.tip}</span>
                      </div>
                    </div>
                    {step.action && (
                      <Button
                        onClick={step.action}
                        className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Button
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full text-lg font-semibold"
            onClick={() => router.push('/users-directory')}
          >
            Start Connecting Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default HowToConnect;