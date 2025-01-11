import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@nextui-org/react";
import { Badge } from "@/components/ui/badge";
import { 
  LightbulbIcon, 
  Network, 
  Wrench, 
  Heart,
  Users,
  Handshake
} from "lucide-react";
import { useRouter } from "next/navigation";

const benefits = [
  {
    id: 1,
    title: "Build Strong Teams",
    description: "Form teams with like-minded individuals to achieve project goals effectively.",
    icon: <Handshake className="h-8 w-8" />,
    category: "Collaboration",
    stats: "90% success rate in team formation",
    iconColor: "text-indigo-600",
    badgeColor: "bg-indigo-100 text-indigo-700"
  },
  {
    id: 2,
    title: "Collaborate with Peers",
    description: "Work together with fellow students to create amazing projects and learn from each other.",
    icon: <Users className="h-8 w-8" />,
    category: "Networking",
    stats: "500+ active collaborations",
    iconColor: "text-emerald-600",
    badgeColor: "bg-emerald-100 text-emerald-700"
  },
  {
    id: 3,
    title: "Discover Innovative Ideas",
    description: "Learn about cutting-edge projects in various industries.",
    icon: <LightbulbIcon className="h-8 w-8" />,
    category: "Innovation",
    stats: "200+ innovative projects",
    iconColor: "text-amber-600",
    badgeColor: "bg-amber-100 text-amber-700"
  },
  {
    id: 4,
    title: "Network with Professionals",
    description: "Collaborate and connect with project owners, students, and alumni.",
    icon: <Network className="h-8 w-8" />,
    category: "Professional Growth",
    stats: "1000+ professional connections",
    iconColor: "text-blue-600",
    badgeColor: "bg-blue-100 text-blue-700"
  },
  {
    id: 5,
    title: "Enhance Your Skills",
    description: "Participate in real-world projects to sharpen your skills.",
    icon: <Wrench className="h-8 w-8" />,
    category: "Skill Development",
    stats: "50+ skill workshops",
    iconColor: "text-purple-600",
    badgeColor: "bg-purple-100 text-purple-700"
  },
  {
    id: 6,
    title: "Contribute to Meaningful Work",
    description: "Join projects that make a real impact in fields like healthcare, education, and technology.",
    icon: <Heart className="h-8 w-8" />,
    category: "Impact",
    stats: "100+ impact projects",
    iconColor: "text-rose-600",
    badgeColor: "bg-rose-100 text-rose-700"
  },
];

const WhyExploreProjects = () => {
  const router = useRouter();
  
  return (
    <section className="pt-0"> 
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8"> 
          <Badge variant="outline" className="mb-2"> 
            Why Choose Us?
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-2"> 
            Discover the Benefits
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our vibrant community of innovators, creators, and problem-solvers to unlock endless possibilities for growth and collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"> 
          {benefits.map((benefit) => (
            <Card key={benefit.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className={`text-xs font-medium ${benefit.badgeColor}`}>
                    {benefit.category}
                  </Badge>
                  <span className="text-sm text-gray-500">{benefit.stats}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-white/50 ${benefit.iconColor}`}>
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pb-8">
          <Button 
            size="lg"
            color="success"
            onClick={() => router.push("/projects/explore")}
          >
            Start Exploring Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WhyExploreProjects;