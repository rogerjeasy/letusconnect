"use client";
import React, { useState, useEffect } from 'react';
import { X, Check, ChevronsUpDown } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Avatar,
  Chip,
  Card,
  CardBody,
  ScrollShadow,
  Listbox,
  ListboxItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";

import { Project } from "@/store/project";
import { User } from "@/store/userStore";
import { getAllUsers } from '@/services/users.services';

const projectRoles = ["Owner", "Admin", "Member", "Viewer"] as const;
type ProjectRole = typeof projectRoles[number];

interface InvitedUsersPopupProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onAddParticipant: (users: Array<{ emailOrUsername: string; role: string }>) => Promise<{ success: boolean; message: string }>;
}

const InvitedUsersPopup: React.FC<InvitedUsersPopupProps> = ({
  isOpen,
  onClose,
  project,
  onAddParticipant,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<Array<{ emailOrUsername: string; role: ProjectRole }>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  const invitedUsers = React.useMemo(() => {
    if (!project || !Array.isArray(project.invitedUsers)) {
      return [];
    }
    return project.invitedUsers;
  }, [project]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isOpen) {
        setIsFullyLoaded(false);
        setUsers([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      setIsFullyLoaded(false);
      
      try {
        const response = await getAllUsers();
        const safeResponse = Array.isArray(response) ? response : [];
        setUsers(safeResponse);
        setIsFullyLoaded(true);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users. Please try again.');
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen]);

  const filteredUsers = React.useMemo(() => {
    if (!isFullyLoaded || isLoading || !Array.isArray(users)) {
      return [];
    }
    
    return users.filter(user => {
      if (!user || typeof user !== 'object') return false;
      
      const username = user?.username || '';
      const email = user?.email || '';
      
      if (!username && !email) return false;
      
      const searchMatch = username.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
                         email.toLowerCase().includes((searchTerm || '').toLowerCase());
                         
      const notSelected = !selectedUsers.some(selected => 
        selected.emailOrUsername === email || 
        selected.emailOrUsername === username
      );
      
      return searchMatch && notSelected;
    });
  }, [users, searchTerm, selectedUsers, isFullyLoaded, isLoading]);

  const handleUserSelect = (user: User) => {
    if (!user.email && !user.username) return;
    setSelectedUsers(prev => [...prev, { 
      emailOrUsername: user.email || user.username || '', 
      role: projectRoles[0] 
    }]);
  };

  const handleUserRemove = (emailOrUsername: string) => {
    setSelectedUsers(prev => prev.filter(selected => 
      selected.emailOrUsername !== emailOrUsername
    ));
  };

  const handleRoleChange = (emailOrUsername: string, newRole: ProjectRole) => {
    setSelectedUsers(prev => prev.map(selected => 
      selected.emailOrUsername === emailOrUsername 
        ? { ...selected, role: newRole } 
        : selected
    ));
  };

  const handleSave = async () => {
    if (!Array.isArray(selectedUsers) || selectedUsers.length === 0) return;
    
    try {
      const result = await onAddParticipant(selectedUsers);
      if (result.success) {
        setSelectedUsers([]);
        onClose();
      }
    } catch (error) {
      console.error('Error adding participants:', error);
      setError('Failed to add participants. Please try again.');
    }
  };

  const handleDialogClose = () => {
    setSelectedUsers([]);
    setSearchTerm("");
    setError(null);
    onClose();
  };

  const LoadingState = () => (
    <div className="flex flex-col gap-3 p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-default-200" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-24 rounded bg-default-200" />
            <div className="h-3 w-32 rounded bg-default-200" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleDialogClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-lg font-semibold">Invite Users</h3>
        </ModalHeader>
        
        <ModalBody>
          {error && (
            <Card className="bg-danger-50 border-danger-200">
              <CardBody>
                <p className="text-danger">{error}</p>
              </CardBody>
            </Card>
          )}

          {/* Current Participants Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Current Participants</h4>
            <ScrollShadow className="h-28">
              {invitedUsers.length > 0 ? (
                <div className="space-y-2">
                  {invitedUsers.map((user, index) => (
                    <Card key={index} className="bg-default-100">
                      <CardBody className="py-2">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={user?.profilePicture}
                            name={(user?.username || '').slice(0, 2).toUpperCase()}
                            size="sm"
                          />
                          <div>
                            <p className="font-medium">{user?.username || 'Unnamed User'}</p>
                            <p className="text-sm text-default-500">{user?.email || 'No email'}</p>
                          </div>
                          <Chip size="sm" variant="flat">{user?.role || 'No role'}</Chip>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-default-500 p-2">No participants yet.</p>
              )}
            </ScrollShadow>
          </div>

          {/* Selected Users Section */}
          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Users</h4>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map(({ emailOrUsername, role }) => {
                  const user = users.find(u => 
                    u?.email === emailOrUsername || 
                    u?.username === emailOrUsername
                  );
                  
                  return (
                    <Card key={emailOrUsername} className="bg-default-100">
                      <CardBody className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={user?.profilePicture}
                            name={(emailOrUsername || '').slice(0, 2).toUpperCase()}
                            size="sm"
                          />
                          <span className="text-sm font-medium">
                            {user?.username || emailOrUsername}
                          </span>
                          <Popover placement="bottom">
                            <PopoverTrigger>
                              <Button
                                variant="light"
                                size="sm"
                                className="min-w-[80px]"
                                endContent={<ChevronsUpDown className="h-4 w-4" />}
                              >
                                {role}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Listbox
                                aria-label="Select role"
                                onAction={(key) => handleRoleChange(emailOrUsername, key as ProjectRole)}
                                selectedKeys={[role]}
                              >
                                {projectRoles.map((roleOption) => (
                                  <ListboxItem key={roleOption} className="gap-2">
                                    {roleOption}
                                    {role === roleOption && <Check className="ml-auto h-4 w-4" />}
                                  </ListboxItem>
                                ))}
                              </Listbox>
                            </PopoverContent>
                          </Popover>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onClick={() => handleUserRemove(emailOrUsername)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Users Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Add Users</h4>
            <div className="border rounded-lg">
              <Input
                placeholder={isLoading ? "Loading users..." : "Search users..."}
                value={searchTerm}
                onValueChange={setSearchTerm}
                isDisabled={isLoading || !isFullyLoaded}
                className="mb-1"
                size="sm"
              />
              <ScrollShadow className="h-48">
                {isLoading ? (
                  <LoadingState />
                ) : !isFullyLoaded ? (
                  <div className="flex items-center justify-center py-4">
                    <p className="text-sm text-default-500">Loading user data...</p>
                  </div>
                ) : error ? (
                  <p className="text-danger p-4">{error}</p>
                ) : filteredUsers.length === 0 ? (
                  <p className="text-sm text-default-500 p-4">
                    {searchTerm ? "No users found" : "Start typing to search users"}
                  </p>
                ) : (
                  <Listbox
                    aria-label="User selection"
                    items={filteredUsers}
                    onAction={(key) => {
                      const user = users.find(u => u.uid === key || u.email === key || u.username === key);
                      if (user) handleUserSelect(user);
                    }}
                  >
                    {(user) => (
                      <ListboxItem
                        key={user?.uid || Math.random().toString()}
                        className="py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={user?.profilePicture}
                            name={(user?.username || '').slice(0, 2).toUpperCase()}
                            size="sm"
                          />
                          <div>
                            <p className="font-medium">{user?.username || 'Unnamed User'}</p>
                            <p className="text-sm text-default-500">{user?.email || 'No email'}</p>
                          </div>
                        </div>
                      </ListboxItem>
                    )}
                  </Listbox>
                )}
              </ScrollShadow>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            color="danger"
            onPress={handleDialogClose}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSave}
            isDisabled={!Array.isArray(selectedUsers) || selectedUsers.length === 0 || isLoading}
          >
            Add Participants
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InvitedUsersPopup;