"use client";

import {
  FaBriefcase,
  FaPlusCircle,
  FaSearch,
  FaFire,
  FaBuilding,
  FaGraduationCap,
  FaQuestionCircle,
  FaLightbulb,
  FaHandshake,
  FaChartLine,
  FaUsers,
} from "react-icons/fa";

interface JobsOption {
  title: string;
  href: string;
  description: string;
  icon: JSX.Element;
}

// Authenticated Users: Jobs
export const jobsAuthComponents: JobsOption[] = [
  {
    title: "Job Board",
    href: "/jobs/board",
    description: "Access a curated list of job opportunities tailored to your field.",
    icon: <FaBriefcase className="text-blue-500" />,
  },
  {
    title: "Post a Job",
    href: "/jobs/post",
    description: "Looking to hire? Post your job openings and find the perfect candidate.",
    icon: <FaPlusCircle className="text-green-500" />,
  },
  {
    title: "Manage My Job Posts",
    href: "/jobs/manage",
    description: "View, edit, and manage the jobs you've posted on the platform.",
    icon: <FaChartLine className="text-teal-500" />,
  },
  {
    title: "Applications Received",
    href: "/jobs/applications",
    description: "Track and manage applications for the jobs you've posted.",
    icon: <FaUsers className="text-orange-500" />,
  },
  {
    title: "Career Growth Insights",
    href: "/jobs/career-insights",
    description: "Explore resources and tips to advance your career journey.",
    icon: <FaLightbulb className="text-yellow-500" />,
  },
  {
    title: "Network with Employers",
    href: "/jobs/network",
    description: "Engage with hiring managers and professionals through networking events.",
    icon: <FaHandshake className="text-purple-500" />,
  },
];

// Non-Authenticated Users: Jobs
export const jobsNonAuthComponents: JobsOption[] = [
  {
    title: "Explore Jobs",
    href: "/jobs/explore",
    description: "Discover a wide range of job opportunities across various industries.",
    icon: <FaSearch className="text-blue-500" />,
  },
  {
    title: "Trending Jobs",
    href: "/jobs/trending-jobs",
    description: "Check out the hottest job openings currently trending on the platform.",
    icon: <FaFire className="text-red-500" />,
  },
  {
    title: "Top Companies Hiring",
    href: "/jobs/top-companies",
    description: "Explore companies with active job openings and start your application.",
    icon: <FaBuilding className="text-teal-500" />,
  },
  {
    title: "Internship Opportunities",
    href: "/jobs/internships",
    description: "Find internships to kickstart your career and gain valuable experience.",
    icon: <FaGraduationCap className="text-purple-500" />,
  },
  {
    title: "Why Join the Workforce?",
    href: "/jobs/why-join",
    description: "Learn about the benefits of joining the workforce and how to get started.",
    icon: <FaLightbulb className="text-yellow-500" />,
  },
  {
    title: "Jobs FAQs",
    href: "/jobs/faq",
    description: "Find answers to frequently asked questions about finding jobs.",
    icon: <FaQuestionCircle className="text-orange-500" />,
  },
];
