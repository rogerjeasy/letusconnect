"use client";

import CountUp from "react-countup";
import {
  FaUserTie,
  FaHandshake,
  FaBriefcase,
  FaUsers,
  FaProjectDiagram,
  FaComments,
  FaLaptop,
  FaRocket,
  FaStar,
  FaChartLine,
} from "react-icons/fa";

interface Stat {
  title: string;
  count: number;
  suffix?: string;
  icon: JSX.Element;
}

const stats: Stat[] = [
  { title: "Active Mentors", count: 500, suffix: "+", icon: <FaUserTie size={32} className="text-teal-500" /> },
  { title: "Successful Collaborations", count: 1000, suffix: "+", icon: <FaHandshake size={32} className="text-cyan-500" /> },
  { title: "Job Opportunities Shared", count: 200, suffix: "+", icon: <FaBriefcase size={32} className="text-blue-500" /> },
  { title: "Registered Users", count: 3000, suffix: "+", icon: <FaUsers size={32} className="text-purple-500" /> },
  { title: "Alumni Events Hosted", count: 150, suffix: "+", icon: <FaComments size={32} className="text-yellow-500" /> },
  { title: "Active Projects", count: 400, suffix: "+", icon: <FaProjectDiagram size={32} className="text-green-500" /> },
  { title: "Networking Connections", count: 800, suffix: "+", icon: <FaLaptop size={32} className="text-indigo-500" /> },
  { title: "Start-up Ideas Shared", count: 100, suffix: "+", icon: <FaRocket size={32} className="text-red-500" /> },
  { title: "Mentorship Satisfaction Rate", count: 90, suffix: "%", icon: <FaStar size={32} className="text-orange-500" /> },
  { title: "Expert Webinars Conducted", count: 50, suffix: "+", icon: <FaChartLine size={32} className="text-pink-500" /> },
];

export default function CommunityStats() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 leading-tight">
          Community Stats and Highlights
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {stat.icon}
              <h3 className="text-3xl font-bold my-4">
                <CountUp end={stat.count} duration={2} suffix={stat.suffix} />
              </h3>
              <p className="text-gray-600 text-lg">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}