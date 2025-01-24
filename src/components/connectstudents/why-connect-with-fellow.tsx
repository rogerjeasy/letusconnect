"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  Users,
  Briefcase,
  Target,
  Award,
  Globe,
  ArrowRight
} from 'lucide-react';

const WhyConnect = () => {
  const benefits = [
    {
      icon: <GraduationCap className="h-8 w-8 text-blue-500" />,
      title: "Academic Excellence",
      description: "Share knowledge, collaborate on research, and enhance your learning experience through peer connections."
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Networking Opportunities",
      description: "Build lasting relationships with fellow students and alumni who share your academic and professional interests."
    },
    {
      icon: <Briefcase className="h-8 w-8 text-purple-500" />,
      title: "Career Development",
      description: "Access job opportunities, mentorship, and industry insights from experienced alumni in your field."
    },
    {
      icon: <Target className="h-8 w-8 text-red-500" />,
      title: "Goal Achievement",
      description: "Find support and guidance to reach your academic and professional goals through our community."
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      title: "Professional Growth",
      description: "Develop new skills and gain valuable experience through collaborative projects and knowledge sharing."
    },
    {
      icon: <Globe className="h-8 w-8 text-cyan-500" />,
      title: "Global Perspective",
      description: "Connect with diverse peers worldwide and broaden your understanding of different cultures and practices."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Why Connect With Fellow Students?
        </h1>
        <p className="text-xl text-gray-600">
          Discover the power of building meaningful connections within our academic community
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {benefits.map((benefit, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mb-4">{benefit.icon}</div>
                <CardTitle className="text-xl mb-2">{benefit.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {benefit.description}
                </CardDescription>
              </CardHeader>
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg font-semibold"
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