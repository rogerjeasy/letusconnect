"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  Input,
  Avatar,
  Chip,
  ScrollShadow,
} from "@nextui-org/react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import { getPusherInstance } from "@/helpers/pusher";
import { api, handleError } from "@/helpers/api";
import { Message } from "@/store/message";
import { Participants } from "@/store/project";

interface GroupChatDrawerProps {
  projectTitle: string;
  participants: Participants[];
  onClose: () => void;
  currentUserId: string;
  projectId: string;
}

const GroupChatDrawer: React.FC<GroupChatDrawerProps> = ({
  projectTitle,
  participants,
  onClose,
  currentUserId,
  projectId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchMessages();

    const pusher = getPusherInstance();
    if (pusher) {
      const channel = pusher.subscribe(`group-messages-${projectId}`);

      channel.bind("new-message", (data: Message) => {
        setMessages((prev) => [...prev, data]);
      });

      channel.bind("user-typing", (data: { senderId: string; name: string }) => {
        if (data.senderId !== currentUserId) {
          setTypingIndicator(`${data.name} is typing...`);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setTypingIndicator(""), 3000);
        }
      });

      return () => {
        channel.unbind_all();
        pusher.unsubscribe(`group-messages-${projectId}`);
      };
    }
  }, [projectId, currentUserId]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/api/projects/${projectId}/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages(response.data || []);
    } catch (err) {
      const errorMessage = handleError(err);
      console.error("Failed to fetch messages:", errorMessage);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await api.post(
        `/api/projects/${projectId}/messages`,
        { senderId: currentUserId, content: newMessage },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setNewMessage("");
      setIsTyping(false);
    } catch (err) {
      console.error("Failed to send message:", handleError(err));
    }
  };

  const handleTyping = async () => {
    if (!isTyping) {
      setIsTyping(true);
      await api.post(
        `/api/projects/${projectId}/typing`,
        { senderId: currentUserId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Drawer isOpen onClose={onClose} placement="right" className="p-6">
      <DrawerContent className="w-full max-w-md">
        {/* Header */}
        <DrawerHeader className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">{projectTitle}</h2>
          <Button isIconOnly onClick={onClose} color="danger" aria-label="Close">
            <FaTimes />
          </Button>
        </DrawerHeader>

        {/* Body */}
        <DrawerBody className="flex-1 flex flex-col p-4">
          <div className="flex flex-1 overflow-hidden">
            {/* Participants List */}
            <div className="w-1/3 border-r p-4 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2">Participants</h3>
              <ScrollShadow className="h-full">
                {participants.map((participant) => (
                  <div key={participant.userId} className="flex items-center gap-3 mb-3">
                    <Avatar src={participant.profilePicture || "/default-avatar.png"} />
                    <p className="text-sm font-medium">{participant.username}</p>
                  </div>
                ))}
              </ScrollShadow>
            </div>

            {/* Messages Content */}
            <div className="w-2/3 p-4 flex flex-col">
              <ScrollShadow className="flex-1 mb-2 overflow-y-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-3 flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`p-2 rounded-lg max-w-[70%] ${
                        msg.senderId === currentUserId ? "bg-blue-500 text-white" : "bg-gray-200"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <small className="block text-xs mt-1 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </small>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </ScrollShadow>

              {typingIndicator && (
                <Chip color="primary" className="mb-2 self-start" variant="bordered">
                  {typingIndicator}
                </Chip>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex items-center gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              fullWidth
            />
            <Button color="success" onClick={sendMessage} disabled={!newMessage.trim()}>
              <FaPaperPlane />
            </Button>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default GroupChatDrawer;