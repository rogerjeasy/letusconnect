"use client";

import React, { useEffect, useState } from "react";
import ProjectListingsObject from "@/components/projects/ListProjectObject";
import { api, handleError } from "@/helpers/api";
import { Project } from "@/store/project";
import ProjectCardWhileLoading from "@/components/projects/ProjectCardWhileLoading";
import { API_CONFIG } from "@/config/api.config";
import { Card } from "@/components/ui/card";
import { Rocket, Search } from "lucide-react";

const PublicProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicProjects = async () => {
      try {
        const response = await api.get(API_CONFIG.ENDPOINTS.PROJECTS.PUBLIC);
        setProjects(response.data.data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
        <Card className="max-w-6xl mx-auto p-8 shadow-lg bg-white/80 backdrop-blur-sm">
          {/* Enhanced Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4">
              <Rocket className="w-8 h-8 text-blue-500 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              🎯 Public Project Listings
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discovering amazing projects... Please wait while we fetch the latest opportunities.
            </p>
          </div>

          {/* Search Bar Placeholder */}
          <div className="max-w-2xl mx-auto mb-10 relative opacity-70">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Loading Grid with Enhanced Animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="transform transition-all duration-300 hover:scale-105"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: "fadeIn 0.5s ease-in-out forwards",
                }}
              >
                <ProjectCardWhileLoading />
              </div>
            ))}
          </div>

          {/* Loading Indicators */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></div>
          </div>
        </Card>

        {/* Add custom animation keyframes */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  return <ProjectListingsObject projects={projects} title="🎯 Public Project Listings" />;
};

export default PublicProjectsPage;