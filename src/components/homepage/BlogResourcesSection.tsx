"use client";

import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import Link from "next/link";
import { FaBookOpen, FaLightbulb, FaUserFriends } from "react-icons/fa";

interface BlogPost {
  title: string;
  excerpt: string;
  link: string;
  icon: JSX.Element;
}

const blogPosts: BlogPost[] = [
  {
    title: "5 Tips for Networking at Virtual Events",
    excerpt: "Discover key strategies to effectively network and make lasting connections during virtual events.",
    link: "/resources/5-tips-networking-virtual-events",
    icon: <FaBookOpen size={32} className="text-teal-500" />,
  },
  {
    title: "How to Find the Perfect Mentor",
    excerpt: "Learn how to identify and connect with mentors who align with your career goals.",
    link: "/resources/how-to-find-perfect-mentor",
    icon: <FaUserFriends size={32} className="text-blue-500" />,
  },
  {
    title: "Top Career Development Resources",
    excerpt: "Explore a curated list of resources to advance your career and enhance your skills.",
    link: "/resources/top-career-development-resources",
    icon: <FaLightbulb size={32} className="text-purple-500" />,
  },
];

export default function BlogResourcesSection() {
  return (
    <section
      className="py-12 relative text-white"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1593642634443-44adaa06623a?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay for Readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 leading-tight">
          Blog and Career Resources
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className="p-6 rounded-lg shadow-lg bg-white text-gray-800 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <CardHeader className="flex items-center gap-4 mb-4">
                {post.icon}
                <h3 className="text-xl font-bold">{post.title}</h3>
              </CardHeader>
              <CardBody className="flex flex-col items-center">
                <p className="text-gray-700 mb-6 text-center">{post.excerpt}</p>
                <Link href={post.link}>
                  <Button
                    color="primary"
                    size="md"
                    radius="lg"
                    className="font-bold transition-transform duration-300 hover:scale-105"
                  >
                    Read More
                  </Button>
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12">
          <Link href="/resources">
            <Button
              color="success"
              size="lg"
              radius="lg"
              className="font-bold px-8 py-3 transition-transform duration-300 hover:scale-105"
            >
              Explore Resources
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}