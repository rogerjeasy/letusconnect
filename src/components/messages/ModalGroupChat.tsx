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
  Tooltip,
} from "@nextui-org/react";
import { GroupChat, BaseMessage } from "@/store/groupChat";
import { Participants } from "@/store/project";
import { api, handleError } from "@/helpers/api";
import { FaCog, FaTimes } from "react-icons/fa";

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
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      backdrop="opaque" 
      closeButton={false}
      className="max-w-[98vw]"
    >
      <ModalContent className="w-[80vw] h-[75vh] max-w-[98vw]">
        <Card className="w-full h-full">
            <CardHeader className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-cyan-50 to-blue-50 p-6 rounded-t-lg">
                <h2 className="text-lg font-semibold text-center w-full text-blue-900">
                    {groupName}
                </h2>
                <div className="absolute top-4 right-4 flex gap-2">
                    <Tooltip 
                    content="Group Settings" 
                    placement="bottom" 
                    delay={200} 
                    closeDelay={0}
                    className="text-sm"
                    >
                    <Button
                        isIconOnly
                        variant="light"
                        color="primary"
                        className="bg-green/50 hover:bg-white/80 transition-colors"
                    >
                        <FaCog className="text-blue-600" />
                    </Button>
                    </Tooltip>
                    <Tooltip 
                    content="Close Chat" 
                    placement="bottom" 
                    color="danger"
                    delay={200} 
                    closeDelay={0}
                    className="text-sm"
                    >
                    <Button
                        isIconOnly
                        variant="light"
                        color="danger"
                        onClick={onClose}
                        className="bg-white/50 hover:bg-white/80 transition-colors"
                    >
                        <FaTimes className="text-red-600" />
                    </Button>
                    </Tooltip>
                </div>
            </CardHeader>

          <CardBody className="flex flex-row gap-4 h-full">
            {/* Participants List */}
            <div className="w-1/4 h-full">
              <Card className="h-full border shadow-md">
                <CardHeader className="text-lg font-semibold">
                  Participants
                </CardHeader>
                <Divider />
                <CardBody className="space-y-4 overflow-y-auto">
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
            </div>

            {/* Messages Section */}
            <div className="w-3/4 h-full">
              <Card className="h-full border shadow-md">
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
            </div>
          </CardBody>
        </Card>
      </ModalContent>
    </Modal>
  );
};

export default ModalGroupChat;
