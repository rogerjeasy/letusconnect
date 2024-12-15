"use client";

import React, { useEffect, useState } from "react";
import ProjectListingObject from "../ListProjectObject";
import { Project } from "@/store/project";
import { api, handleError } from "@/helpers/api";
import { Spinner, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const JoinedProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchJoinedProjects = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authorization token is missing. Please log in.");
          return;
        }

        const response = await api.get("/api/projects/participation", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);
        setProjects(response.data.data);
      } catch (err) {
        const errorMessage = handleError(err);
        setError(`Failed to fetch joined projects. ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedProjects();
  }, [router]);

  return (
    <section className="p-6">
      {loading && (
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <ProjectListingObject projects={projects} title="🤝 Joined Projects" />
      )}

      {!loading && error && (
        <div className="text-center mt-4">
          <Button color="primary" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        </div>
      )}
    </section>
  );
};

export default JoinedProjectsPage;