"use client";

import React from "react";
import { Card, CardHeader, CardBody, Divider, Avatar } from "@nextui-org/react";
import { Participants } from "@/store/project";

interface ParticipantsCardProps {
  participants: Participants[];
  title?: string; 
  className?: string; 
}

const ParticipantsCard: React.FC<ParticipantsCardProps> = ({
  participants,
  title = "Participants",
  className = "h-full border shadow-md",
}) => {
  return (
    <Card className={className}>
      <CardHeader className="text-lg font-semibold">{title}</CardHeader>
      <Divider />
      <CardBody className="space-y-4 overflow-y-auto">
        {participants.length > 0 ? (
          participants.map((participant, index) => (
            <div key={participant.userId || index} className="flex items-center gap-3">
              <Avatar
                src={participant.profilePicture}
                alt={participant.username}
                className="shadow-md"
              />
              <div>
                <p className="font-semibold text-sm">{participant.username}</p>
                {participant.role === "owner" && (
                  <p className="text-xs text-blue-500">Admin</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No participants available.</p>
        )}
      </CardBody>
    </Card>
  );
};

export default ParticipantsCard;