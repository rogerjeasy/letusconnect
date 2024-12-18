"use client";

import React, { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";
import { api, handleError } from "@/helpers/api";
import { Message } from "@/store/message";
import { Input, Button, Avatar, Card } from "@nextui-org/react";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    // Initialize Pusher for real-time updates
    const pusher = new Pusher(process.env.PUSHER_KEY!, {
      cluster: process.env.PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe("messages-channel");
    channel.bind("new-message", (data: Message) => {
      if (
        (data.senderId === currentUserId && data.receiverId === receiverId) ||
        (data.senderId === receiverId && data.receiverId === currentUserId)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    });

    // Cleanup on unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
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
      console.log("Messages fetched:", response.data);
    } catch (err) {
      const errorMessage = handleError(err);
      console.error(`Failed to fetch messages: ${errorMessage}`);
      setMessages([]); // Ensure it's set to an empty array on error
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const token = localStorage.getItem("token");

    try {
      await api.post("/api/messages/send", {
        senderId: currentUserId,
        receiverId,
        content: newMessage,
      },
      {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });
      setNewMessage("");
    } catch (err) {
      const errorMessage = handleError(err);
      console.error(`Failed to send message: ${errorMessage}`);
      alert(`Failed to send message: ${errorMessage}`);
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
        {Array.isArray(messages) && messages.map((msg) => (
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

      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          fullWidth
        />
        <Button
          color={newMessage.trim() ? "success" : "warning"}
          onClick={sendMessage}
          disabled={!newMessage.trim()}
        >
          <FaPaperPlane />
        </Button>
      </div>
    </Card>
  );
};

export default ChatInterface;