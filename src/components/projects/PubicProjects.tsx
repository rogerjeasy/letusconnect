import React, { useEffect, useState } from "react";
import ProjectListingsObject from "@/components/projects/ListProjectObject";
import { api, handleError } from "@/helpers/api";
import { Project } from "@/store/project";
import { Spinner } from "@nextui-org/react";

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
    <div className="flex justify-center p-6">
      <Spinner size="lg" />
    </div>
  ) : (
    <ProjectListingsObject projects={projects} title="🎯 Public Project Listings" />
  );
};

export default PublicProjectsPage;