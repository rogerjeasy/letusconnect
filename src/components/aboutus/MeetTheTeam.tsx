"use client";

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Mail, Linkedin, Twitter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

interface Department {
  name: string;
  members: TeamMember[];
}

interface TeamMemberCardProps {
  member: TeamMember;
}

const departments: Department[] = [
  {
    name: "Leadership",
    members: [
      {
        name: "Emily Johnson",
        role: "Project Lead",
        bio: "Emily is a visionary leader with 10 years of experience managing tech projects and fostering collaboration.",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        linkedin: "https://www.linkedin.com/in/emilyjohnson",
        email: "emily.johnson@example.com",
        twitter: "https://twitter.com/emilyjohnson",
      },
    ],
  },
  {
    name: "Development",
    members: [
      {
        name: "Michael Smith",
        role: "Backend Developer",
        bio: "Michael specializes in scalable backend systems and efficient APIs.",
        image: "https://randomuser.me/api/portraits/men/34.jpg",
        linkedin: "https://www.linkedin.com/in/michaelsmith",
        email: "michael.smith@example.com",
        twitter: "https://twitter.com/michaelsmith",
      },
      {
        name: "Sophia Martinez",
        role: "Frontend Developer",
        bio: "Sophia focuses on creating intuitive and accessible user interfaces.",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        linkedin: "https://www.linkedin.com/in/sophiamartinez",
        email: "sophia.martinez@example.com",
        twitter: "https://twitter.com/sophiamartinez",
      },
      {
        name: "James Brown",
        role: "DevOps Engineer",
        bio: "James ensures seamless deployments and system reliability.",
        image: "https://randomuser.me/api/portraits/men/53.jpg",
        linkedin: "https://www.linkedin.com/in/jamesbrown",
        email: "james.brown@example.com",
        twitter: "https://twitter.com/jamesbrown",
      },
      {
        name: "Olivia Davis",
        role: "Full Stack Developer",
        bio: "Olivia works across the stack to deliver end-to-end solutions.",
        image: "https://randomuser.me/api/portraits/women/56.jpg",
        linkedin: "https://www.linkedin.com/in/oliviadavis",
        email: "olivia.davis@example.com",
        twitter: "https://twitter.com/oliviadavis",
      },
    ],
  },
  {
    name: "Design",
    members: [
      {
        name: "David Lee",
        role: "UI/UX Designer",
        bio: "David crafts user experiences that are both beautiful and functional.",
        image: "https://randomuser.me/api/portraits/men/28.jpg",
        linkedin: "https://www.linkedin.com/in/davidlee",
        email: "david.lee@example.com",
        twitter: "https://twitter.com/davidlee",
      },
      {
        name: "Emily Carter",
        role: "Graphic Designer",
        bio: "Emily designs visuals that captivate and communicate effectively.",
        image: "https://randomuser.me/api/portraits/women/45.jpg",
        linkedin: "https://www.linkedin.com/in/emilycarter",
        email: "emily.carter@example.com",
        twitter: "https://twitter.com/emilycarter",
      },
      {
        name: "Liam Wilson",
        role: "Motion Designer",
        bio: "Liam creates animations that bring ideas to life.",
        image: "https://randomuser.me/api/portraits/men/41.jpg",
        linkedin: "https://www.linkedin.com/in/liamwilson",
        email: "liam.wilson@example.com",
        twitter: "https://twitter.com/liamwilson",
      },
      {
        name: "Grace Moore",
        role: "Product Designer",
        bio: "Grace designs products that solve real user problems.",
        image: "https://randomuser.me/api/portraits/women/37.jpg",
        linkedin: "https://www.linkedin.com/in/gracemoore",
        email: "grace.moore@example.com",
        twitter: "https://twitter.com/gracemoore",
      },
    ],
  },
  {
    name: "Support",
    members: [
      {
        name: "Daniel Thompson",
        role: "Support Specialist",
        bio: "Daniel provides top-notch support to ensure user satisfaction.",
        image: "https://randomuser.me/api/portraits/men/12.jpg",
        linkedin: "https://www.linkedin.com/in/danielthompson",
        email: "daniel.thompson@example.com",
        twitter: "https://twitter.com/danielthompson",
      },
      {
        name: "Hannah White",
        role: "Customer Success Manager",
        bio: "Hannah ensures customers achieve their goals with our platform.",
        image: "https://randomuser.me/api/portraits/women/15.jpg",
        linkedin: "https://www.linkedin.com/in/hannahwhite",
        email: "hannah.white@example.com",
        twitter: "https://twitter.com/hannahwhite",
      },
      {
        name: "Ethan Scott",
        role: "Technical Support",
        bio: "Ethan solves technical issues with precision and care.",
        image: "https://randomuser.me/api/portraits/men/25.jpg",
        linkedin: "https://www.linkedin.com/in/ethanscott",
        email: "ethan.scott@example.com",
        twitter: "https://twitter.com/ethanscott",
      },
      {
        name: "Natalie Brown",
        role: "Community Manager",
        bio: "Natalie fosters a positive and engaging community.",
        image: "https://randomuser.me/api/portraits/women/22.jpg",
        linkedin: "https://www.linkedin.com/in/nataliebrown",
        email: "natalie.brown@example.com",
        twitter: "https://twitter.com/nataliebrown",
      },
    ],
  },
];

function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src={member.image} alt={member.name} />
          <AvatarFallback>{member.name[0]}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h4 className="text-xl font-semibold">{member.name}</h4>
          <p className="text-sm text-muted-foreground">{member.role}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-center text-muted-foreground">{member.bio}</p>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        {member.linkedin && (
          <Button variant="ghost" size="icon" asChild>
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-5 w-5" />
            </a>
          </Button>
        )}
        {member.twitter && (
          <Button variant="ghost" size="icon" asChild>
            <a href={member.twitter} target="_blank" rel="noopener noreferrer">
              <Twitter className="h-5 w-5" />
            </a>
          </Button>
        )}
        {member.email && (
          <Button variant="ghost" size="icon" asChild>
            <a href={`mailto:${member.email}`}>
              <Mail className="h-5 w-5" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function MeetTheTeam() {
  return (
    <section className="py-8 md:py-12 w-full bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 text-center">
          Meet the Team Behind the Platform
        </h2>

        {departments.map((department, deptIndex) => (
          <div key={deptIndex} className="mb-12 md:mb-16">
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-center text-primary">
              {department.name}
            </h3>

            {department.members.length === 1 ? (
              <div className="flex justify-center">
                <TeamMemberCard member={department.members[0]} />
              </div>
            ) : (
              <Carousel
                opts={{
                  align: "start",
                  loop: true
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {department.members.map((member, index) => (
                    <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <TeamMemberCard member={member} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
