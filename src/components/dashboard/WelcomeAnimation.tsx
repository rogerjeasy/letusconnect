"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { projectsAuthComponents } from "@/components/utils/projectsOptions";
import { mentorshipAuthComponents } from "@/components/utils/mentorshipOptions";
import { connectAuthComponents } from "@/components/utils/connectStudentOptions";
import { eventsAuthComponents } from "@/components/utils/eventOptions";
import { jobsAuthComponents } from "@/components/utils/jobOptions";
import { groupsAuthComponents } from "@/components/utils/forumOptions";
import {
  Users,
  GraduationCap,
  Briefcase,
  Globe2,
} from 'lucide-react';

interface WelcomeAnimationProps {
  username: string;
  onClose: () => void;
}

const WelcomeAnimation = ({ username, onClose }: WelcomeAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  const sections = [
    { 
      title: "Connect",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      components: connectAuthComponents
    },
    { 
      title: "Projects",
      icon: Briefcase,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
      components: projectsAuthComponents
    },
    { 
      title: "Mentorship",
      icon: GraduationCap,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
      components: mentorshipAuthComponents
    },
    { 
      title: "Events",
      icon: Globe2,
      color: "text-cyan-500",
      bgColor: "bg-cyan-100",
      components: eventsAuthComponents
    },
    { 
      title: "Groups",
      icon: Users,
      color: "text-rose-500",
      bgColor: "bg-rose-100",
      components: groupsAuthComponents
    },
    { 
      title: "Jobs",
      icon: Briefcase,
      color: "text-amber-500",
      bgColor: "bg-amber-100",
      components: jobsAuthComponents
    }
  ];

  useEffect(() => {
    const animationTimer = setInterval(() => {
      setAnimationPhase(prev => {
        if (prev >= sections.length) {
          setTimeout(() => {
            setAnimationPhase(0);
          }, 2000); // Wait 2 seconds when fully revealed
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => {
      clearInterval(animationTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl w-full max-w-7xl my-8 relative"
          >
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-red-100 bg-red-500 transition-colors"
                >
                <X className="h-6 w-6 text-white" />
                </button>
           
            <div className="text-center p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">Welcome, {username}!</h2>
              <p className="text-gray-600">Your gateway to professional networking and growth. Features overview</p>
            </div>

            <div className="px-4 md:px-6 lg:px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {sections.map(({ title, icon: Icon, color, bgColor, components }, sectionIndex) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: sectionIndex <= animationPhase ? 1 : 0,
                      y: sectionIndex <= animationPhase ? 0 : 20
                    }}
                    transition={{ duration: 0.5, delay: sectionIndex * 0.2 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                  >
                    <div className={`p-4 ${bgColor} flex items-center gap-3`}>
                      <Icon className={`h-5 w-5 ${color}`} />
                      <h3 className="font-semibold text-base md:text-lg">{title}</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {components.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {item.icon}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            <p className="text-gray-600 text-xs md:text-sm line-clamp-2">{item.description}</p>
                          </div>
                        </div>
                      ))}
                      {components.length > 3 && (
                        <p className="text-xs md:text-sm text-gray-500 italic">
                          And {components.length - 3} more options...
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="h-1 bg-gray-100 rounded-full overflow-hidden mt-8">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAnimation;