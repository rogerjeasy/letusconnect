"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Tooltip, Textarea } from "@nextui-org/react";
import { FaUserPlus, FaEnvelope, FaUserTie, FaGraduationCap } from "react-icons/fa";
import { User, useUserStore } from "@/store/userStore";
import ModalPopup from "../forms/ModalPopup";
import { useRouter } from "next/navigation";
import { getConnectionRequests, getUserConnections, sendConnectionRequest } from "@/services/connection.service";
import { toast } from "react-toastify";
import { handleError } from "@/helpers/api";

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
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [hasSentRequest, setHasSentRequest] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    if (!currentUser) {
      setIsLoginPromptOpen(true);
      return;
    }
    setIsConnectModalOpen(true);
  };

  const handleSendRequest = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      await sendConnectionRequest(user.uid, message);
      setIsConnectModalOpen(false);
      setMessage("");
      setHasSentRequest(true);

    } catch (error) {
      toast.error("Failed to send connection request."+ handleError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.uid) { 
      checkExistingRequest();
    }
  }, [currentUser, user.uid]);
  
  const checkExistingRequest = async () => {
    if (!currentUser) return;
  
    try {
      const connectionsResponse = await getUserConnections();
  
      // Check if connected
      const isConnected = !!(connectionsResponse?.connections && 
        typeof connectionsResponse.connections === 'object' &&
        user?.uid && 
        connectionsResponse.connections[user.uid] != null);
      
      // Check pending requests (requests received)
      const hasPendingRequest = !!(connectionsResponse?.pendingRequests && 
        connectionsResponse.pendingRequests[user.uid] != null);
      
      // Check sent requests
      const hasSentRequest = !!(connectionsResponse?.sentRequests && 
        connectionsResponse.sentRequests[user.uid] != null);
  
      setHasPendingRequest(hasPendingRequest);
      setHasSentRequest(hasSentRequest);
      setIsConnected(isConnected);
  
    } catch (error) {
      console.error("Error checking connection status:", error);
    }
  };

  const navigateToManageConnections = () => {
    router.push("/connections");
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
      </CardBody>

      <CardFooter className="flex gap-2">
        <Tooltip content={
          isConnected ? "Connected" : 
          hasPendingRequest ? "Request to Connect Received. Click to manage." : 
          hasSentRequest ? "Request Sent. Waiting for response. Click to manage." : 
          "Connect"
        }>
          <Button
            color={
              isConnected ? "success" :
              hasPendingRequest ? "warning" :
              hasSentRequest ? "danger" :
              "primary"
            }
            size="sm"
            onPress={hasPendingRequest || hasSentRequest ? navigateToManageConnections : handleConnect}
            isLoading={loading}
            isDisabled={isConnected}
          >
            <FaUserPlus className="mr-2" />
            {isConnected ? "Connected" : 
             hasPendingRequest ? "Request to Connect" :
             hasSentRequest ? "Request Sent" :
             "Connect"}
          </Button>
        </Tooltip>
        <Tooltip content="View Profile">
          <Button
            color="secondary"
            size="sm"
            onPress={() => router.push(`/profile/${user.uid}`)}
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