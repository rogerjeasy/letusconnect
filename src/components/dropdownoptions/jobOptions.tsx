"use client";

import {
  FaBriefcase,
  FaPlusCircle,
  FaSearch,
  FaFire,
  FaBuilding,
  FaGraduationCap,
  FaQuestionCircle,
} from "react-icons/fa";

export const jobsOptions = {
  // Authenticated Users: Jobs
  jobs: [
    { label: "Job Board", icon: <FaBriefcase className="text-blue-500" />, link: "/jobs/board" },
    { label: "Post a Job", icon: <FaPlusCircle className="text-green-500" />, link: "/jobs/post" },
  ],

  // Non-Authenticated Users: Jobs
  jobsNonAuth: [
    { label: "Explore Jobs", icon: <FaSearch className="text-blue-500" />, link: "/jobs/explore" },
    { label: "Trending Jobs", icon: <FaFire className="text-red-500" />, link: "/jobs/trending-jobs" },
    { label: "Top Companies Hiring", icon: <FaBuilding className="text-teal-500" />, link: "/jobs/top-companies" },
    { label: "Internship Opportunities", icon: <FaGraduationCap className="text-purple-500" />, link: "/jobs/internships" },
    { label: "Jobs FAQs", icon: <FaQuestionCircle className="text-orange-500" />, link: "/jobs/faq" },
  ],
};
