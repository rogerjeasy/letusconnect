"use client";

import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Tooltip } from "@nextui-org/react";
import { FaUserPlus, FaEnvelope, FaUserTie, FaGraduationCap } from "react-icons/fa";
import { User, generateRandomAvatar } from "@/store/userStore";

interface UserCardProps {
  user: User;
  onConnect?: (userId: string) => void;
  onViewProfile?: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onConnect, onViewProfile }) => {
  const avatarPicture = user?.profilePicture || generateRandomAvatar();
  return (
    <Card className="w-85 h-full flex flex-col justify-between shadow-lg relative overflow-visible">
      <CardHeader className="flex items-center gap-4">
        <Avatar
          src={avatarPicture}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-16 h-16"
        />
        <div>
          <h3 className="font-bold text-lg">{`${user.firstName} ${user.lastName}`}</h3>
          <p className="text-sm text-gray-500">{user.username}</p>
        </div>
      </CardHeader>

      <CardBody className="flex-grow space-y-2">
        <p className="text-gray-600">
          <FaUserTie className="inline mr-2 text-blue-500" />
          {user.currentJobTitle}
        </p>
        <p className="text-gray-600">
          <FaGraduationCap className="inline mr-2 text-green-500" />
          {user.program}, Class of {user.graduationYear}
        </p>
        <p className="text-gray-600">
          <strong>Expertise:</strong> {user.areasOfExpertise?.join(", ") || "No expertise listed"}
        </p>
        <p className="text-gray-600">
          <strong>Interests:</strong> {user.interests?.join(", ") || "No interests listed"}
        </p>
        <p className="text-gray-600">
          <strong>Bio:</strong> {user.bio || "No bio available"}
        </p>
        {user.lookingForMentor && (
          <p className="text-blue-500 font-semibold">Looking for a Mentor</p>
        )}
        {user.willingToMentor && (
          <p className="text-green-500 font-semibold">Willing to Mentor</p>
        )}
        {/* <p className="text-gray-600">
          <strong>Connections:</strong> {user.connections.length || 0}
        </p> */}
      </CardBody>

      <CardFooter className="flex gap-2">
        <Tooltip content="Connect">
          <Button
            color="primary"
            size="sm"
            onClick={() => onConnect && onConnect(user.uid)}
          >
            <FaUserPlus className="mr-2" /> Connect
          </Button>
        </Tooltip>
        <Tooltip content="View Profile">
          <Button
            color="secondary"
            size="sm"
            onClick={() => onViewProfile && onViewProfile(user.uid)}
          >
            <FaEnvelope className="mr-2" /> View Profile
          </Button>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};

export default UserCard;