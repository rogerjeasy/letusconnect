"use client";

import {
  FaEye,
  FaPenFancy,
  FaStar,
  FaComments,
  FaHeart,
  FaQuestionCircle,
  FaThumbsUp,
  FaShareAlt,
  FaLightbulb,
  FaGlobe,
} from "react-icons/fa";

interface TestimonialsOption {
  title: string;
  href: string;
  description: string;
  icon: JSX.Element;
}

// Authenticated Users: Testimonials
export const testimonialsAuthComponents: TestimonialsOption[] = [
  {
    title: "View Testimonials",
    href: "/testimonials/view",
    description: "Explore testimonials shared by others in the community.",
    icon: <FaEye className="text-blue-500" />,
  },
  {
    title: "Submit a Testimonial",
    href: "/testimonials/submit",
    description: "Share your experiences and stories with the community.",
    icon: <FaPenFancy className="text-green-500" />,
  },
  {
    title: "My Testimonials",
    href: "/testimonials/my-testimonials",
    description: "Manage and review the testimonials you’ve submitted.",
    icon: <FaComments className="text-purple-500" />,
  },
  {
    title: "Favorite Testimonials",
    href: "/testimonials/favorites",
    description: "Save and revisit your favorite testimonials.",
    icon: <FaHeart className="text-red-500" />,
  },
  {
    title: "Top Rated Testimonials",
    href: "/testimonials/top-rated",
    description: "Browse the most liked and appreciated testimonials.",
    icon: <FaStar className="text-yellow-500" />,
  },
  {
    title: "Give Kudos",
    href: "/testimonials/kudos",
    description: "Show your appreciation by giving kudos to testimonials.",
    icon: <FaThumbsUp className="text-teal-500" />,
  },
  {
    title: "Share Testimonials",
    href: "/testimonials/share",
    description: "Spread inspiring stories by sharing testimonials.",
    icon: <FaShareAlt className="text-orange-500" />,
  },
  {
    title: "Global Testimonials",
    href: "/testimonials/global",
    description: "Discover testimonials from around the world.",
    icon: <FaGlobe className="text-indigo-500" />,
  },
];

// Non-Authenticated Users: Testimonials
export const testimonialsNonAuthComponents: TestimonialsOption[] = [
  {
    title: "Explore Testimonials",
    href: "/testimonials/explore",
    description: "Read testimonials and learn about community experiences.",
    icon: <FaEye className="text-blue-500" />,
  },
  {
    title: "Why Testimonials Matter",
    href: "/testimonials/why-testimonials",
    description: "Understand the importance of testimonials in our community.",
    icon: <FaStar className="text-yellow-500" />,
  },
  {
    title: "How Testimonials Work",
    href: "/testimonials/how-it-works",
    description: "Learn how testimonials are shared and managed on the platform.",
    icon: <FaComments className="text-purple-500" />,
  },
  {
    title: "Benefits of Testimonials",
    href: "/testimonials/benefits",
    description: "Discover how testimonials can enhance your experience.",
    icon: <FaHeart className="text-red-500" />,
  },
  {
    title: "Global Testimonials",
    href: "/testimonials/global",
    description: "Explore inspiring stories from people worldwide.",
    icon: <FaGlobe className="text-indigo-500" />,
  },
  {
    title: "Testimonials FAQs",
    href: "/testimonials/faq",
    description: "Find answers to common questions about testimonials.",
    icon: <FaQuestionCircle className="text-orange-500" />,
  },
  {
    title: "Get Inspired",
    href: "/testimonials/inspiration",
    description: "Read testimonials that inspire and motivate.",
    icon: <FaLightbulb className="text-cyan-500" />,
  },
];
