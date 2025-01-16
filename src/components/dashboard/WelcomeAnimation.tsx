"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import {
  Users,
  GraduationCap,
  Briefcase,
  Globe2,
  BookOpen,
  MessageSquare,
  Trophy,
  Handshake,
} from 'lucide-react';

interface WelcomeAnimationProps {
  onClose: () => void;
}

const WelcomeAnimation = ({ onClose }: WelcomeAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  const icons = [
    { Icon: Users, label: "Connect" },
    { Icon: GraduationCap, label: "Learn" },
    { Icon: Briefcase, label: "Work" },
    { Icon: Globe2, label: "Network" },
    { Icon: BookOpen, label: "Share" },
    { Icon: MessageSquare, label: "Communicate" },
    { Icon: Trophy, label: "Achieve" },
    { Icon: Handshake, label: "Collaborate" }
  ];

  useEffect(() => {
    // Auto-close after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 10000);

    // Animation phases
    const animationTimer = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % (icons.length + 1));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(animationTimer);
    };
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 relative overflow-hidden"
      >
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">Welcome to Let&apos;s Connect!</h2>
          <p className="text-gray-600">Your gateway to professional networking and growth</p>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          {icons.map(({ Icon, label }, index) => (
            <div
              key={label}
              className={`flex flex-col items-center transition-all duration-500 transform
                ${index <= animationPhase ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            >
              <div className="p-3 rounded-full bg-primary/10 mb-2">
                <Icon 
                  className={`h-8 w-8 text-primary ${index === animationPhase ? 'animate-bounce' : ''}`} 
                />
              </div>
              <span className="text-sm font-medium text-gray-600">{label}</span>
            </div>
          ))}
        </div>

        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-100"
            style={{ width: `${(animationPhase / (icons.length + 1)) * 100}%` }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeAnimation;