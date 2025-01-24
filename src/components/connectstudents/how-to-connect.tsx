"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  UserPlus,
  MessageSquare,
  Check,
  ArrowRight,
  AlertCircle,
  Users,
  BookOpen,
  Target,
  Heart,
  Calendar,
  ThumbsUp,
  Lightbulb,
  Clock,
  Shield
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const HowToConnect = () => {
  const router = useRouter();
  
  const bestPractices = [
    {
      icon: <Target className="h-6 w-6 text-purple-500" />,
      title: "Be Purposeful",
      description: "Connect with those who share your academic or career interests."
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Be Genuine",
      description: "Authenticity builds lasting professional relationships."
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      title: "Be Patient",
      description: "Quality connections take time to develop and nurture."
    },
    {
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: "Be Professional",
      description: "Maintain professional etiquette in all interactions."
    }
  ];

  const steps = [
    {
      icon: <Search className="h-12 w-12 text-blue-500" />,
      title: "Find Users",
      description: "Search for students and alumni using the directory. Filter by program, interests, or expertise.",
      tip: "Use specific keywords in your search to find the most relevant connections.",
      extraTips: [
        "Review profiles thoroughly before connecting",
        "Look for shared interests or academic background",
        "Consider mutual connections"
      ],
      action: () => router.push('/users-directory'),
      badge: "Essential First Step"
    },
    {
      icon: <UserPlus className="h-12 w-12 text-green-500" />,
      title: "Send Connection Request",
      description: "Click 'Connect' and include a personalized message explaining why you'd like to connect.",
      tip: "A personalized message increases the chances of your request being accepted.",
      extraTips: [
        "Mention specific points from their profile",
        "Highlight mutual interests or goals",
        "Keep your message concise but meaningful"
      ],
      action: null,
      badge: "Critical Success Factor"
    },
    {
      icon: <MessageSquare className="h-12 w-12 text-purple-500" />,
      title: "Start a Conversation",
      description: "Once connected, engage through direct messages or join common interest groups.",
      tip: "Start with shared interests or experiences to build rapport.",
      extraTips: [
        "Ask open-ended questions",
        "Share relevant industry insights",
        "Follow up on previous discussions"
      ],
      action: () => router.push('/groups'),
      badge: "Engagement Phase"
    },
    {
      icon: <Users className="h-12 w-12 text-orange-500" />,
      title: "Grow Your Network",
      description: "Participate in events, join groups, and engage with the community to expand your connections.",
      tip: "Regular engagement helps build stronger professional relationships.",
      extraTips: [
        "Attend virtual and in-person events",
        "Contribute to group discussions",
        "Share your expertise and experiences"
      ],
      action: () => router.push('/events/networking'),
      badge: "Network Expansion"
    }
  ];

  const etiquetteTips = [
    "Respond to messages promptly",
    "Keep conversations professional",
    "Respect others' time and boundaries",
    "Share valuable insights and resources",
    "Maintain active engagement",
    "Support fellow community members"
  ];

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
            Master the art of building meaningful professional relationships
          </p>
        </motion.div>

        <Tabs defaultValue="guide" className="mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="guide">Step-by-Step Guide</TabsTrigger>
            <TabsTrigger value="practices">Best Practices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guide" className="space-y-6">
            <Alert className="mb-8 bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                Pro tip: Building meaningful connections starts with genuine interactions and shared interests.
              </AlertDescription>
            </Alert>

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index !== steps.length - 1 && (
                  <div className="absolute left-8 top-24 bottom-0 w-0.5 bg-gray-200" />
                )}
                <Card className="relative z-10 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-white rounded-full shadow-sm">
                          {step.icon}
                        </div>
                        <Badge variant="secondary" className="mt-2">
                          {step.badge}
                        </Badge>
                      </div>
                      <div className="flex-grow space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Lightbulb className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">Key Tip:</span>
                            <span>{step.tip}</span>
                          </div>
                          <div className="pl-6">
                            {step.extraTips.map((tip, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                                <Check className="h-3 w-3 text-green-500" />
                                <span>{tip}</span>
                              </div>
                            ))}
                          </div>
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
          </TabsContent>

          <TabsContent value="practices">
            <Card>
              <CardHeader>
                <CardTitle>Professional Networking Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bestPractices.map((practice, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm"
                    >
                      <div className="p-2 bg-gray-50 rounded-full">
                        {practice.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{practice.title}</h4>
                        <p className="text-sm text-gray-600">{practice.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    Networking Etiquette
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {etiquetteTips.map((tip, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <ThumbsUp className="h-4 w-4 text-green-500" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
            Start Building Your Network
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default HowToConnect;