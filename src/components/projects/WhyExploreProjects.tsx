import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Lightbulb,
  Network,
  Wrench,
  Heart,
  Users,
  Handshake,
  Rocket,
  GraduationCap,
  Globe,
  Target,
  Trophy,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";

const benefits = [
  {
    id: 1,
    title: "Build Strong Teams",
    description: "Form high-performing teams with diverse skills and expertise. Our intelligent matching system connects you with the right collaborators for your project goals.",
    icon: <Handshake className="h-8 w-8 text-indigo-500" />,
    category: "Collaboration",
    stats: "90% success rate in team formation",
    secondaryStats: "2000+ successful teams formed"
  },
  {
    id: 2,
    title: "Global Networking",
    description: "Connect with peers and professionals worldwide. Expand your network across industries and cultures while building lasting professional relationships.",
    icon: <Globe className="h-8 w-8 text-cyan-500" />,
    category: "Networking",
    stats: "500+ active collaborations",
    secondaryStats: "Users from 50+ countries"
  },
  {
    id: 3,
    title: "Drive Innovation",
    description: "Be part of cutting-edge projects that push boundaries. Work on emerging technologies and contribute to innovative solutions across various domains.",
    icon: <Lightbulb className="h-8 w-8 text-amber-500" />,
    category: "Innovation",
    stats: "200+ innovative projects",
    secondaryStats: "30+ patent applications"
  },
  {
    id: 4,
    title: "Career Growth",
    description: "Accelerate your professional development through hands-on experience. Gain valuable skills and certifications while working on real-world projects.",
    icon: <Rocket className="h-8 w-8 text-rose-500" />,
    category: "Professional Growth",
    stats: "1000+ career advancements",
    secondaryStats: "85% skill improvement rate"
  },
  {
    id: 5,
    title: "Skill Enhancement",
    description: "Master new technologies and methodologies through practical application. Access exclusive workshops, mentoring sessions, and learning resources.",
    icon: <GraduationCap className="h-8 w-8 text-emerald-500" />,
    category: "Learning",
    stats: "50+ skill workshops monthly",
    secondaryStats: "24/7 learning resources"
  },
  {
    id: 6,
    title: "Create Impact",
    description: "Work on projects that matter. Contribute to initiatives in healthcare, sustainability, education, and social impact while building your portfolio.",
    icon: <Target className="h-8 w-8 text-purple-500" />,
    category: "Social Impact",
    stats: "100+ impact projects",
    secondaryStats: "1M+ lives impacted"
  },
];

const WhyExploreProjects = () => {
  const router = useRouter();
  return (
    <ScrollArea className="h-full w-full">
      <section className="pt-4 pb-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <Badge variant="secondary" className="px-4 py-1 text-base">
              Why Choose Us?
            </Badge>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Unlock Your Potential
          </h2>
          
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Join our thriving community of innovators, creators, and change-makers. 
            Discover endless possibilities for growth, learning, and meaningful impact 
            through collaborative projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit) => (
            <Card 
              key={benefit.id} 
              className="group hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-background to-secondary/20"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="font-medium">
                    {benefit.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {benefit.stats}
                  </span>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {benefit.icon}
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold">
                      {benefit.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {benefit.secondaryStats}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">
                Ready to start your journey?
              </span>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Join thousands of professionals who are already creating, collaborating, 
              and achieving their goals through our platform.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full"
              onClick={() => router.push("/projects/explore")}
            >
              Start Exploring Projects
            </Button>
            {/* <Button size="lg" variant="outline" className="rounded-full">
              Learn More
            </Button> */}
          </div>
        </div>
      </section>
    </ScrollArea>
  );
};

export default WhyExploreProjects;