"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from "@/services/users.services";
import { User } from '@/store/userStore';
import Chat from './ChatWebsocket';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Wifi, WifiOff } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWebSocketContext } from '../WebSocketContext';

const ChatInterfaceWebsocket = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { status } = useWebSocketContext();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers
  });

  const filteredUsers = users?.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Left Side - User List */}
      <Card className="w-80 h-full border-r rounded-none">
            <CardHeader className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <CardTitle>Messages</CardTitle>
                        {status === 'Connected' ? (
                            <Wifi className="h-4 w-4 text-green-500" />
                        ) : (
                            <WifiOff className="h-4 w-4 text-red-500" />
                        )}
                </div>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-10rem)]">
            {isLoading ? (
              // Loading skeletons
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              ))
            ) : (
              filteredUsers?.map(user => (
                <Button
                  key={user.uid}
                  variant={selectedUser?.uid === user.uid ? "secondary" : "ghost"}
                  className="w-full justify-start p-4 hover:bg-accent"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={user.profilePicture || ''} alt={user.username || ''} />
                      <AvatarFallback>
                        {getInitials(user.username || user.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-medium">{user.username || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </Button>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Right Side - Chat Area */}
      <div className="flex-1 h-full">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b flex items-center px-6 bg-card">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={selectedUser.profilePicture || ''} alt={selectedUser.username || ''} />
                  <AvatarFallback>
                    {getInitials(selectedUser.username || selectedUser.email || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedUser.username}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
            </div>
            
            {/* Chat Component */}
            <Chat
              receiverId={selectedUser.uid}
              receiverName={selectedUser.username || selectedUser.email || 'Unknown'}
            />
          </>
        ) : (
          // No user selected state
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterfaceWebsocket;