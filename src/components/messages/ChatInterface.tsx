"use client";

import React, { useEffect, useState, useRef } from "react";
import { api, handleError } from "@/helpers/api";
import { Message } from "@/store/message";
import { Input, Button, Avatar, Card, Chip } from "@nextui-org/react";
import { FaPaperPlane } from "react-icons/fa";
import { getPusherInstance } from "@/helpers/pusher";
import { useUserStore } from "@/store/userStore";
import { AxiosError } from "axios";

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
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    fetchMessages();

    const pusher = getPusherInstance();
    if (pusher) {
      const conversationChannel = [currentUserId, receiverId].sort().join("-");
      const channel = pusher.subscribe(`private-messages-${conversationChannel}`);

      channel.bind("new-direct-message", (data: Message) => {
        if (
          (data.senderId === currentUserId && data.receiverId === receiverId) ||
          (data.senderId === receiverId && data.receiverId === currentUserId)
        ) {
          setMessages((prev) => [...prev, data]);
        }
      });

      channel.bind("user-typing", (data: { senderId: string; receiverId: string }) => {
        if (data.senderId === receiverId) {
          setTypingIndicator(`${receiverName} is typing...`);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setTypingIndicator(""), 3000);
        }
      });

      return () => {
        channel.unbind_all();
        pusher.unsubscribe(`private-messages-${conversationChannel}`);
      };
    }
  }, [currentUserId, receiverId]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(
        `/api/messages/direct?senderId=${currentUserId}&receiverId=${receiverId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const messages = response.data.messages.directMessages;
  
      if (Array.isArray(messages) && messages.length > 0) {
        setMessages(messages);
      } else {
        setMessages([]);
      }
    } catch (err) {
      // Check if the error is a 404 and contains a success message
      const error = err as AxiosError<{ success?: string }>;
      if (error.response?.status === 404 && error.response?.data?.success) {
        console.warn(`Starting a new conversation: ${error.response.data.success}`);
        setMessages([]); // No existing messages, start with an empty array
      } else {
        const errorMessage = handleError(err);
        console.error(`Failed to fetch messages: ${errorMessage}`);
        setMessages([]); // Default to an empty array on other errors
      }
    }
  };
  

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const token = localStorage.getItem("token");

    try {
      await api.post(
        "/api/messages/direct",
        {
          senderId: currentUserId,
          receiverId,
          content: newMessage,
          createdAt: new Date().toString(),
          senderName: user?.username,
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

  // Group messages by date
  const groupMessagesByDate = () => {
    return messages.reduce((groups: Record<string, Message[]>, message) => {
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
    <Card className="max-w-md mx-auto p-4 shadow-lg h-[500px] flex flex-col">
      <div className="flex items-center gap-4 border-b pb-3 mb-3">
        <Avatar src={receiverAvatar} alt={receiverName} size="lg" />
        <h2 className="text-xl font-bold">{receiverName}</h2>
      </div>

      <div className="flex-1 overflow-y-auto mb-3">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date}>
            <div className="text-center text-sm font-bold text-gray-500 my-2">
              {date === currentDate ? "Today" : date}
            </div>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
              >
                <div className="flex flex-col max-w-[70%]">
                  <div
                    className={`p-2 rounded-t-lg ${
                      msg.senderId === currentUserId ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                  <hr className={`border-t-1 ${msg.senderId === currentUserId ? "border-blue-300" : "border-gray-300"}`} />
                  <div
                    className={`p-1 rounded-b-lg text-xs text-right ${
                      msg.senderId === currentUserId ? "bg-blue-200 text-blue-800" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {typingIndicator && (
        <Chip color="primary" className="mb-2 self-start" variant="bordered">
          {typingIndicator}
        </Chip>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
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
        <Button
          className="w-full sm:w-auto"
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