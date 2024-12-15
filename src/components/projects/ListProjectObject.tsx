"use client";

import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import { Card, CardFooter, Pagination, Spinner } from "@nextui-org/react";
import { Project } from "@/store/project";
import { FaFolderOpen } from "react-icons/fa";

const ITEMS_PER_PAGE = 3;

interface ProjectListingsSectionProps {
  projects: Project[];
  title: string;
}

const ProjectListingObject = ({ projects, title }: ProjectListingsSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the current projects to display based on the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 mb-6">
        {currentProjects.length > 0 ? (
          currentProjects.map((project) => (
            <div key={project.id} className="flex justify-center">
              <ProjectCard project={project} />
            </div>
          ))
        ) : (
          <div className="text-center col-span-full text-gray-500 flex flex-col items-center gap-2">
            <FaFolderOpen size={50} />
            <p>No projects available.</p>
          </div>
        )}
      </div>

      {projects.length > ITEMS_PER_PAGE && (
        <Card className="p-4 shadow-lg max-w-md mx-auto">
          <CardFooter className="flex justify-center">
            <Pagination
              total={Math.ceil(projects.length / ITEMS_PER_PAGE)}
              initialPage={1}
              page={currentPage}
              onChange={(page) => setCurrentPage(page)}
              showControls
              color="primary"
            />
          </CardFooter>
        </Card>
      )}
    </section>
  );
};

export default ProjectListingObject;
