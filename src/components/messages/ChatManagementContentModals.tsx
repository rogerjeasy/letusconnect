"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { FaExclamationCircle, FaSearch, FaTrash } from "react-icons/fa";
import { api, handleError } from "@/helpers/api";
import { Participants } from "@/store/project";
import { User, useUserStore } from "@/store/userStore";
import { fetchUsersForGroup } from "./HandleParticipants";
import { toast } from "react-toastify";
import UsersSelection from "./UsersSelection";
import { handleAddParticipants, handleRemoveParticipantsFromGroup } from "./HandleGroupActions";
import { useParticipantsStore } from "@/store/participantsStore";
import { useChatEntitiesStore } from "@/store/chatEntitiesStore";

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
  const currentUser = useUserStore((state) => state.user);
  const { addEntity } = useChatEntitiesStore();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/api/users");
        
        const fetchedParticipants = response.data.users
        .filter((user: User) => user.uid !== currentUser?.uid)
        .map((user: User) => ({
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
  }, [isOpen, currentUser]);

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
      const groupChatId = response.data.groupChatId;
      addEntity({
        id: groupChatId,
        name,
        avatar: "",
        type: "group",
        directMessages: [],
        groupMessages: [],
        participants: selectedUsers,
      });
      toast.success(response.data.message || "Group created successfully.");
      setGroupName("");
      setGroupDescription("");
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      const errorMessage = handleError(error);
      toast.error("Failed to create group: " + errorMessage);      
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

export const ModalAddMemberToGroup: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  groupChatId: string;
  token: string;
}> = ({ isOpen, onClose, groupChatId, token }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Participants[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addParticipant } = useParticipantsStore();
  const [allUsers, setAllUsers] = useState<Participants[]>([]);

  const currentParticipants = useParticipantsStore(
    (state) => state.participants[groupChatId] || []
  );
  
  // Filter out users already in the group
  const participantsList = useMemo(() => {
    return allUsers.filter(
      (user) => !currentParticipants.some((participant) => participant.userId === user.userId)
    );
  }, [allUsers, currentParticipants]);


  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const users = await fetchUsersForGroup();
        setAllUsers(users);
      } catch (error) {
        const errorMessage = handleError(error);
        toast.error("Failed to fetch users: " + errorMessage);
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

  const handleConfirm = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one participant.");
      return;
    }
  
    try {
      await handleAddParticipants(groupChatId, selectedUsers, token);
        selectedUsers.forEach(user => {
        addParticipant(groupChatId, user);
      });
  
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      const errorMessage = handleError(error);
      // toast.error(errorMessage || "An error occurred while adding participants.");
    }
  };

  return (
    <UsersSelection
      isOpen={isOpen}
      title="Add Members to Group"
      participants={participantsList}
      selectedUsers={selectedUsers}
      onSelectUser={handleUserSelection}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      isLoading={isLoading}
      buttonLabel={`Add Selected Participant${selectedUsers.length > 1 ? "s" : ""}`}
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  );
};

interface ModalRemoveMemberFromGroupProps {
  isOpen: boolean;
  onClose: () => void;
  groupChatId: string;
  token: string;
}

export const ModalRemoveMemberFromGroup: React.FC<ModalRemoveMemberFromGroupProps> = ({
  isOpen,
  onClose,
  groupChatId,
  token,
}) => {
  const participants = useMemo(
    () => useParticipantsStore.getState().participants[groupChatId] || [],
    [groupChatId]
  );

  const currentUserId = useUserStore((state) => state.user?.uid || "");

  // Create a new list excluding the current user
  const participantsNewList = useMemo(
    () => participants.filter((participant) => participant.userId !== currentUserId),
    [participants, currentUserId]
  );

  const [selectedUsers, setSelectedUsers] = useState<Participants[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { removeParticipant } = useParticipantsStore();

  const handleUserSelection = (user: Participants) => {
    setSelectedUsers((prev) =>
      prev.find((selected) => selected.userId === user.userId)
        ? prev.filter((selected) => selected.userId !== user.userId)
        : [...prev, user]
    );
  };

  const handleConfirm = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one participant.");
      return;
    }

    setIsLoading(true);
    try {
      const participantIds = selectedUsers.map((user) => user.userId);
      await handleRemoveParticipantsFromGroup(groupChatId, participantIds, token);

      selectedUsers.forEach((user) => removeParticipant(groupChatId, user.userId));
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      const errorMessage = handleError(error);
      toast.error(errorMessage || "An error occurred while removing participants.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UsersSelection
      isOpen={isOpen}
      title="Remove Members from Group"
      participants={participantsNewList}
      selectedUsers={selectedUsers}
      onSelectUser={handleUserSelection}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      isLoading={isLoading}
      buttonLabel={`Remove Selected Participant${selectedUsers.length > 1 ? "s" : ""}`}
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
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