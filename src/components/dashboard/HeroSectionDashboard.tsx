"use client";

import { Button } from "@nextui-org/react";
import { FaUserFriends, FaProjectDiagram, FaBriefcase } from "react-icons/fa";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HeroSectionDashboard() {
  const { user, isAuthenticated, loading, checkSession } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      checkSession();
    }
  }, [checkSession, isAuthenticated]);

  const userName = user?.username || "User";
  const stats = {
    newConnections: 10,
    upcomingEvents: 5,
  };

   // While loading, show a loading state
   if (loading) {
    return (
      <section className="bg-gradient-to-r from-blue-50 via-white to-blue-50 py-16">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-blue-50 via-white to-blue-50 py-16">
      <div className="container mx-auto px-6 lg:px-20 text-center md:text-left">
        {/* Welcome Message */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Text Content */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
              Welcome back, <span className="text-blue-600">{userName}</span>! 👋
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Ready to connect, collaborate, and grow?
            </p>
            <div className="text-gray-600">
              <p>
                <span className="font-semibold text-blue-600">{stats.newConnections}</span> new
                connections available
              </p>
              <p>
                <span className="font-semibold text-blue-600">{stats.upcomingEvents}</span> upcoming
                events
              </p>
            </div>
            {/* CTA Buttons */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 font-bold"
                size="lg"
                onClick={() => router.push("/users-directory")}
              >
                <FaUserFriends className="mr-2" /> Find Connections
              </Button>
              <Button
                className="bg-green-600 text-white hover:bg-green-700 font-bold"
                size="lg"
                onClick={() => router.push("/projects/explore")}
              >
                <FaProjectDiagram className="mr-2" /> Explore Projects
              </Button>
              <Button
                className="bg-teal-600 text-white hover:bg-teal-700 font-bold"
                size="lg"
                onClick={() => router.push("/jobs")}
              >
                <FaBriefcase className="mr-2" /> Browse Jobs
              </Button>
            </div>
          </div>

          {/* Visual Content */}
          <div className="md:w-1/2 flex justify-center relative">
            <div className="absolute inset-0 bg-blue-100 w-[20rem] h-[20rem] rounded-full opacity-50 -z-10 blur-lg animate-pulse"></div>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              alt="Dashboard Illustration"
              className="rounded-xl shadow-lg w-[80%] h-auto object-cover md:w-[24rem]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
