"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Divider,
} from "@nextui-org/react";
import { GroupChat, BaseMessage } from "@/store/groupChat";
import { api, handleError } from "@/helpers/api";

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
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const response = await api.get(`/api/group-chats/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const groupChat: GroupChat = response.data.data;
      setMessages(groupChat.messages || []);
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
      const response = await api.post(
        `/api/group-chats/${groupId}/messages`,
        { content: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    if (isOpen) fetchMessages();
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="opaque"
      closeButton
    >
      <ModalContent>
        <>
          <ModalHeader>
            <h2 className="text-lg font-semibold">Group Chat</h2>
          </ModalHeader>
          <ModalBody>
            {loadingMessages ? (
              <p>Loading messages...</p>
            ) : messages.length > 0 ? (
              <div className="overflow-y-auto max-h-80">
                {messages.map((message: BaseMessage) => (
                  <div
                    key={message.id}
                    className="mb-4 p-2 border-b border-gray-300"
                  >
                    <p>
                      <strong>{message.senderName}</strong>: {message.content}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No messages available.</p>
            )}
          </ModalBody>
          <Divider />
          <ModalFooter>
            <div className="flex flex-col w-full">
              <Input
                placeholder="Type a message..."
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                isDisabled={sendingMessage}
              />
              <Button
                className="mt-2"
                color="primary"
                onClick={sendMessage}
                isDisabled={sendingMessage || !newMessage.trim()}
              >
                {sendingMessage ? "Sending..." : "Send"}
              </Button>
            </div>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default ModalGroupChat;