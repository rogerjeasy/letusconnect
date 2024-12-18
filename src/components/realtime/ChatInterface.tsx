"use client";

import React, { useEffect, useState, useRef } from "react";
import { api, handleError } from "@/helpers/api";
import { Message } from "@/store/message";
import { Input, Button, Avatar, Card, Chip } from "@nextui-org/react";
import { FaPaperPlane } from "react-icons/fa";
import { getPusherInstance } from "@/helpers/pusher";

interface ChatInterfaceProps {
  currentUserId: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentUserId,
  receiverId,
  receiverName,
  receiverAvatar,
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
      const conversationChannel = [currentUserId, receiverId].sort().join("-");
      const channel = pusher.subscribe(`private-messages-${conversationChannel}`);

      // Listen for new messages
      channel.bind("new-message", (data: Message) => {
        if (
          (data.senderId === currentUserId && data.receiverId === receiverId) ||
          (data.senderId === receiverId && data.receiverId === currentUserId)
        ) {
          setMessages((prev) => [...prev, data]);
        }
      });

      // Listen for typing indicator
      channel.bind("user-typing", (data: { senderId: string; receiverId: string }) => {
        if (data.senderId === receiverId) {
          setTypingIndicator(`${receiverName} is typing...`);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setTypingIndicator(""), 3000);
        }
      });

      channel.bind("pusher:subscription_error", (error: Error) => {
        console.error("Pusher subscription error:", error);
      });

      // Cleanup on unmount
      return () => {
        channel.unbind_all();
        pusher.unsubscribe(`private-messages-${conversationChannel}`);
      };
    }
  }, [currentUserId, receiverId]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/api/messages?senderId=${currentUserId}&receiverId=${receiverId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        setMessages([]);
      }
    } catch (err) {
      const errorMessage = handleError(err);
      console.error(`Failed to fetch messages: ${errorMessage}`);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const token = localStorage.getItem("token");

    try {
      await api.post(
        "/api/messages/send",
        {
          senderId: currentUserId,
          receiverId,
          content: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewMessage("");
      setIsTyping(false);
    } catch (err) {
      const errorMessage = handleError(err);
      console.error(`Failed to send message: ${errorMessage}`);
      alert(`Failed to send message: ${errorMessage}`);
    }
  };

  const handleTyping = async () => {
    if (!isTyping) {
      setIsTyping(true);
      await api.post(
        "/api/messages/typing",
        { senderId: currentUserId, receiverId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Reset typing state after 3 seconds of inactivity
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1000);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Card className="max-w-md mx-auto p-4 shadow-lg h-[500px] flex flex-col">
      <div className="flex items-center gap-4 border-b pb-3 mb-3">
        <Avatar src={receiverAvatar || "/default-avatar.png"} alt={receiverName} size="lg" />
        <h2 className="text-xl font-bold">{receiverName}</h2>
      </div>

      <div className="flex-1 overflow-y-auto mb-3">
        {Array.isArray(messages) &&
          messages.map((msg) => (
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
      </div>

      {typingIndicator && (
        <Chip color="primary" className="mb-2 self-start" variant="bordered">
          {typingIndicator}
        </Chip>
      )}

      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          fullWidth
        />
        <Button color={newMessage.trim() ? "success" : "warning"} onClick={sendMessage} disabled={!newMessage.trim()}>
          <FaPaperPlane />
        </Button>
      </div>
    </Card>
  );
};

export default ChatInterface;