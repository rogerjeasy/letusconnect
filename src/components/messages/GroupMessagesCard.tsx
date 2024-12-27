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
import { handlePinMessage, handleUnPinMessage, handleCopyMessage, handleAddDocuments } from "@/components/messages/HandleMessageActions"
import { handleLeaveGroup } from "./HandleGroupActions";
import PDFAttachment from "./PDFAttachment";
import ModalPopup from "@/components/forms/ModalPopup";
import { toast } from "react-toastify";
import { ModalAddMemberToGroup, ModalRemoveMemberFromGroup } from "./ChatManagementContentModals";
import { useParticipantsStore } from "@/store/participantsStore";
import { ChatEntity, useChatEntitiesStore } from "@/store/chatEntitiesStore";
import { getPusherInstance } from "@/helpers/pusher";

type Message = BaseMessage | DirectMessage;

interface GroupMessagesCardProps {
  groupChatId?: string;
  token: string;
  initialMessages: Message[];
  participants?: Participants[];
  pinnedMessages: string[];
  selectedEntity?: ChatEntity;
  updatePinnedMessages: (groupChatId: string, messageId: string, isUnpin?: boolean) => void;
}

const GroupMessagesCard: React.FC<GroupMessagesCardProps> = ({
  groupChatId,
  token,
  initialMessages,
  pinnedMessages = [],
  selectedEntity,
  updatePinnedMessages,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const currentUser = useUserStore((state) => state.user);
  const currentUserId = currentUser?.uid || "";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const { setParticipants, removeParticipant } = useParticipantsStore();
  const participants = useParticipantsStore((state) => state.participants);
  const removeEntity = useChatEntitiesStore((state) => state.removeEntity);
  const setSelectedEntity = useChatEntitiesStore((state) => state.setSelectedEntity);

  const chatParticipants = groupChatId
  ? participants[groupChatId] || []
  : selectedEntity?.type === "user" && selectedEntity.participants
  ? selectedEntity.participants
  : [];

  const { updateEntity, entities } = useChatEntitiesStore();

  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    content: "",
    confirmLabel: "",
    onConfirm: undefined as (() => void) | undefined,
  });

  const isAdmin = chatParticipants.some(
    (participant) =>
      participant.userId === currentUserId && participant.role === "owner"
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (groupChatId || initialMessages.length > 0) {
      setLoadingMessages(true);
      setMessages(initialMessages);
      setNewMessage("");
      setSelectedFiles([]);
      setLoadingMessages(false);
      scrollToBottom();
    }
  
    return () => {
      setMessages([]); 
    };
  }, [groupChatId, initialMessages]);
  

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (groupChatId && initialMessages.length > 0) {
      if (Array.isArray(participants)) {
        setParticipants(groupChatId, participants);
      }
      updateEntity(groupChatId, { participants: chatParticipants });
    }
  }, [groupChatId]);

  useEffect(() => {
    if (!currentUser || !selectedEntity?.id || selectedEntity?.type !== "group") return;
  
    const pusher = getPusherInstance();
    const groupMessageChannel = pusher?.subscribe(`group-messages-${selectedEntity.id}`);
    const userNotificationChannel = pusher?.subscribe(`user-notifications-new-msg-${currentUser.uid}`);
  
    groupMessageChannel?.bind("new-group-message", (newMessage: BaseMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      scrollToBottom();
  
      if (newMessage.senderId !== currentUser?.uid && selectedEntity?.id !== selectedEntity?.id) {
        toast.success(`New message from ${newMessage.senderName}`);
      }
    });
  
    userNotificationChannel?.bind("new-unread-message", (data: { groupChatId: string; senderName: string; content: string; messageId: string }) => {
      const groupName = entities.find((entity) => entity.id === data.groupChatId)?.name || "a group";
      if (selectedEntity?.id !== data.groupChatId) {
        toast.info(`New message from ${data.senderName} in ${groupName}`);
      }
    });
  
    return () => {
      groupMessageChannel?.unbind_all();
      pusher?.unsubscribe(`group-messages-${selectedEntity.id}`);
      userNotificationChannel?.unbind_all();
      pusher?.unsubscribe(`user-notifications-new-msg-${currentUser.uid}`);
    };
  }, [currentUser?.uid, selectedEntity?.id, selectedEntity?.type]);
    
  const handleSendMessage = async () => {
    if (selectedFiles.length > 0) {
      await handleAddDocuments(selectedFiles, groupChatId || "", newMessage, token);
      setSelectedFiles([]);
      return;
    }
  
    const addMessageToState = (newMessage: Message) => {
      setMessages((prevMessages) => {
        const uniqueMessages = new Map<string, Message>();
  
        // Add existing messages to the Map
        prevMessages.forEach((msg) => uniqueMessages.set(msg.id, msg));
  
        // Add the new message only if it's not already in the Map
        if (!uniqueMessages.has(newMessage.id)) {
          uniqueMessages.set(newMessage.id, newMessage);
        }
        return Array.from(uniqueMessages.values());
      });
  
      scrollToBottom();
    };
  
    if (groupChatId) {
      await sendMessageToGroup(
        groupChatId,
        newMessage,
        token,
        addMessageToState,
        setNewMessage,
        setSendingMessage
      );
    } else if (selectedEntity?.type === "user" && selectedEntity.participants?.length === 1) {
      const directRecipient = selectedEntity;
      await sendDirectMessage(
        directRecipient.id,
        newMessage,
        token,
        addMessageToState,
        setNewMessage,
        setSendingMessage
      );
    } else {
      toast.error("Cannot send a message: No valid group or direct chat identified.");
    }
  };  

  const handleLeaveGroupClick = () => {
    setModalData({
      isOpen: true,
      title: "Leave Group",
      content: "Are you sure you want to leave this group?",
      confirmLabel: "Leave",
      onConfirm: async () => {
        setModalData((prev) => ({ ...prev, isOpen: false }));
  
        try {
          await handleLeaveGroup(groupChatId || "", token);
  
          if (groupChatId) {
            removeParticipant(groupChatId, currentUserId);
            removeEntity(groupChatId);
            setSelectedEntity(null);
          }
        } catch (error) {
          toast.error("An error occurred while leaving the group.");
        }
      },
    });
  };  


  const renderHeaderContent = () => {
    if (selectedEntity?.type === "user") {
      if (selectedEntity.participants && selectedEntity.participants.length === 1) {
        const participant = selectedEntity.participants[0];
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
    } else if (groupChatId && participants[groupChatId]) {
      const chatParticipants = participants[groupChatId];
      if (chatParticipants.length === 1) {
        const participant = chatParticipants[0];
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
      } else if (chatParticipants.length > 1) {
        return (
          <AvatarGroup size="md">
            {chatParticipants.map((participant) => (
              <Tooltip
                key={participant.userId}
                content={`${participant.username}${participant.role === "owner" ? " (Admin)" : ""}`}
              >
                <Avatar
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
  
  
  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };
  

  const groupedMessages = groupMessagesByDate();
  const currentDate = new Date().toLocaleDateString();

  return (
    <>
      <ModalPopup
        isOpen={modalData.isOpen}
        title={modalData.title}
        content={modalData.content}
        confirmLabel={modalData.confirmLabel}
        onConfirm={modalData.onConfirm}
        onCancel={() => setModalData((prev) => ({ ...prev, isOpen: false }))}
        showCancelButton={true}
        confirmColor="danger"
      />
      <ModalAddMemberToGroup
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        groupChatId={groupChatId || ""}
        token={token}
      />

      <ModalRemoveMemberFromGroup
        isOpen={isRemoveMemberModalOpen}
        onClose={() => setIsRemoveMemberModalOpen(false)}
        groupChatId={groupChatId || ""}
        token={token}
      />

      <Card className="h-full border shadow-md">
        <CardHeader className="flex items-center justify-between gap-2">
          {renderHeaderContent()}
          <ChatSettings
            isGroup={!!groupChatId}
            participants={groupChatId ? participants[groupChatId] || [] : []}
            currentUserId={currentUserId}
            onAddUser={() => setIsAddMemberModalOpen(true)}
            onRemoveUser={() => setIsRemoveMemberModalOpen(true)}
            onEditGroup={() => console.log("Edit group clicked")}
            onDeleteGroup={() => console.log("Delete group clicked")}
            onLeaveGroup={() => handleLeaveGroupClick()}
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
                              onClick={() => handleCopyMessage(msg.content)}
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
                        {/* Message content */}
                        {msg.content && <p>{msg.content}</p>}
                        
                        {/* PDF attachments */}
                        {msg.messageType === 'attachment' && msg.attachments && msg.attachments.length > 0 && (
                          <div className="space-y-2 mt-2">
                            {msg.attachments.map((attachment, index) => {
                              if (attachment.toLowerCase().endsWith('.pdf')) {
                                return (
                                  <PDFAttachment
                                    key={`${msg.id}-attachment-${index}`}
                                    url={attachment}
                                  />
                                );
                              }
                              return null;
                            })}
                          </div>
                        )}
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
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex items-center gap-2">
                  <FaFile className="text-gray-500" />
                  <span>Document</span>
                </div>
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

          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                const filesArray = Array.from(e.target.files);
                setSelectedFiles(prev => [...prev, ...filesArray]);
              }
            }}
          />

          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 bg-gray-200 rounded shadow-sm"
                >
                  <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(file)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
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
            isDisabled={sendingMessage || loadingMessages || (!newMessage.trim() && selectedFiles.length === 0)}
          >
            {sendingMessage ? "Sending..." : "Send"}
          </Button>
        </div>

      </Card>
    </>
  );
};

export default GroupMessagesCard;
