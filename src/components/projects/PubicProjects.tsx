"use client";

import React, { useEffect, useState } from "react";
import ProjectListingsObject from "@/components/projects/ListProjectObject";
import { api, handleError } from "@/helpers/api";
import { Project } from "@/store/project";
import ProjectCardWhileLoading from "@/components/projects/ProjectCardWhileLoading";

const PublicProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicProjects = async () => {
      try {
        const response = await api.get("/api/projects/public");
        setProjects(response.data.data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProjects();
  }, []);

  return loading ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10">
      {/* Display placeholder cards while loading */}
      {Array.from({ length: 4 }).map((_, index) => (
        <ProjectCardWhileLoading key={index} />
      ))}
    </div>
  ) : (
    <ProjectListingsObject projects={projects} title="🎯 Public Project Listings" />
  );
};

export default PublicProjectsPage;