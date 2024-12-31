"use client";

import {
  FaEye,
  FaPlusCircle,
  FaUsers,
  FaTasks,
  FaSearch,
  FaLightbulb,
  FaInfoCircle,
  FaQuestionCircle,
  FaStar,
  FaBell,
} from "react-icons/fa";

interface ProjectComponent {
  title: string;
  href: string;
  description: string;
  icon: JSX.Element;
}

// Authenticated Users: Projects
export const projectsAuthComponents: ProjectComponent[] = [
  {
    title: "Explore Projects",
    href: "/projects/explore",
    description: "Discover a wide range of projects to participate in.",
    icon: <FaSearch className="text-blue-500" />,
  },
  {
    title: "View My Projects",
    href: "/projects/view",
    description: "See the projects you are currently involved in.",
    icon: <FaEye className="text-blue-500" />,
  },
  {
    title: "Create a New Project",
    href: "/projects/create",
    description: "Start a new project and invite others to join.",
    icon: <FaPlusCircle className="text-green-500" />,
  },
  {
    title: "Join a Project",
    href: "/projects/join",
    description: "Find and join projects that align with your interests.",
    icon: <FaUsers className="text-teal-500" />,
  },
  {
    title: "Manage My Projects",
    href: "/projects/manage",
    description: "Organize and oversee your active projects.",
    icon: <FaTasks className="text-purple-500" />,
  },
  {
    title: "Notifications",
    href: "/projects/notifications",
    description: "Stay informed about updates and notifications for your projects.",
    icon: <FaBell className="text-red-500" />,
  },
  {
    title: "Help & Documentation",
    href: "/projects/help",
    description: "Access resources and guides for project management.",
    icon: <FaQuestionCircle className="text-yellow-500" />,
  },
  {
    title: "Project Insights",
    href: "/projects/insights",
    description: "Get analytics and insights for your projects.",
    icon: <FaStar className="text-orange-500" />,
  },
];

// Non-Authenticated Users: Projects
export const projectsNonAuthComponents: ProjectComponent[] = [
  {
    title: "Explore Projects",
    href: "/projects/explore",
    description: "Browse through a variety of projects and ideas.",
    icon: <FaSearch className="text-blue-500" />,
  },
  {
    title: "Why Projects Matter",
    href: "/projects/why-projects",
    description: "Learn why participating in projects can be impactful.",
    icon: <FaLightbulb className="text-yellow-500" />,
  },
  {
    title: "How Projects Work",
    href: "/projects/how-it-works",
    description: "Understand the processes and expectations of projects.",
    icon: <FaInfoCircle className="text-teal-500" />,
  },
  {
    title: "Benefits of Projects",
    href: "/projects/benefits",
    description: "Explore the advantages of contributing to projects.",
    icon: <FaStar className="text-orange-500" />,
  },
  {
    title: "Projects FAQs",
    href: "/projects/faq",
    description: "Find answers to frequently asked questions about projects.",
    icon: <FaQuestionCircle className="text-red-500" />,
  },
];
