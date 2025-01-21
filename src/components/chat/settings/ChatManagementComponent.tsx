'use client';

import { SVGProps, useState } from 'react';
import { FaPlusCircle, FaUserFriends, FaCog, FaArchive } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserToChatWith } from "@/components/chat/sidebar/UserToChatWith";
import { User } from '@/store/userStore';
import { DirectMessage } from '@/store/message';
import { ModalToCreateGroup } from './CreateGroupDialog';
import { GroupChat } from '@/store/groupChat';
import { Participants } from '@/store/project';
import { createGroupChat } from '@/services/groupchat.service';

const CreateGroupChatIcon = (props: SVGProps<SVGSVGElement>) => (
  <FaPlusCircle className="text-green-500 text-xl pointer-events-none flex-shrink-0" {...props} />
);

const BrowseUsersIcon = (props: SVGProps<SVGSVGElement>) => (
  <FaUserFriends className="text-purple-500 text-xl pointer-events-none flex-shrink-0" {...props} />
);

const ChatSettingsIcon = (props: SVGProps<SVGSVGElement>) => (
  <FaCog className="text-gray-500 text-xl pointer-events-none flex-shrink-0" {...props} />
);

const ArchivedChatsIcon = (props: SVGProps<SVGSVGElement>) => (
  <FaArchive className="text-yellow-500 text-xl pointer-events-none flex-shrink-0" {...props} />
);

interface ChatOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

const ChatOption: React.FC<ChatOptionProps> = ({
  icon,
  title,
  description,
  onClick,
}) => (
  <Button
    variant="ghost"
    className="w-full justify-start hover:bg-accent rounded-lg p-3 transition-colors"
    onClick={onClick}
  >
    <div className="flex items-center space-x-4 w-full">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-grow">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  </Button>
);

interface ChatManagementComponentProps {
    currentUser?: User;
    onNewDirectMessage?: (message: DirectMessage) => void;
    onChatSelect?: (chatId: string, type: 'direct' | 'group') => void;
    onTabChange?: (tab: 'direct' | 'groups') => void;
    onCreateGroup?: (group: GroupChat) => Promise<void>;
  }

const ChatManagementComponent: React.FC<ChatManagementComponentProps> = ({ 
  currentUser,
  onNewDirectMessage,
  onChatSelect,
  onTabChange,
  onCreateGroup
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

    const handleUserSelect = (selectedUser: User) => {
      if (currentUser) {
        const receiverName = selectedUser.username ||
          `${selectedUser.firstName} ${selectedUser.lastName}`.trim() ||
          'Unknown User';
        const senderName = currentUser.username ||
          `${currentUser.firstName} ${currentUser.lastName}`.trim() ||
          'Unknown User';

        const newDirectMessage: DirectMessage = {
          id: `${currentUser.uid}-${selectedUser.uid}`,
          senderId: currentUser.uid,
          senderName: senderName,
          receiverId: selectedUser.uid,
          receiverName: receiverName,
          content: '',
          messageType: 'text',
          attachments: [],
          createdAt: new Date().toISOString(),
          readStatus: false,
        };

        // Handle the new message
        onNewDirectMessage?.(newDirectMessage);
        
        onTabChange?.('direct');
        
        onChatSelect?.(selectedUser.uid, 'direct');
      }
      setIsDialogOpen(false);
    };

    const handleCreateGroupClick = () => {
        setIsDialogOpen(false);
        setTimeout(() => {
          setIsCreateGroupModalOpen(true);
        }, 100);
    };
  
    const handleCreateGroupModalClose = () => {
      setIsCreateGroupModalOpen(false);
    };

    const handleGroupCreated = async (groupData: {
        name: string;
        description: string;
        participants: Participants[];
      }) => {
        if (!currentUser) return;
  
        try {
          const newGroup = await createGroupChat(groupData);
  
          if (onCreateGroup) {
            await onCreateGroup(newGroup);
          }
  
          onTabChange?.('groups');
          onChatSelect?.(newGroup.id, 'group');
        } catch (error) {
          console.error('Error in handleGroupCreated:', error);
        }
      };
    

    return (
      <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FaPlusCircle className="h-5 w-5" />
            <span>Chats</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90%] sm:w-[385px] max-h-[90vh] overflow-y-auto mx-auto">
          <DialogHeader>
            <DialogTitle>Chat Management</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ChatOption
                    icon={<CreateGroupChatIcon />}
                    title="Create a Group Chat"
                    description="Start a new group conversation"
                    onClick={handleCreateGroupClick}
                />
                <UserToChatWith
                  trigger={
                    <ChatOption
                      icon={<BrowseUsersIcon />}
                      title="Browse All Users"
                      description="Find and connect with other users"
                    />
                  }
                  onUserSelect={handleUserSelect}
                  currentUserId={currentUser?.uid}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Additional Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ChatOption
                  icon={<ChatSettingsIcon />}
                  title="Chat Settings"
                  description="Manage your chat settings"
                />
                <ChatOption
                  icon={<ArchivedChatsIcon />}
                  title="Archived Chats"
                  description="View your archived chats"
                />
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <ModalToCreateGroup 
        isOpen={isCreateGroupModalOpen}
        onClose={handleCreateGroupModalClose}
        onGroupCreated={handleGroupCreated}
      />
     </>
    );
};

export default ChatManagementComponent;