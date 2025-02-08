"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/userStore";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  UserCircle2,
  Rocket,
  Users,
  Briefcase,
  MessagesSquare,
  Calendar,
  HandshakeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { LoginDialog } from "../utils/shadcn-dialogs";

interface AnimationProps {
  initial: { opacity: number; y: number };
  animate: { opacity: number; y: number };
  transition: { duration: number; delay?: number };
}

const fadeIn: AnimationProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

interface StepCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionButton?: ReactNode;
  color?: string;
}

const StepCard: React.FC<StepCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  actionButton, 
  color = "blue" 
}) => (
  <Card className="transition-all duration-300 hover:shadow-lg">
    <CardHeader>
      <div className={cn(
        "w-16 h-16 rounded-full mx-auto flex items-center justify-center",
        `bg-${color}-100 text-${color}-600`
      )}>
        <Icon className="w-8 h-8" />
      </div>
      <CardTitle className="text-xl text-center mt-4">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-center">{description}</p>
    </CardContent>
    {actionButton && (
      <CardFooter className="flex justify-center pb-6">
        {actionButton}
      </CardFooter>
    )}
  </Card>
);

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  color = "blue" 
}) => (
  <Card className="transition-all duration-300 hover:shadow-md">
    <CardHeader>
      <div className={cn(
        "w-12 h-12 rounded-full mx-auto flex items-center justify-center",
        `bg-${color}-100 text-${color}-600`
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <CardTitle className="text-lg text-center mt-2">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground text-center">{description}</p>
    </CardContent>
  </Card>
);


const GetStartedPage: React.FC = () => {
  const { user, isAuthenticated } = useUserStore();
  const router = useRouter();
  const [showAuthDialog, setShowAuthDialog] = useState<boolean>(false);

  const handleCompleteProfile = (): void => {
    if (isAuthenticated && user) {
      router.push("/settings");
    } else {
      setShowAuthDialog(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              {...fadeIn}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Welcome to <span className="text-blue-600">Let Us Connect</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                Empowering students, alumni, and professionals to build meaningful 
                connections, advance careers, and foster collaboration. Join the 
                community that helps you thrive and achieve your goals.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link href="/register">
                  <Button size="lg" className="font-semibold">
                    Register Now
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="font-semibold">
                    Login
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              {...fadeIn}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-blue-200 rounded-full opacity-20 blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="Collaboration"
                className="relative rounded-lg shadow-2xl w-full max-w-2xl mx-auto"
              />
            </motion.div>
          </div>
          <motion.div 
            {...fadeIn} 
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <Card className="border-2">
              {/* Additional Context Section */}
              <div className="mt-10 text-center px-2 lg:px-14">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                  What Makes Let Us Connect Unique?
                </h2>
                <div>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                    Our platform bridges the gap between students, alumni, and industry experts by 
                    fostering mentorship, collaboration, and career growth opportunities. Whether 
                    you&rsquo;re looking to find a mentor, collaborate on projects, or expand your 
                    professional network, Let Us Connect is here to make it happen.
                </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Getting Started Steps */}
        <div className="container mx-auto max-w-7xl">
          <motion.h2 
            {...fadeIn}
            className="text-3xl font-bold text-center mb-12"
          >
            Getting Started is Easy
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <StepCard
                icon={UserPlus}
                title="Step 1: Register"
                description="Sign up with your details to gain access to personalized features and explore the community."
                actionButton={
                  <Link href="/register">
                    <Button>Register Now</Button>
                  </Link>
                }
              />
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
              <StepCard
                icon={UserCircle2}
                title="Step 2: Complete Profile"
                description="Add a profile picture, your skills, and interests to help others connect with you easily."
                actionButton={
                  <Button onClick={handleCompleteProfile}>
                    Complete Profile
                  </Button>
                }
                color="green"
              />
            </motion.div>
          </div>

          {/* Explore Features */}
          <motion.div 
            {...fadeIn} 
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <Rocket className="w-12 h-12 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-center">
                  Step 3: Start Exploring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FeatureCard
                    icon={Users}
                    title="Connect"
                    description="Find peers, alumni, and mentors filtered by skills and interests."
                    color="blue"
                  />
                  <FeatureCard
                    icon={Briefcase}
                    title="Job Tracker"
                    description="Track your job applications and manage your career journey."
                    color="purple"
                  />
                  <FeatureCard
                    icon={HandshakeIcon}
                    title="Collaborate"
                    description="Join projects and find like-minded individuals to work with."
                    color="green"
                  />
                  <FeatureCard
                    icon={MessagesSquare}
                    title="Mentorship"
                    description="Find or become a mentor, fostering meaningful guidance."
                    color="yellow"
                  />
                  
                  <FeatureCard
                    icon={Calendar}
                    title="Events"
                    description="Join webinars, networking sessions, and skill-building workshops."
                    color="pink"
                  />
                  <FeatureCard
                    icon={Users}
                    title="Groups"
                    description="Join interest-based groups for discussions and networking."
                    color="teal"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <Button size="lg" className="font-semibold">
                  Start Exploring
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

      {/* Testimonial Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-3xl font-bold mb-8">
              Hear from Our Community
            </h2>
            <Card className="bg-white/50 backdrop-blur">
              <CardContent className="pt-6">
                <p className="text-lg text-muted-foreground italic">
                &quot;Let Us Connect has been instrumental in helping me find the right
                  mentors and collaborate on exciting projects.&ldquo;
                </p>
                <p className="text-sm font-semibold mt-4">— Jane Doe</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <LoginDialog
        title="Complete Step 1 First to Complete Your Profile" 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)} 
      />
    </div>
  );
};

export default GetStartedPage;