"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Tooltip, Textarea } from "@nextui-org/react";
import { FaUserPlus, FaEnvelope, FaUserTie, FaGraduationCap } from "react-icons/fa";
import { User, useUserStore } from "@/store/userStore";
import ModalPopup from "../forms/ModalPopup";
import { useRouter } from "next/navigation";
import { getUserConnections } from "@/services/connection.service";
import SendRequestComponent from "./SendRequestComponent";
import { SentRequest } from "@/store/userConnections";
import { Users2 } from "lucide-react";

interface UserCardProps {
  user: User;
  onConnect?: (userId: string) => void;
  onViewProfile?: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onConnect, onViewProfile }) => {
  const avatarPicture = user?.profilePicture;
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [hasSentRequest, setHasSentRequest] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSendRequestOpen, setIsSendRequestOpen] = useState(false);

  const handleConnect = async () => {
    if (!currentUser) {
      setIsLoginPromptOpen(true);
      return;
    }
    setIsSendRequestOpen(true);
  };

  const handleRequestSent = (request: SentRequest) => {
    setHasSentRequest(true);
  };

  const handleRequestComplete = () => {
    checkExistingRequest();
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
          isConnected ? user.username + " is your connection" : 
          hasPendingRequest ? "Request Pending - Click to review" : 
          hasSentRequest ? "Request Sent - Click to check status" : 
          "Click to connect with " + user.username
        }>
          <Button
            color={
              isConnected ? "success" :
              hasPendingRequest ? "warning" :
              hasSentRequest ? "danger" :
              "primary"
            }
            size="sm"
            onPress={
              isConnected ? () => router.push("/connections?status=active") :
              hasPendingRequest ? () => router.push("/connections?status=pending") :
              hasSentRequest ? () => router.push("/connections?status=sent") :
              handleConnect
            }
            isLoading={loading}
            // isDisabled={isConnected}
          >
            <FaUserPlus className="mr-2" />
            {isConnected ? "Connected" : 
            hasPendingRequest ? "Request to Connect" :
            hasSentRequest ? "Request Sent" :
            "Connect"}
          </Button>
        </Tooltip>
        <Tooltip content={`Click to view ${user.username}'s Profile`}>
          <Button
            color="secondary"
            size="sm"
            onPress={() => router.push(`/profile/${user.uid}`)}
          >
            <Users2 className="mr-2 h-4 w-4" /> View Profile
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

      {/* Add SendRequestComponent */}
      <SendRequestComponent
        isOpen={isSendRequestOpen}
        onOpenChange={setIsSendRequestOpen}
        targetUid={user.uid}
        targetUsername={`${user.firstName} ${user.lastName}` || user.username}
        onRequestSent={handleRequestSent}
        onRequestComplete={handleRequestComplete}
      />
    </Card>
  );
};

export default UserCard;