"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  Button,
  Divider,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Input,
} from "@nextui-org/react";
import { GroupChat, BaseMessage } from "@/store/groupChat";
import { Participants } from "@/store/project";
import { api, handleError } from "@/helpers/api";
import { FaCog } from "react-icons/fa";

interface ModalGroupChatProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string; // Group Chat ID
  token: string; // Authorization token
}

const ModalGroupChat: React.FC<ModalGroupChatProps> = ({
  isOpen,
  onClose,
  groupId,
  token,
}) => {
  const [messages, setMessages] = useState<BaseMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [groupName, setGroupName] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [groupChatId, setGroupChatId] = useState("");

  const fetchGroupChatDetails = async () => {
    try {
      setLoadingMessages(true);
      const response = await api.get(`/api/group-chats/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const groupChat: GroupChat = response.data.data;
      setGroupChatId(groupChat.id);
      setMessages(groupChat.messages || []);
      setParticipants(
        groupChat.participants.sort((a, b) =>
          a.role === "owner" && b.role !== "owner" ? -1 : 1
        )
      );
      setGroupName(groupChat.name);
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
  
    try {
      setSendingMessage(true);
      const payload = {
        groupChatId: groupChatId,
        content: newMessage,
      };
      const response = await api.post(`/api/group-chats/messages`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sentMessage: BaseMessage = response.data.data;
      setMessages((prevMessages) => [...prevMessages, sentMessage]);
      setNewMessage("");
    } catch (error) {
      handleError(error);
    } finally {
      setSendingMessage(false);
    }
  };  

  useEffect(() => {
    if (isOpen) fetchGroupChatDetails();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="opaque" closeButton>
      <ModalContent className="w-[90vw] h-[80vh]">
        <Card className="w-full h-full">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-center w-full">
              {groupName}
            </h2>
            <Button
              isIconOnly
              variant="light"
              color="primary"
              className="absolute top-2 right-2"
            >
              <FaCog />
            </Button>
          </CardHeader>

          <CardBody className="flex gap-4 h-full">
            {/* Participants List */}
            <Card className="w-[25%] overflow-y-auto border shadow-md h-full">
              <CardHeader className="text-lg font-semibold">
                Participants
              </CardHeader>
              <Divider />
              <CardBody className="space-y-4">
                {participants.map((participant, index) => (
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
                ))}
                </CardBody>
            </Card>

            {/* Messages Section */}
            <Card className="flex-grow border shadow-md h-full">
              <CardHeader className="text-lg font-semibold">Messages</CardHeader>
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
                  isDisabled={sendingMessage}
                />
                <Button
                  color="primary"
                  onClick={sendMessage}
                  isDisabled={sendingMessage || !newMessage.trim()}
                >
                  {sendingMessage ? "Sending..." : "Send"}
                </Button>
              </div>
            </Card>
          </CardBody>
          <Divider />

          <div className="p-4 flex justify-end">
            <Button color="danger" onClick={onClose}>
              Close
            </Button>
          </div>
        </Card>
      </ModalContent>
    </Modal>
  );
};

export default ModalGroupChat;
