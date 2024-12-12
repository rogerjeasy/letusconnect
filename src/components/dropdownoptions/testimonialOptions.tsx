"use client";

import {
  FaEye,
  FaPenFancy,
  FaStar,
  FaComments,
  FaHeart,
  FaQuestionCircle,
} from "react-icons/fa";

export const testimonialsOptions = {
  // Authenticated Users: Testimonials
  testimonials: [
    { label: "View Testimonials", icon: <FaEye className="text-blue-500" />, link: "/testimonials/view" },
    { label: "Submit a Testimonial", icon: <FaPenFancy className="text-green-500" />, link: "/testimonials/submit" },
    { label: "My Testimonials", icon: <FaComments className="text-purple-500" />, link: "/testimonials/my-testimonials" },
    { label: "Favorite Testimonials", icon: <FaHeart className="text-red-500" />, link: "/testimonials/favorites" },
    { label: "Top Rated Testimonials", icon: <FaStar className="text-yellow-500" />, link: "/testimonials/top-rated" },
  ],

  // Non-Authenticated Users: Testimonials
  testimonialsNonAuth: [
    { label: "Explore Testimonials", icon: <FaEye className="text-blue-500" />, link: "/testimonials/explore" },
    { label: "Why Testimonials Matter", icon: <FaStar className="text-yellow-500" />, link: "/testimonials/why-testimonials" },
    { label: "How Testimonials Work", icon: <FaComments className="text-purple-500" />, link: "/testimonials/how-it-works" },
    { label: "Benefits of Testimonials", icon: <FaHeart className="text-red-500" />, link: "/testimonials/benefits" },
    { label: "Testimonials FAQs", icon: <FaQuestionCircle className="text-orange-500" />, link: "/testimonials/faq" },
  ],
};