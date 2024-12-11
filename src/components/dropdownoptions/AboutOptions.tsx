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
  } from "react-icons/fa";

export const aboutOptions = {
    // About Us
    aboutUs: [
    { label: "About Us", icon: <FaInfoCircle className="text-teal-500" />, link: "/about-us" },
    { label: "Contact Us", icon: <FaEnvelope className="text-orange-500" />, link: "/contact-us" },
    { label: "Our Team", icon: <FaUserPlus className="text-cyan-500" />, link: "/our-team" },
    { label: "Careers", icon: <FaBriefcase className="text-green-500" />, link: "/careers" },
    { label: "Partnership Opportunities", icon: <FaHandshake className="text-purple-500" />, link: "/partnerships" },
    { label: "FAQs", icon: <FaQuestionCircle className="text-orange-500" />, link: "/faqs" },
    ],
};