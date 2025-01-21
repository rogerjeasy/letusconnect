"use client";

import React, { useEffect, useState } from "react";
import { FaExclamationCircle, FaSearch } from "react-icons/fa";
import { api, handleError } from "@/helpers/api";
import { Participants } from "@/store/project";
import { User, useUserStore } from "@/store/userStore";
import { toast } from "react-toastify";
import { useChatEntitiesStore } from "@/store/chatEntitiesStore";
import { getAllUsers } from "@/services/users.services";
import { API_CONFIG } from "@/config/api.config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ModalToCreateGroupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalToCreateGroup: React.FC<ModalToCreateGroupProps> = ({
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

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await getAllUsers();
        
        const fetchedParticipants = response
          .filter((user: User) => user.uid !== currentUser?.uid)
          .map((user: User) => ({
            userId: user.uid,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture || user.username.charAt(0).toUpperCase(),
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
    try {
      const groupData = {
        name,
        description,
        participants: selectedUsers,
      };
      const response = await api.post(API_CONFIG.ENDPOINTS.GROUP_CHATS.BASE, groupData);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[90vh] w-[90vw]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Create a New Group
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter the name of the group"
              value={name}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Enter a short description"
              value={description}
              onChange={(e) => setGroupDescription(e.target.value)}
              className="w-full min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search by username or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                {selectedUsers.map((user) => (
                  <div
                    key={user.userId}
                    className="flex items-center gap-2 bg-accent/50 px-3 py-1 rounded-full"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.profilePicture} />
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.username}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserSelection(user);
                      }}
                      className="hover:text-destructive"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredParticipants.length > 0 ? (
                <div className="space-y-2">
                  {filteredParticipants.map((user) => {
                    const isSelected = selectedUsers.some(
                      (selected) => selected.userId === user.userId
                    );
                    return (
                      <div
                        key={user.userId}
                        onClick={() => handleUserSelection(user)}
                        className={cn(
                          "flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          isSelected && "bg-accent/50"
                        )}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.profilePicture} />
                          <AvatarFallback>
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{user.username}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="text-sm font-medium text-primary">
                            Selected
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <FaExclamationCircle className="h-8 w-8 mb-2" />
                  <p>No results found for your search.</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateGroup}
            disabled={!name || selectedUsers.length === 0}
          >
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};