"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, useUserStore } from "@/store/userStore";
import { useParams, useRouter } from "next/navigation";
import { handleError } from "@/helpers/api";
import { Connection, ConnectionRequest, ConnectionRequestResponse, SentRequest } from "@/store/userConnections";
import { AlertCircle, Clock, UserCheck, UserCircle, UserPlus } from "lucide-react";
import { getConnectionRequests } from "@/services/connection.service";
import { getUserByUid } from "@/services/users.services";
import { Alert, AlertDescription } from "../ui/alert";
import  CustomizedTooltip from "@/components/forms/CustomizedTooltip"
import UserWithNoConnectionsPage from "./UserWithNoConnections";
import SendRequestComponent from "./SendRequestComponent";

interface ConnectionState {
  connections: Record<string, Connection>;
  users: Map<string, User>;
  loading: boolean;
  error: string | null;
  sentRequest?: Record<string, SentRequest>;
  pendingRequest?: Record<string, ConnectionRequest>;
}

const UserConnectionComponents = () => {
  const params = useParams();
  const uid = Array.isArray(params.userId) ? params.userId[0] : params.userId;
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedTargetUid, setSelectedTargetUid] = useState<string>("");
  const currentLoggedInUser = useUserStore((state) => state.user);
  const [pendingRequestIDs, setPendingRequestIDs] = useState<string[]>([]);
  const [sentRequestIDs, setSentRequestIDs] = useState<string[]>([]);
  const [connectionsIDs, setConnectionsIDs] = useState<string[]>([]);
  const [state, setState] = useState<ConnectionState>({
    connections: {},
    users: new Map(),
    loading: true, 
    error: null,
    sentRequest: {},
    pendingRequest: {}
  });

  const fetchCurrentUser = useCallback(async () => {
    if (!uid) return;
    try {
      const user = await getUserByUid(uid);
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  }, [uid]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const fetchMyConnections = useCallback(async () => {
    const myUid = currentLoggedInUser?.uid;
    if (!myUid) return;
    try {
      const response = await getConnectionRequests(myUid);
      const userConnections: ConnectionRequestResponse = response;

      const connectionKeys = Object.keys(userConnections.connections);
      setConnectionsIDs(connectionKeys);
      const pendingRequestKeys = Object.keys(userConnections.pendingRequests);
      setPendingRequestIDs(pendingRequestKeys);
      const sentRequestKeys = Object.keys(userConnections.sentRequests);
      setSentRequestIDs(sentRequestKeys);

    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch connections'
      }));
      handleError(error);
    }
  }, [uid]);

  useEffect(() => {
    if (!currentLoggedInUser?.uid) {
      return;
    }
    fetchMyConnections();
  }, [currentLoggedInUser?.uid, fetchMyConnections]);

  const fetchConnectionUsers = useCallback(async (connections: Record<string, Connection>) => {
    const userIds = Object.values(connections).map(conn => conn.targetUid);
    const userMap = new Map<string, User>();
    
    try {
      const userPromises = userIds.map(async (targetUid) => {
        if (targetUid === uid) return;
        
        try {
          const response = await getUserByUid(targetUid);
          userMap.set(targetUid, response);
        } catch (error) {
          console.error(`Failed to fetch user ${targetUid}:`, error);
        }
      });

      await Promise.all(userPromises);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    
    return userMap;
  }, [uid]);

  const fetchConnections = useCallback(async () => {
    if (!uid) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      if (!uid) return;
      const response = await getConnectionRequests(uid);
      const userConnections: ConnectionRequestResponse = response;
      const userMap = await fetchConnectionUsers(userConnections.connections);
      
      setState({
        connections: userConnections.connections,
        users: userMap,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch connections'
      }));
      handleError(error);
    }
  }, [uid, fetchConnectionUsers]);

  useEffect(() => {
    if (!uid) {
      setState(prev => ({ ...prev, loading: false, error: 'No user ID provided' }));
      return;
    }
    
    fetchConnections();
  }, [uid, fetchConnections]);

  // Check if user is already connected
  const isConnected = useCallback((targetUid: string) => {
    if (!currentLoggedInUser) return false;
    
    return connectionsIDs.includes(targetUid);

  }, [connectionsIDs, currentLoggedInUser]);

  const isPendingRequest = useCallback((targetUid: string) => {
    if (!currentLoggedInUser) return false;
    
    return pendingRequestIDs.includes(targetUid);
  }, [pendingRequestIDs, currentLoggedInUser]);
  
  const isSentRequest = useCallback((targetUid: string) => {
    if (!currentLoggedInUser) return false;
    
    return sentRequestIDs.includes(targetUid);
  }, [sentRequestIDs, currentLoggedInUser]);

  const handleConnectClick = (targetUid: string) => {
    setSelectedTargetUid(targetUid);
    setIsConnectModalOpen(true);
  };

  const handleRequestComplete = async () => {
    await Promise.all([
      fetchConnections(),
      fetchMyConnections()
    ]);
  };

  const handleRequestSent = (request: SentRequest) => {
    setState(prev => ({
      ...prev,
      sentRequest: {
        ...prev.sentRequest,
        [request.toUid]: request
      }
    }));
    setSentRequestIDs(prev => [...prev, request.toUid]);
  };

  // Replace the Connect button in the card with this:
  const renderConnectionButton = (connection: Connection) => {
    const targetUid = connection.targetUid;
    const targetUsername = connection.targetName;

    if (!currentLoggedInUser) {
      return (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleConnectClick(targetUid)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Connect
          </Button>
          <SendRequestComponent
            isOpen={isConnectModalOpen && selectedTargetUid === targetUid}
            onOpenChange={setIsConnectModalOpen}
            targetUid={targetUid}
            targetUsername={targetUsername}
            onRequestSent={handleRequestSent}
            onRequestComplete={handleRequestComplete}
          />
        </>
      );
    }

    if (isConnected(targetUid)) {
      return (
        <CustomizedTooltip
          tooltipContent="You are already connected"
          buttonColor="success"
          buttonText={
            <>
              <UserCheck className="h-4 w-4 mr-2" />
              <span>Connected</span>
            </>
          }
          placement="top"
        />
      );
    }

    if (isSentRequest(targetUid)) {
      return (
        <CustomizedTooltip
          tooltipContent="You Sent a Request to Connect, Waiting for Approval"
          buttonColor="danger"
          buttonText={
            <>
              <Clock className="h-4 w-4 mr-2 animate-pulse" />
              <span>Request Sent</span>
            </>
          }
          placement="top"
          // isDisabled
        />
      );
    }

    if (currentLoggedInUser.uid === targetUid) {
      return (
        <CustomizedTooltip
          tooltipContent="You cannot connect with yourself"
          buttonColor="default"
          buttonText="Connect"
          placement="top"
          // isDisabled
        />
      );
    }

    if (isPendingRequest(targetUid)) {
      return (
        <CustomizedTooltip
          tooltipContent="Request to Connect Received. Click to manage."
          buttonColor="warning"
          buttonText={
            <>
              <Clock className="h-4 w-4 mr-2 animate-pulse" />
              <span>Request to Connect</span>
            </>
          }
          placement="top"
          onClick={() => router.push("/connections")}
        />
      );
    }

    return (
      <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleConnectClick(targetUid)}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Connect
      </Button>
      <SendRequestComponent
        isOpen={isConnectModalOpen && selectedTargetUid === targetUid}
        onOpenChange={setIsConnectModalOpen}
        targetUid={targetUid}
        targetUsername={targetUsername}
        onRequestSent={handleRequestSent}
        onRequestComplete={handleRequestComplete}
      />
    </>
    );
  };

  // Check loading state first
  if (state.loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Then check for errors
  if (state.error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchConnections}
            className="mt-2"
          >
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  // Finally check for empty connections after loading is complete and there are no errors
  if (!state.loading && !state.error && Object.keys(state.connections).length === 0) {
    return (
      <UserWithNoConnectionsPage 
        user={currentUser}
        onRequestComplete={() => {
          fetchConnections();
        }}
/>
    );
  }

  const connectionCount = Object.keys(state.connections).length;

  return (
    <>
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-none shadow-md">
        <CardHeader>
          <div className="flex items-center justify-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              <AvatarImage src={currentUser?.profilePicture} />
              <AvatarFallback className="bg-primary/5 text-primary">
                {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle className="text-xl">{currentUser?.username}</CardTitle>
              <CardDescription>
                has {connectionCount} {connectionCount === 1 ? 'connection' : 'connections'} in their network
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70vh] pr-4">
            <div className="flex flex-col space-y-4">
              {Object.entries(state.connections).map(([connectionId, connection]) => {
                const connectedUser = state.users.get(connection.targetUid);
                
                if (!connectedUser) return null;

                return (
                  <Card 
                    key={connectionId} 
                    className="group hover:shadow-lg transition-all duration-300 border border-muted hover:border-primary/20 w-full"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-14 w-14 border-2 border-primary/10">
                            <AvatarImage src={connectedUser.profilePicture} />
                            <AvatarFallback className="bg-primary/5 text-primary">
                              {connectedUser.firstName?.[0]}{connectedUser.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {connection.targetName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {connectedUser.currentJobTitle}
                            </p>
                            <p className="text-sm text-muted-foreground hidden group-hover:block">
                              Connected since {new Date(connection.acceptedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      
                        <div className="flex flex-col items-end gap-2">
                          <p className="text-sm text-muted-foreground group-hover:hidden">
                            Connected since {new Date(connection.acceptedAt).toLocaleDateString()}
                          </p>
                          <div className="hidden group-hover:flex flex-row lg:flex-row flex-col gap-2">
                            {renderConnectionButton(connection)}
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => router.push(`/profile/${connection.targetUid}`)}
                            >
                              <UserCircle className="h-4 w-4 mr-2" />
                              Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default UserConnectionComponents;