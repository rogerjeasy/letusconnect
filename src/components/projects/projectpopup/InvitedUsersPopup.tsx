"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Project, projectRoles } from "@/store/project";

interface InvitedUsersPopupProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onAddParticipant: (emailOrUsername: string, role: string) => void;
}

const InvitedUsersPopup: React.FC<InvitedUsersPopupProps> = ({
  isOpen,
  onClose,
  project,
  onAddParticipant,
}) => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [selectedRole, setSelectedRole] = useState(projectRoles[0]);

  const handleAddParticipant = () => {
    if (emailOrUsername.trim()) {
      onAddParticipant(emailOrUsername, selectedRole);
      setEmailOrUsername("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-center">
          Invited Participants
        </ModalHeader>
        <ModalBody>
          {project.invitedUsers && project.invitedUsers.length > 0 ? (
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {project.invitedUsers.map((user, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="font-semibold">
                    {user.username} ({user.email}) - {user.role}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No invited participants yet.</p>
          )}

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
            <Input
              type="text"
              placeholder="Enter participant's email or username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="sm:flex-grow"
            />
            <Dropdown>
              <DropdownTrigger>
                <Button
                  color="secondary"
                  variant="ghost"
                  className="w-full sm:w-auto max-w-[180px] truncate"
                  size="md"
                >
                  Select Role: {selectedRole}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) => setSelectedRole(key as string)}
                aria-label="Select Role"
              >
                {projectRoles.map((role) => (
                  <DropdownItem key={role}>{role}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="solid" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={handleAddParticipant}>
            Add Participant
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InvitedUsersPopup;