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
import { FaCog, FaTimes } from "react-icons/fa";
import { fetchGroupChatDetails } from "@/utils/groupChatUtils";
import GroupMessagesCard from "./GroupMessagesCard";
import ParticipantsCard from "./ParticipantsCard";


interface ModalGroupChatProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string; 
  token: string;
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
  const [groupChatId, setGroupChatId] = useState("");

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
              />
            </div>
          </CardBody>
        </Card>
      </ModalContent>
    </Modal>
  );
};

export default ModalGroupChat;
