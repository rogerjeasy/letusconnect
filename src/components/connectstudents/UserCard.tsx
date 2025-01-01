"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Tooltip, Textarea } from "@nextui-org/react";
import { FaUserPlus, FaEnvelope, FaUserTie, FaGraduationCap } from "react-icons/fa";
import { User, useUserStore } from "@/store/userStore";
import ModalPopup from "../forms/ModalPopup";
import { useRouter } from "next/navigation";
import { handleGetConnections, handleSendConnectionRequest } from "../apihandling/HandleUserConnections";

interface UserCardProps {
  user: User;
  onConnect?: (userId: string) => void;
  onViewProfile?: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onConnect, onViewProfile }) => {
  const avatarPicture = user?.profilePicture;
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  const [hasExistingRequest, setHasExistingRequest] = useState(false);

  const handleConnect = async () => {
    if (!currentUser) {
      setIsLoginPromptOpen(true);
      return;
    }
    setIsConnectModalOpen(true);
  };

  const handleSendRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    setLoading(true);
    const success = await handleSendConnectionRequest(user.uid, message, token);
    setLoading(false);
  
    if (success) {
      setIsConnectModalOpen(false);
      setMessage("");
    }
  };

  // useEffect(() => {
  //   checkExistingRequest();
  // }, []);
  
  const checkExistingRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const connections = await handleGetConnections(token);
      setHasExistingRequest(connections?.pendingRequests[user.uid] != null);
    } catch (error) {
      console.error("Error checking connection status:", error);
    }
  };

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
      <Tooltip content={hasExistingRequest ? "Request Pending" : "Connect"}>
        <Button
          color="primary"
          size="sm"
          onClick={handleConnect}
          isLoading={loading}
          isDisabled={hasExistingRequest}
        >
          <FaUserPlus className="mr-2" />
          {hasExistingRequest ? "Request Sent" : "Connect"}
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
      <ModalPopup
        isOpen={isLoginPromptOpen}
        title="Login Required"
        content="You need to log in to connect with other users."
        confirmLabel="Continue to Login"
        cancelLabel="Cancel"
        confirmColor="primary"
        cancelColor="danger"
        onConfirm={() => {
          setIsLoginPromptOpen(false);
          router.push("/login");
        }}
        onCancel={() => setIsLoginPromptOpen(false)}
        showCancelButton={true}
      />

      <ModalPopup
        isOpen={isConnectModalOpen}
        title="Add a Personalized Message"
        content={
          <div className="space-y-4">
            <p>Send a connection request to {user.firstName} {user.lastName}</p>
            <Textarea
              placeholder="Write a message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full"
            />
          </div>
        }
        confirmLabel="Send Request"
        cancelLabel="Cancel"
        confirmColor="primary"
        cancelColor="danger"
        onConfirm={handleSendRequest}
        onCancel={() => {
          setIsConnectModalOpen(false);
          setMessage("");
        }}
        showCancelButton={true}
        isLoading={loading}
      />
    </Card>
    
  );
};

export default UserCard;