import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Spinner,
} from "@nextui-org/react";
import { FaExclamationCircle, FaSearch, FaTrash } from "react-icons/fa";
import { Participants } from "@/store/project";

interface UsersSelectionProps {
  isOpen: boolean;
  title: string;
  participants: Participants[];
  selectedUsers: Participants[];
  onSelectUser: (user: Participants) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading: boolean;
  buttonLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const UsersSelection: React.FC<UsersSelectionProps> = ({
  isOpen,
  title,
  participants,
  selectedUsers,
  onSelectUser,
  searchTerm,
  setSearchTerm,
  isLoading,
  buttonLabel,
  onConfirm,
  onCancel,
}) => {
  const filteredParticipants = participants.filter(
    (participant) =>
      participant.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onCancel} backdrop="opaque">
      <ModalContent className="max-w-lg h-[70vh]">
        <ModalHeader>
          <h2 className="text-xl font-bold text-center w-full">{title}</h2>
        </ModalHeader>
        <ModalBody className="space-y-4 overflow-y-auto flex-1">
          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center gap-2 bg-blue-100 px-2 py-1 rounded-full shadow-md"
                >
                  <img
                    src={user.profilePicture || user.username.charAt(0).toUpperCase()}
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">{user.username}</span>
                  <button
                    onClick={() => onSelectUser(user)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Search Input */}
          <Input
            placeholder="Search by username or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            startContent={<FaSearch className="text-gray-500" />}
          />

          {/* Participants List */}
          <div className="flex-1 overflow-y-auto border border-gray-300 rounded-lg p-2">
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
                  onClick={() => onSelectUser(user)}
                >
                  <img
                    src={user.profilePicture || user.username.charAt(0).toUpperCase()}
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
        </ModalBody>
        <ModalFooter className="flex justify-end gap-4">
          <Button variant="light" color="danger" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="solid"
            color="primary"
            onClick={onConfirm}
            disabled={selectedUsers.length === 0}
          >
            {buttonLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UsersSelection;