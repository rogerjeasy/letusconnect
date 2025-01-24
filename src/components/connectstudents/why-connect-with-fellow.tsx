"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap, Users, Briefcase, Target, Award,
  Globe, ArrowRight, Rocket, Heart, Brain,
  TrendingUp, HandshakeIcon, Zap, BookOpen,
  Share2, ChartBar, MessageCircle, Clock,
  Star
} from 'lucide-react';
import { Separator } from '../ui/separator';

const WhyConnect = () => {
  const benefits = [
    {
      icon: <GraduationCap className="h-8 w-8 text-blue-500" />,
      title: "Academic Excellence",
      description: "Share knowledge, collaborate on research, and enhance your learning experience through peer connections.",
      stats: "90% of students report improved academic performance through collaboration",
      features: ["Research partnerships", "Study groups", "Knowledge sharing"]
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Networking Opportunities",
      description: "Build lasting relationships with fellow students and alumni who share your academic and professional interests.",
      stats: "Connect with 5000+ alumni across 50+ countries",
      features: ["Industry meetups", "Alumni mentorship", "Peer networking"]
    },
    {
      icon: <Briefcase className="h-8 w-8 text-purple-500" />,
      title: "Career Development",
      description: "Access job opportunities, mentorship, and industry insights from experienced alumni in your field.",
      stats: "75% of jobs are found through networking",
      features: ["Job referrals", "Career guidance", "Industry connections"]
    },
    {
      icon: <Target className="h-8 w-8 text-red-500" />,
      title: "Goal Achievement",
      description: "Find support and guidance to reach your academic and professional goals through our community.",
      stats: "85% goal achievement rate with peer support",
      features: ["Accountability partners", "Success tracking", "Community support"]
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      title: "Professional Growth",
      description: "Develop new skills and gain valuable experience through collaborative projects and knowledge sharing.",
      stats: "2x faster skill development through peer learning",
      features: ["Skill workshops", "Project collaboration", "Expert sessions"]
    },
    {
      icon: <Globe className="h-8 w-8 text-cyan-500" />,
      title: "Global Perspective",
      description: "Connect with diverse peers worldwide and broaden your understanding of different cultures and practices.",
      stats: "Connect with students from 100+ countries",
      features: ["Cultural exchange", "Global networking", "Diverse perspectives"]
    }
  ];

  const successStories = [
    {
      name: "Research Collaboration",
      story: "Two students connected through our platform and published a groundbreaking research paper",
      icon: <Brain className="h-6 w-6 text-purple-500" />
    },
    {
      name: "Career Success",
      story: "An alumni connection led to a dream job opportunity at a leading tech company",
      icon: <TrendingUp className="h-6 w-6 text-green-500" />
    },
    {
      name: "Startup Launch",
      story: "Three students met through our platform and founded a successful startup",
      icon: <Rocket className="h-6 w-6 text-red-500" />
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center mb-12"
      >
        <Badge className="mb-4 px-4 py-1 bg-blue-100 text-blue-800">
          Join 10,000+ Students & Alumni
        </Badge>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Why Connect With Fellow Students?
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Discover the power of building meaningful connections within our academic community
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>24/7 Community Access</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MessageCircle className="h-4 w-4" />
            <span>Active Discussions</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Share2 className="h-4 w-4" />
            <span>Global Network</span>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Benefits Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-2">
              <Star className="h-4 w-4 mr-1" /> Key Benefits
            </Badge>
            <h2 className="text-2xl font-bold">Unlock Your Full Potential</h2>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {benefit.icon}
                    </div>
                    <Badge variant="secondary" className="mb-2">
                      {benefit.stats}
                    </Badge>
                    <CardTitle className="text-xl mb-2">{benefit.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {benefit.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {benefit.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <Separator className="my-12" />

        {/* Success Stories Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-2">
              <Star className="h-4 w-4 mr-1" /> Success Stories
            </Badge>
            <h2 className="text-2xl font-bold">Real Impact, Real Results</h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group bg-white/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="mb-4 p-3 bg-white rounded-full inline-block shadow-sm transform group-hover:scale-110 transition-transform duration-300">
                      {story.icon}
                    </div>
                    <CardTitle className="text-xl mb-2">{story.name}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {story.story}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 text-center space-y-4"
      >
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-600">Learn Together</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="text-sm text-gray-600">Support Each Other</span>
          </div>
          <div className="flex items-center gap-2">
            <ChartBar className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-600">Grow Together</span>
          </div>
        </div>
        
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg font-semibold transform hover:scale-105 transition-all duration-300"
          onClick={() => window.location.href = '/register'}
        >
          Join Our Community Today
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default WhyConnect;