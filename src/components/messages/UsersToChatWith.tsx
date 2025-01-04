"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  Input,
  Avatar,
} from "@nextui-org/react";
import { User } from "@/store/userStore";

interface UsersToChatWithProps {
  users: User[];
  onSelectUser: (user: User) => void;
  onClose: () => void;
}

const UsersToChatWith: React.FC<UsersToChatWithProps> = ({ users, onSelectUser, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  useEffect(() => {
    const results = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const handleUserClick = (user: User) => {
    onSelectUser(user);
    onClose();
  };

  return (
    <Modal isOpen onClose={onClose} className="z-50">
      <ModalContent>
        <ModalHeader>
          <h2 className="text-lg font-bold">All Registered Public Accounts</h2>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col space-y-4">
            <Input
              placeholder="Search by username or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              isClearable
            />
            <div className="space-y-3 overflow-y-auto max-h-96">
              {filteredUsers.map((user) => (
                <div
                  key={user.uid}
                  className="flex items-center gap-3 p-2 hover:bg-blue-100 rounded-lg cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <Avatar src={user.profilePicture} alt={user.username} />
                  <span className="font-medium text-black">{user.username}</span>
                </div>
              ))}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UsersToChatWith;