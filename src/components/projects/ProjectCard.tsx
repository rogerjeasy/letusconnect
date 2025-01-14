import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Tooltip, Spinner } from "@nextui-org/react";
import { FaEdit, FaEye, FaTrash, FaUserPlus, FaClock, FaUserCheck, FaBell } from "react-icons/fa";
import { Project } from "@/store/project";
import { useUserStore } from "@/store/userStore";

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

interface ProjectCardProps {
  project: Project;
  onViewDetails?: (project: Project) => void;
  onUpdateProject?: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
  onJoinProject?: (projectId: string) => void;
  isLoading?: boolean;
}

const ProjectCard = ({ project, onViewDetails, onUpdateProject, onDeleteProject, onJoinProject, isLoading = false }: ProjectCardProps) => {
  const user = useUserStore((state) => state.user);

  // Function to truncate long descriptions
  const truncateDescription = (description: string) => {
    const words = description.split(" ");
    return words.length > 20 ? words.slice(0, 20).join(" ") + "..." : description;
  };

  // Check if the user is the owner
  const isOwner =
    user?.uid === project.ownerId ||
    (Array.isArray(project.participants) &&
      project.participants.some((participant) => participant.userId === user?.uid && participant.role === "owner"));

  // Check if the user is in the join requests list
  const isPendingApproval =
    Array.isArray(project.joinRequests) && project.joinRequests.some((request) => request.userId === user?.uid);

  // Check if the user is a participant (but not the owner)
  const isParticipant =
    Array.isArray(project.participants) &&
    project.participants.some((participant) => participant.userId === user?.uid && participant.role !== "owner");

  return (
    <Card className="w-85 h-85 flex flex-col justify-between shadow-lg relative overflow-visible">
      {/* Notification Icon for Pending Join Requests */}
      {isOwner && Array.isArray(project.joinRequests) && project.joinRequests.length > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <Tooltip
            content={
              <div className="text-center">
                <p className="font-bold">New Join Requests</p>
                <p className="text-xs text-gray-500">Click to view and manage</p>
              </div>
            }
            color="secondary"
            placement="left"
            offset={15}
          >
            <div className="relative cursor-pointer">
              <FaBell className="text-yellow-500 text-2xl" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {project.joinRequests.length}
              </span>
            </div>
          </Tooltip>
        </div>
      )}

      <CardHeader className="flex items-center gap-4">
        <Avatar
          src={
            Array.isArray(project.participants) && project.participants.length > 0
              ? project.participants[0]?.profilePicture
              : undefined
          }
          alt="Avatar"
        />
        <div>
          <h3 className="font-bold">{project.title}</h3>
          <p className="text-sm text-gray-500">Owner: {project.ownerUsername}</p>
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
        <p className="text-sm text-gray-600">
        <strong>
          Number of Participant{Array.isArray(project.participants) && project.participants.length > 1 ? "s" : ""}:
        </strong>{" "}
          {Array.isArray(project.participants) ? project.participants.length : 0}
        </p>

        <p className={`text-sm font-semibold ${getStatusColor(project.status)}`}>
          <strong>Status:</strong> {project.status}
        </p>
      </CardBody>

      <CardFooter className="flex gap-2">
        <Button color="primary" size="sm" className="w-1/2" onPress={() => onViewDetails && onViewDetails(project)}>
          <FaEye className="mr-2" /> View Details
        </Button>

        {isOwner ? (
          <>
            <Button color="warning" size="sm" className="w-1/3" onPress={() => onUpdateProject && onUpdateProject(project)}>
              <FaEdit className="mr-2" /> Update
            </Button>
            <Button color="danger" size="sm" className="w-1/3" onPress={() => onDeleteProject && onDeleteProject(project.id)}>
              <FaTrash className="mr-2" /> Delete
            </Button>
          </>
        ) : isPendingApproval ? (
          <Button color="secondary" size="sm" className="w-1/2" disabled>
            <FaClock className="mr-2" /> Waiting for Approval
          </Button>
        ) : isParticipant ? (
          <Button color="warning" size="sm" className="w-1/2" disabled>
            <FaUserCheck className="mr-2" /> Joined
          </Button>
        ) : (
          <Button 
            color="success" 
            size="sm" 
            className="w-1/2"
            isDisabled={isLoading}
            onPress={() => onJoinProject && onJoinProject(project.id)}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" color="white" /> 
                Joining...
              </div>
            ) : (
              <>
                <FaUserPlus className="mr-2" /> Join Now
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;