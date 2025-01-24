"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Network, BookOpen, Rocket, Users, Star,
  Target, Award, Globe, BookMarked, Lightbulb,
  TrendingUp, MessageSquare, Zap
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface WhyJoinCardProps {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  stats: string;
  features: string[];
  gradientFrom: string;
  gradientTo: string;
  animation: {
    type: 'rotate' | 'scale' | 'float';
    duration?: number;
  };
}

const WhyJoinCard: React.FC<WhyJoinCardProps> = ({
  title,
  description,
  image,
  icon,
  stats,
  features,
  gradientFrom,
  gradientTo,
  animation
}) => {
  const getAnimation = () => {
    switch (animation.type) {
      case 'rotate':
        return {
          animate: { rotate: 360 },
          transition: { duration: animation.duration || 20, repeat: Infinity, ease: "linear" }
        };
      case 'scale':
        return {
          animate: { scale: [1, 1.1, 1] },
          transition: { duration: animation.duration || 2, repeat: Infinity }
        };
      case 'float':
        return {
          animate: { y: [0, -8, 0] },
          transition: { duration: animation.duration || 2, repeat: Infinity }
        };
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group h-full"
    >
      <Card className="h-full overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardContent className="p-0">
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${gradientFrom} ${gradientTo} flex items-center justify-center`}>
              <motion.div {...getAnimation()} className="p-4 bg-white/10 rounded-full">
                {icon}
              </motion.div>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              {title}
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {stats}
              </Badge>
            </h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-500">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const WhyJoinSection: React.FC = () => {
  const cards: WhyJoinCardProps[] = [
    {
      title: "Connect & Network",
      description: "Build meaningful connections with peers who share your academic and professional interests",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
      icon: <Network className="h-12 w-12 text-white" />,
      stats: "5,000+ Active Members",
      features: [
        "Industry networking events",
        "Mentorship opportunities",
        "Alumni connections"
      ],
      gradientFrom: "from-blue-600/90",
      gradientTo: "to-blue-400/30",
      animation: { type: 'rotate', duration: 20 }
    },
    {
      title: "Learn & Grow",
      description: "Access exclusive resources and knowledge sharing opportunities to accelerate your growth",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
      icon: <BookOpen className="h-12 w-12 text-white" />,
      stats: "1000+ Learning Resources",
      features: [
        "Expert-led workshops",
        "Peer learning sessions",
        "Research collaborations"
      ],
      gradientFrom: "from-emerald-600/90",
      gradientTo: "to-emerald-400/30",
      animation: { type: 'scale', duration: 2 }
    },
    {
      title: "Innovate & Lead",
      description: "Launch projects, start ventures, and lead initiatives with like-minded innovators",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      icon: <Rocket className="h-12 w-12 text-white" />,
      stats: "200+ Success Stories",
      features: [
        "Innovation challenges",
        "Start-up support",
        "Leadership opportunities"
      ],
      gradientFrom: "from-purple-600/90",
      gradientTo: "to-purple-400/30",
      animation: { type: 'float', duration: 2 }
    }
  ];

  const testimonials = [
    {
      quote: "Joining this community transformed my academic journey. The connections I made led to amazing research opportunities.",
      author: "Sarah Chen",
      role: "PhD Candidate"
    },
    {
      quote: "The mentorship and networking opportunities helped me land my dream job at a leading tech company.",
      author: "James Wilson",
      role: "Software Engineer"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="px-4 py-12 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4 px-4 py-1">
          Join Our Thriving Community
        </Badge>
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
          Why Join Our Groups?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover a supportive community where you can learn, grow, and achieve your goals together
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {cards.map((card) => (
          <WhyJoinCard key={card.title} {...card} />
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-2">
            <Star className="h-4 w-4 mr-1" /> Member Stories
          </Badge>
          <h3 className="text-2xl font-semibold">What Our Members Say</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.2 }}
              className="relative"
            >
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="pt-8">
                  <MessageSquare className="absolute -top-4 -left-4 h-8 w-8 text-blue-500" />
                  <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-12"
      >
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg font-semibold transform hover:scale-105 transition-all duration-300"
          onClick={() => window.location.href = '/groups'}
        >
          Explore Groups
          <TrendingUp className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default WhyJoinSection;