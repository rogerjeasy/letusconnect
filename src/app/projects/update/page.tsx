"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import UpdateProject from "@/components/projects/authusers/UpdateProject";
import { Project } from "@/store/project";
import { api, handleError } from "@/helpers/api";

const UpdateProjectContent = () => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProject = sessionStorage.getItem("selectedProject");

    if (storedProject) {
      const parsedProject = JSON.parse(storedProject) as Project;
      if (parsedProject.id === projectId) {
        setProject(parsedProject);
        setLoading(false);
        return;
      }
    }

    // If no stored project or ID doesn't match, fetch from API
    const fetchProject = async () => {
      try {
        const response = await api.get(`/api/projects/${projectId}`);
        setProject(response.data.data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchProject();
  }, [projectId]);

  return loading ? (
    <div className="flex justify-center p-6">
      <Spinner size="lg" />
    </div>
  ) : project ? (
    <UpdateProject project={project} />
  ) : (
    <div className="text-center p-6 text-red-500">
      Project not found or an error occurred.
    </div>
  );
};

const UpdateProjectPage = () => (
  <Suspense fallback={<div className="flex justify-center p-6"><Spinner size="lg" /></div>}>
    <UpdateProjectContent />
  </Suspense>
);

export default UpdateProjectPage;