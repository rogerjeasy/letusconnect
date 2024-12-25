"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  Button,
  Card,
  CardHeader,
  CardBody,
  Tooltip,
} from "@nextui-org/react";
import { BaseMessage } from "@/store/groupChat";
import { Participants } from "@/store/project";
import { FaCog, FaTimes } from "react-icons/fa";
import { fetchGroupChatDetails } from "@/utils/groupChatUtils";
import GroupMessagesCard from "./GroupMessagesCard";
import ParticipantsCard from "./ParticipantsCard";
import ChatManagement from "./ChatManagement";

interface ModalGroupChatProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string; 
  token: string;
  pinnedMessageIDs?: string[];
}

const ModalGroupChat: React.FC<ModalGroupChatProps> = ({
  isOpen,
  onClose,
  groupId,
  token,
  pinnedMessageIDs = [],
}) => {
  const [messages, setMessages] = useState<BaseMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [groupName, setGroupName] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [groupChatId, setGroupChatId] = useState("");
  const [isChatManagementOpen, setIsChatManagementOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchGroupChatDetails(
        groupId,
        token,
        setGroupChatId,
        setMessages,
        setParticipants,
        setGroupName,
        setLoadingMessages
      );
    }
  }, [isOpen, groupId, token]);

  return (
    <>
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      backdrop="opaque" 
      closeButton={false}
      className="max-w-[98vw]"
    >
      <ModalContent className="w-[80vw] h-[75vh] max-w-[98vw]">
        <Card className="w-full h-full">
            <CardHeader className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-cyan-50 to-blue-50 p-6 rounded-t-lg relative">
                <div className="absolute top-4 left-4">
                <div className="flex items-center bg-green-500 hover:bg-green-600 rounded-full transition-colors">
                    <ChatManagement />
                </div>
                </div>

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
            {/* Participants Section */}
            <div className="w-1/4 h-full">
              <ParticipantsCard participants={participants} />
            </div>

            {/* Reusable Messages Section */}
            <div className="w-3/4 h-full">
              <GroupMessagesCard
                groupChatId={groupChatId}
                token={token}
                initialMessages={messages}
                participants={participants}
                pinnedMessages={pinnedMessageIDs}
              />
            </div>
          </CardBody>
        </Card>
      </ModalContent>
    </Modal>
    {/* Chat Management Modal */}
    <Modal
        isOpen={isChatManagementOpen}
        onClose={() => setIsChatManagementOpen(false)}
        backdrop="opaque"
        className="max-w-[90vw]"
      >
        <ModalContent>
          <ChatManagement />
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalGroupChat;
