"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardBody, Divider, Input, Button, 
  Tooltip, DropdownTrigger, DropdownMenu, DropdownItem, Dropdown } from "@nextui-org/react";
import { Avatar, AvatarGroup } from "@nextui-org/react";
import { BaseMessage } from "@/store/groupChat";
import { sendMessageToGroup } from "@/utils/groupChatUtils";
import { Participants } from "@/store/project";
import { useUserStore } from "@/store/userStore";
import { sendDirectMessage } from "@/utils/directMessageUtils";
import { DirectMessage } from "@/store/message";
import ChatSettings from "./ChatSettings";
import { FaCamera, FaCopy, FaEllipsisH, FaFile, FaImage, FaMapMarkerAlt, 
  FaPlus, FaReply, FaShare, FaSmile, FaStar, FaThumbtack, FaTrash } from "react-icons/fa";

import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { handlePinMessage, handleUnPinMessage } from "@/components/messages/HandleMessageActions"

type Message = BaseMessage | DirectMessage;

interface GroupMessagesCardProps {
  groupChatId?: string;
  token: string;
  initialMessages: Message[];
  participants?: Participants[];
  pinnedMessages: string[];
  updatePinnedMessages: (groupChatId: string, messageId: string, isUnpin?: boolean) => void;
}

const GroupMessagesCard: React.FC<GroupMessagesCardProps> = ({
  groupChatId,
  token,
  initialMessages,
  participants = [],
  pinnedMessages = [],
  updatePinnedMessages,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const user = useUserStore((state) => state.user);
  const currentUserId = user?.uid || "";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const isAdmin = participants.some(
    (participant) =>
      participant.userId === currentUserId && participant.role === "owner"
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (groupChatId) {
      setLoadingMessages(true);
      setMessages(initialMessages);
      setLoadingMessages(false);
      scrollToBottom();
    }
  }, [groupChatId, initialMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
    

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
              <Tooltip
                key={participant.userId}
                content={`${participant.username}${participant.role === "owner" ? " (Admin)" : ""}`}
              >
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

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
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
                  <div className="flex flex-col max-w-[70%] bg-white rounded-lg shadow">
                    {/* First Section (Pin Icon and Options) */}
                    <div className="flex justify-between items-center p-2">
                      {pinnedMessages.includes(msg.id) && (
                        <FaThumbtack className="text-blue-500 text-lg" />
                      )}
                      <Dropdown>
                        <DropdownTrigger>
                          <button
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                            aria-label="Message Options"
                          >
                            <FaEllipsisH className="text-red-500 text-sm" />
                          </button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Message Options">
                        {isAdmin ? (
                            pinnedMessages.includes(msg.id) ? (
                              <DropdownItem
                                key="unpinMessage"
                                startContent={<FaThumbtack className="text-gray-500" />}
                                onClick={() =>
                                  handleUnPinMessage(groupChatId || "", msg.id, token, updatePinnedMessages)
                                }
                              >
                                Unpin Message
                              </DropdownItem>
                            ) : (
                              <DropdownItem
                                key="pinMessage"
                                startContent={<FaThumbtack className="text-gray-500" />}
                                onClick={() =>
                                  handlePinMessage(groupChatId || "", msg.id, token, updatePinnedMessages)
                                }
                              >
                                Pin Message
                              </DropdownItem>
                            )
                          ) : null}
                          <DropdownItem
                            key="reply"
                            startContent={<FaReply className="text-gray-500" />}
                            onClick={() => console.log("Reply clicked")}
                          >
                            Reply
                          </DropdownItem>
                          <DropdownItem
                            key="forwardMessage"
                            startContent={<FaShare className="text-blue-500" />}
                            onClick={() => console.log("Forward message clicked")}
                          >
                            Forward Message
                          </DropdownItem>
                          <DropdownItem
                            key="copyMessage"
                            startContent={<FaCopy className="text-green-500" />}
                            onClick={() => console.log("Copy message clicked")}
                          >
                            Copy Message
                          </DropdownItem>
                          <DropdownItem
                            key="starMessage"
                            startContent={<FaStar className="text-yellow-500" />}
                            onClick={() => console.log("Star message clicked")}
                          >
                            Star Message
                          </DropdownItem>
                          <DropdownItem
                            key="deleteMessage"
                            startContent={<FaTrash className="text-red-500" />}
                            onClick={() => console.log("Delete message clicked")}
                          >
                            Delete Message
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>

                    {/* Second Section (Message Content) */}
                    <div
                      className={`p-3 ${
                        msg.senderId === currentUserId
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {msg.senderId !== currentUserId && "senderName" in msg && (
                        <p className="text-xs font-bold">{msg.senderName}</p>
                      )}
                      <p>{msg.content}</p>
                    </div>

                    {/* Third Section (Timestamp) */}
                    <div
                      className={`p-2 text-xs text-right ${
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
        <Dropdown>
          <DropdownTrigger>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
              aria-label="Add options"
            >
              <FaPlus className="text-blue-500 text-lg" />
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Add Options">
            <DropdownItem
              key="document"
              startContent={<FaFile className="text-gray-500" />}
              onClick={() => console.log("Document clicked")}
            >
              Document
            </DropdownItem>
            <DropdownItem
              key="photos"
              startContent={<FaImage className="text-blue-500" />}
              onClick={() => console.log("Photos clicked")}
            >
              Photos
            </DropdownItem>
            <DropdownItem
              key="camera"
              startContent={<FaCamera className="text-green-500" />}
              onClick={() => console.log("Camera clicked")}
            >
              Camera
            </DropdownItem>
            <DropdownItem
              key="location"
              startContent={<FaMapMarkerAlt className="text-red-500" />}
              onClick={() => console.log("Location clicked")}
            >
              Location
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* Emoji Picker */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
          aria-label="Add Emoji"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <FaSmile className="text-yellow-500 text-lg" />
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-14 left-0 z-10 bg-white shadow-lg rounded-md">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

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