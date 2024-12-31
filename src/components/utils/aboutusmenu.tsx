"use client"

import {
    // FaSearch,
    FaEnvelope,
    // FaBullseye,
    // FaSeedling,
    FaUserPlus,
    FaInfoCircle,
    FaBriefcase,
    FaHandshake,
    FaQuestionCircle,
    FaRocket,
  } from "react-icons/fa";

  interface AboutComponent {
    title: string;
    href: string;
    description: string;
    icon: JSX.Element;
  }
  
  export const aboutComponents: AboutComponent[] = [
    {
      title: "About Us",
      href: "/about-us",
      description: "Learn more about our mission, vision, and values.",
      icon: <FaInfoCircle className="text-teal-500" />,
    },
    {
      title: "Get Started",
      href: "/get-started",
      description: "Find out how to get started with our platform.",
      icon: <FaRocket className="text-blue-500" />,
    },
    {
      title: "Contact Us",
      href: "/contact-us",
      description: "Reach out to us with your questions or feedback.",
      icon: <FaEnvelope className="text-orange-500" />,
    },
    {
      title: "Our Team",
      href: "/our-team",
      description: "Meet the people behind our success.",
      icon: <FaUserPlus className="text-cyan-500" />,
    },
    {
      title: "Careers",
      href: "/careers",
      description: "Explore opportunities to join our team.",
      icon: <FaBriefcase className="text-green-500" />,
    },
    {
      title: "Partnership Opportunities",
      href: "/partnerships",
      description: "Learn how to partner with us for mutual success.",
      icon: <FaHandshake className="text-purple-500" />,
    },
    {
      title: "FAQs",
      href: "/faqs",
      description: "Find answers to common questions about our services.",
      icon: <FaQuestionCircle className="text-orange-500" />,
    },
  ];
  