"use client";

import React, { useState, useEffect, use } from "react";
import { Card, CardHeader, CardBody, Divider, Input, Button, CardFooter, Tooltip } from "@nextui-org/react";
import { Avatar, AvatarGroup } from "@nextui-org/react";
import { BaseMessage } from "@/store/groupChat";
import { sendMessageToGroup } from "@/utils/groupChatUtils";
import { Participants } from "@/store/project";
import { useUserStore } from "@/store/userStore";
import { sendDirectMessage } from "@/utils/directMessageUtils";
import { DirectMessage } from "@/store/message";
import { FaCog } from "react-icons/fa";
import ChatSettings from "./ChatSettings";

type Message = BaseMessage | DirectMessage;

interface GroupMessagesCardProps {
  groupChatId?: string;
  token: string;
  initialMessages: Message[];
  participants?: Participants[];
}

const GroupMessagesCard: React.FC<GroupMessagesCardProps> = ({
  groupChatId,
  token,
  initialMessages,
  participants = [],
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const user = useUserStore((state) => state.user);
  const currentUserId = user?.uid || "";
  const [isChatSettingsOpen, setIsChatSettingsOpen] = useState(false);

  useEffect(() => {
    if (groupChatId) {
      setLoadingMessages(true);
      setMessages(initialMessages);
      setLoadingMessages(false);
    }
  }, [groupChatId, initialMessages]);
    

  const handleSendMessage = async () => {
    if (groupChatId) {
      await sendMessageToGroup(
        groupChatId,
        newMessage,
        token,
        (groupMessages) =>
          setMessages((prevMessages) =>
            typeof groupMessages === "function"
              ? [...prevMessages, ...groupMessages(prevMessages)]
              : [...prevMessages, ...groupMessages]
          ),
        setNewMessage,
        setSendingMessage
      );
    } else if (participants.length === 1) {
      await sendDirectMessage(
        participants[0].userId,
        newMessage,
        token,
        (directMessages) =>
          setMessages((prevMessages) =>
            typeof directMessages === "function"
              ? [...prevMessages, ...directMessages(prevMessages)]
              : [...prevMessages, ...directMessages]
          ),
        setNewMessage,
        setSendingMessage
      );
    }
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
          <AvatarGroup size="md">
            {participants.map((participant) => (
              <Tooltip key={participant.userId} content={participant.username}>
                <Avatar
                  key={participant.userId}
                  src={participant.profilePicture || ""}
                  alt={participant.username}
                  className="shadow-md"
                />
              </Tooltip>
            ))}
          </AvatarGroup>
        );
      }
    }
    return <span className="text-lg font-semibold">Messages</span>;
  };

  const groupMessagesByDate = () => {
    return messages.reduce((groups: Record<string, Message[]>, message) => {
      // Ensure the message has a valid createdAt
      if (!message.createdAt) {
        console.warn("Message without createdAt:", message);
        return groups;
      }
  
      const date = new Date(message.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  };  

  const groupedMessages = groupMessagesByDate();
  const currentDate = new Date().toLocaleDateString();

  return (
    <Card className="h-full border shadow-md">
       <CardHeader className="flex items-center justify-between gap-2">
        {renderHeaderContent()}
        <ChatSettings
          isGroup={!!groupChatId}
          participants={participants}
          currentUserId={currentUserId}
          onAddUser={() => console.log("Add user clicked")}
          onRemoveUser={() => console.log("Remove user clicked")}
          onEditGroup={() => console.log("Edit group clicked")}
          onDeleteGroup={() => console.log("Delete group clicked")}
          onLeaveGroup={() => console.log("Leave group clicked")}
        />
      </CardHeader>
      <Divider />
      <CardBody className="overflow-y-auto space-y-4">
        {loadingMessages ? (
          <p>Loading messages...</p>
        ) : Object.keys(groupedMessages).length > 0 ? (
          Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date}>
              <div className="text-center text-sm font-bold text-gray-500 my-2">
                {date === currentDate ? "Today" : date}
              </div>
              {messages.map((msg, index) => (
                <div
                key={`${msg.id}-${index}`}
                  className={`mb-3 flex ${
                    msg.senderId === currentUserId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex flex-col max-w-[70%]">
                    <div
                      className={`p-2 rounded-t-lg ${
                        msg.senderId === currentUserId ? "bg-blue-500 text-white" : "bg-gray-200"
                      }`}
                    >
                      {msg.senderId !== currentUserId && "senderName" in msg && (
                        <p className="text-xs font-bold">{msg.senderName}</p>
                      )}
                      <p>{msg.content}</p>
                    </div>
                    <hr
                      className={`border-t-1 ${
                        msg.senderId === currentUserId
                          ? "border-blue-300"
                          : "border-gray-300"
                      }`}
                    />
                    <div
                      className={`p-1 rounded-b-lg text-xs text-right ${
                        msg.senderId === currentUserId
                          ? "bg-blue-200 text-blue-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
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