"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Divider, Input, Button } from "@nextui-org/react";
import { Avatar, AvatarGroup } from "@nextui-org/react";
import { BaseMessage } from "@/store/groupChat";
import { sendMessageToGroup } from "@/utils/groupChatUtils";
import { Participants } from "@/store/project";

interface GroupMessagesCardProps {
  groupChatId: string;
  token: string;
  initialMessages: BaseMessage[];
  participants?: Participants[];
}

const GroupMessagesCard: React.FC<GroupMessagesCardProps> = ({
  groupChatId,
  token,
  initialMessages,
  participants,
}) => {
  const [messages, setMessages] = useState<BaseMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (groupChatId) {
      // Fetch messages for the provided groupChatId if needed
      setLoadingMessages(true);
      setMessages(initialMessages); // Assuming the parent updates initialMessages when groupChatId changes
      setLoadingMessages(false);
    }
  }, [groupChatId, initialMessages]);

  const handleSendMessage = async () => {
    await sendMessageToGroup(
      groupChatId,
      newMessage,
      token,
      setMessages,
      setNewMessage,
      setSendingMessage
    );
  };

  const renderHeaderContent = () => {
    if (participants) {
      if (participants.length === 1) {
        const participant = participants[0];
        return (
          <div className="flex items-center gap-2">
            <Avatar
              src={participant.profilePicture || ""}
              alt={participant.username}
              className="shadow-md"
            />
            <span className="text-lg font-semibold">{participant.username}</span>
          </div>
        );
      }
      if (participants.length > 1) {
        return (
          <AvatarGroup size="lg">
            {participants.map((participant) => (
              <Avatar
                key={participant.userId}
                src={participant.profilePicture || ""}
                alt={participant.username}
                className="shadow-md"
              />
            ))}
          </AvatarGroup>
        );
      }
    }
    return <span className="text-lg font-semibold">Messages</span>;
  };

  return (
    <Card className="h-full border shadow-md">
      <CardHeader className="flex items-center gap-2">{renderHeaderContent()}</CardHeader>
      <Divider />
      <CardBody className="overflow-y-auto space-y-4">
        {loadingMessages ? (
          <p>Loading messages...</p>
        ) : messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={message.id || index} className="p-2 border-b border-gray-300">
              <p>
                <strong>{message.senderName}</strong>: {message.content}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No messages available.</p>
        )}
      </CardBody>
      <Divider />
      <div className="p-4 flex items-center gap-2">
        <Input
          placeholder="Type a message..."
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          isDisabled={sendingMessage || loadingMessages}
        />
        <Button
          color="primary"
          onClick={handleSendMessage}
          isDisabled={sendingMessage || !newMessage.trim() || loadingMessages}
        >
          {sendingMessage ? "Sending..." : "Send"}
        </Button>
      </div>
    </Card>
  );
};

export default GroupMessagesCard;