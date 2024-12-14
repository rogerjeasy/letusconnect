"use client";

import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button } from "@nextui-org/react";
import { FaEye, FaUserPlus } from "react-icons/fa";

interface Project {
  id: string;
  title: string;
  description: string;
  owner: {
    name: string;
    avatarUrl: string;
  };
  skillsNeeded: string[];
  collaborationType: string;
  industry: string;
  status: string;
}

interface ProjectCardProps {
  project: Project;
}

// Function to get status color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "open":
      return "text-green-500";
    case "in progress":
      return "text-blue-500";
    case "completed":
      return "text-purple-500";
    case "archived":
      return "text-gray-500";
    default:
      return "text-red-500";
  }
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  const truncateDescription = (description: string) => {
    const words = description.split(" ");
    return words.length > 20 ? words.slice(0, 20).join(" ") + "..." : description;
  };

  return (
    <Card className="w-85 h-85 flex flex-col justify-between shadow-lg">
      <CardHeader className="flex items-center gap-4">
        <Avatar src={project.owner.avatarUrl} alt={project.owner.name} />
        <div>
          <h3 className="font-bold">{project.title}</h3>
          <p className="text-sm text-gray-500">Owner: {project.owner.name}</p>
        </div>
      </CardHeader>
      <CardBody className="flex-grow">
        <p className="text-gray-700 mb-2">{truncateDescription(project.description)}</p>
        <p className="text-sm text-gray-600">
          <strong>Skills Needed:</strong> {project.skillsNeeded.join(", ")}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Collaboration Type:</strong> {project.collaborationType}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Industry:</strong> {project.industry}
        </p>
        <p className={`text-sm font-semibold ${getStatusColor(project.status)}`}>
          <strong>Status:</strong> {project.status}
        </p>
      </CardBody>
      <CardFooter className="flex gap-2">
        <Button color="primary" size="sm" className="w-1/2">
          <FaEye className="mr-2" /> View Details
        </Button>
        <Button color="success" size="sm" className="w-1/2">
          <FaUserPlus className="mr-2" /> Join Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
