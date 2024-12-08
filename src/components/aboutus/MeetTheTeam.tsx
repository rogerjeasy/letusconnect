"use client";

import ImageZoom from "../forms/ImageZoom";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
      },
      {
        name: "Sophia Martinez",
        role: "Frontend Developer",
        bio: "Sophia focuses on creating intuitive and accessible user interfaces.",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        linkedin: "https://www.linkedin.com/in/sophiamartinez",
        email: "sophia.martinez@example.com",
      },
      {
        name: "James Brown",
        role: "DevOps Engineer",
        bio: "James ensures seamless deployments and system reliability.",
        image: "https://randomuser.me/api/portraits/men/53.jpg",
        linkedin: "https://www.linkedin.com/in/jamesbrown",
        email: "james.brown@example.com",
      },
      {
        name: "Olivia Davis",
        role: "Full Stack Developer",
        bio: "Olivia works across the stack to deliver end-to-end solutions.",
        image: "https://randomuser.me/api/portraits/women/56.jpg",
        linkedin: "https://www.linkedin.com/in/oliviadavis",
        email: "olivia.davis@example.com",
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
      },
      {
        name: "Emily Carter",
        role: "Graphic Designer",
        bio: "Emily designs visuals that captivate and communicate effectively.",
        image: "https://randomuser.me/api/portraits/women/45.jpg",
        linkedin: "https://www.linkedin.com/in/emilycarter",
        email: "emily.carter@example.com",
      },
      {
        name: "Liam Wilson",
        role: "Motion Designer",
        bio: "Liam creates animations that bring ideas to life.",
        image: "https://randomuser.me/api/portraits/men/41.jpg",
        linkedin: "https://www.linkedin.com/in/liamwilson",
        email: "liam.wilson@example.com",
      },
      {
        name: "Grace Moore",
        role: "Product Designer",
        bio: "Grace designs products that solve real user problems.",
        image: "https://randomuser.me/api/portraits/women/37.jpg",
        linkedin: "https://www.linkedin.com/in/gracemoore",
        email: "grace.moore@example.com",
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
      },
      {
        name: "Hannah White",
        role: "Customer Success Manager",
        bio: "Hannah ensures customers achieve their goals with our platform.",
        image: "https://randomuser.me/api/portraits/women/15.jpg",
        linkedin: "https://www.linkedin.com/in/hannahwhite",
        email: "hannah.white@example.com",
      },
      {
        name: "Ethan Scott",
        role: "Technical Support",
        bio: "Ethan solves technical issues with precision and care.",
        image: "https://randomuser.me/api/portraits/men/25.jpg",
        linkedin: "https://www.linkedin.com/in/ethanscott",
        email: "ethan.scott@example.com",
      },
      {
        name: "Natalie Brown",
        role: "Community Manager",
        bio: "Natalie fosters a positive and engaging community.",
        image: "https://randomuser.me/api/portraits/women/22.jpg",
        linkedin: "https://www.linkedin.com/in/nataliebrown",
        email: "natalie.brown@example.com",
      },
    ],
  },
];

export default function MeetTheTeam() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
          Meet the Team Behind the Platform
        </h2>

        {departments.map((department, deptIndex) => (
          <div key={deptIndex} className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-center text-teal-600">
              {department.name}
            </h3>

            {department.members.length === 1 ? (
              <div className="flex justify-center">
                {department.members.map((member, index) => (
                  <Card key={index} className="rounded-lg shadow-lg overflow-hidden w-80">
                    <CardHeader className="flex justify-center p-4">
                      <div className="w-32 h-32">
                        <ImageZoom src={member.image} alt={member.name} className="rounded-full w-full h-full object-cover" />
                      </div>
                    </CardHeader>
                    <CardBody className="p-6 text-center">
                      <h4 className="text-xl font-bold mb-2">{member.name}</h4>
                      <h5 className="text-lg text-gray-500 mb-4">{member.role}</h5>
                      <p className="text-gray-700 mb-6">{member.bio}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            ) : (
              <Swiper modules={[Navigation, Pagination]} spaceBetween={20} slidesPerView={3} navigation pagination={{ clickable: true }}>
                {department.members.map((member, index) => (
                  <SwiperSlide key={index}>
                    <Card className="rounded-lg shadow-lg overflow-hidden w-80">
                      <CardHeader className="flex justify-center p-4">
                        <div className="w-32 h-32">
                          <ImageZoom src={member.image} alt={member.name} className="rounded-full w-full h-full object-cover" />
                        </div>
                      </CardHeader>
                      <CardBody className="p-6 text-center">
                        <h4 className="text-xl font-bold mb-2">{member.name}</h4>
                        <h5 className="text-lg text-gray-500 mb-4">{member.role}</h5>
                        <p className="text-gray-700 mb-6">{member.bio}</p>
                      </CardBody>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}