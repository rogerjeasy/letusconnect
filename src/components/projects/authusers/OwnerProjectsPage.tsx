"use client";

import React, { useEffect, useState } from "react";
import ProjectListingObject from "../ListProjectObject";
import { Project } from "@/store/project";
import { api, handleError } from "@/helpers/api";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import ProjectCardWhileLoading from "../ProjectCardWhileLoading";
import { API_CONFIG } from "@/config/api.config";

const OwnerProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchOwnerProjects = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(API_CONFIG.ENDPOINTS.PROJECTS.OWNER);

        setProjects(response.data.data);
      } catch (err) {
        const errorMessage = handleError(err);
        setError(`Failed to fetch owner projects. ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerProjects();
  }, [router]);

  return (
    <section className="p-6">
      {loading && (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-center">👤 Your Created Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10">
            {/* Display placeholder cards while loading */}
            {Array.from({ length: 4 }).map((_, index) => (
            <ProjectCardWhileLoading key={index} />
            ))}
        </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <ProjectListingObject projects={projects} title="👤 Your Created Projects" />
      )}

      {!loading && error && (
        <div className="text-center mt-4">
          <Button color="primary" onPress={() => router.push("/login")}>
            Go to Login
          </Button>
        </div>
      )}
    </section>
  );
};

export default OwnerProjectsPage;