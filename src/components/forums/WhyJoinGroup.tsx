"use client";

import { motion } from 'framer-motion';
import { 
    Search, 
    BookOpen, 
    Rocket, 
    Network, 
    Code,
    Briefcase,
    GraduationCap,
    Users,
    Beaker,
    Filter,
    X,
    Globe,
    BookMarked,
    Lightbulb
  } from 'lucide-react';


interface WhyJoinCardProps {
    title: string;
    description: string;
    image: string;
    icon: React.ReactNode;
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
        default:
          return {};
      }
    };
  
    return (
      <div className="group">
        <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-xl">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${gradientFrom} ${gradientTo} flex items-center justify-center`}>
            <motion.div {...getAnimation()}>
              {icon}
            </motion.div>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  };
  
  const WhyJoinSection: React.FC = () => {
    const cards: WhyJoinCardProps[] = [
      {
        title: "Connect",
        description: "Network with peers who share your interests and goals",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
        icon: <Network className="h-12 w-12 text-white/90" />,
        gradientFrom: "from-blue-600/90",
        gradientTo: "to-blue-400/30",
        animation: { type: 'rotate', duration: 20 }
      },
      {
        title: "Learn",
        description: "Share knowledge and learn from others' experiences",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
        icon: <BookOpen className="h-12 w-12 text-white/90" />,
        gradientFrom: "from-emerald-600/90",
        gradientTo: "to-emerald-400/30",
        animation: { type: 'scale', duration: 2 }
      },
      {
        title: "Grow",
        description: "Develop your skills and advance your career",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
        icon: <Rocket className="h-12 w-12 text-white/90" />,
        gradientFrom: "from-purple-600/90",
        gradientTo: "to-purple-400/30",
        animation: { type: 'float', duration: 2 }
      }
    ];
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-semibold mb-6">Why Join Our Groups?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <WhyJoinCard key={card.title} {...card} />
          ))}
        </div>
      </motion.div>
    );
  };
  
  export default WhyJoinSection;