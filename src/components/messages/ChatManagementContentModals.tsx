"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Button,
  Spinner,
} from "@nextui-org/react";
import { FaExclamationCircle, FaSearch } from "react-icons/fa";
import { api, handleError } from "@/helpers/api";
import { Participants } from "@/store/project";
import { User } from "@/store/userStore";

export const ModalToCreateGroup: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [name, setGroupName] = useState("");
  const [description, setGroupDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Participants[]>([]);
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/api/users");
        
        const fetchedParticipants = response.data.users.map((user: User) => ({
          userId: user.uid,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          role: "Member",
        }));

        setParticipants(fetchedParticipants);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const handleUserSelection = (user: Participants) => {
    setSelectedUsers((prev) =>
      prev.find((selected) => selected.userId === user.userId)
        ? prev.filter((selected) => selected.userId !== user.userId)
        : [...prev, user]
    );
  };

  const handleCreateGroup = async () => {
    const token = localStorage.getItem("token");
    try {
      const groupData = {
        name,
        description,
        participants: selectedUsers,
      };
      const response = await api.post("/api/group-chats", groupData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      alert(response.data.message);
      setGroupName("");
      setGroupDescription("");
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Failed to create group:", errorMessage);
      alert("Failed to create group. " + errorMessage);
    }
  };

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="opaque">
      <ModalContent className="max-w-lg">
        <ModalHeader>
          <h2 className="text-xl font-bold text-center w-full">Create a New Group</h2>
        </ModalHeader>
        <ModalBody className="space-y-6">
          <Input
            label="Group Name"
            placeholder="Enter the name of the group"
            value={name}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
          <Textarea
            label="Group Description"
            placeholder="Enter a short description"
            rows={4}
            value={description}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by username or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                startContent={<FaSearch className="text-gray-500" />}
              />
            </div>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-2">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner size="lg" className="text-blue-500" />
                </div>
              ) : filteredParticipants.length > 0 ? (
                filteredParticipants.map((user) => (
                  <div
                    key={user.userId}
                    className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition ${
                      selectedUsers.find((selected) => selected.userId === user.userId)
                        ? "bg-blue-100"
                        : ""
                    }`}
                    onClick={() => handleUserSelection(user)}
                  >
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    {selectedUsers.find((selected) => selected.userId === user.userId) && (
                      <span className="text-blue-500 font-medium">Selected</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col justify-center items-center h-full">
                  <FaExclamationCircle className="text-red-500 text-3xl mb-2" />
                  <p className="text-gray-500">No results found for your search.</p>
                </div>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-4">
          <Button variant="light" color="danger" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="solid"
            color="primary"
            onClick={handleCreateGroup}
            disabled={!name}
          >
            Create Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const BrowseAllUsers: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Browse All Users</h2>
      {/* Add implementation for browsing users */}
    </div>
  );
};

const ChatManagementContentModal: React.FC = () => {
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsCreateGroupOpen(true)}>Open Create Group Modal</Button>

      <ModalToCreateGroup
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
      />
    </div>
  );
};

export default ChatManagementContentModal;