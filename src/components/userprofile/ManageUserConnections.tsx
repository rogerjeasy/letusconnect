import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, UserMinus, Clock, Check, X, Users } from "lucide-react";
import { Connection, ConnectionRequest } from "@/store/userConnections";
import {
  handleAcceptRequest,
  handleRejectRequest,
  handleRemoveConnection,
  handleGetConnections,
} from "@/components/apihandling/HandleUserConnections";

interface ManageUserConnectionsProps {
  token: string;
}

const ManageUserConnections: React.FC<ManageUserConnectionsProps> = ({ token }) => {
  const [activeConnections, setActiveConnections] = useState<Record<string, Connection>>({});
  const [pendingRequests, setPendingRequests] = useState<Record<string, ConnectionRequest>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    setIsLoading(true);
    const data = await handleGetConnections(token);
    if (data) {
      setActiveConnections(data.connections);
      setPendingRequests(data.pendingRequests);
    }
    setIsLoading(false);
  };

  const handleAccept = async (fromUID: string) => {
    const success = await handleAcceptRequest(fromUID, token);
    if (success) {
      fetchConnections();
    }
  };

  const handleReject = async (fromUID: string) => {
    const success = await handleRejectRequest(fromUID, token);
    if (success) {
      fetchConnections();
    }
  };

  const handleRemove = async (uid: string) => {
    const success = await handleRemoveConnection(uid, token);
    if (success) {
      fetchConnections();
    }
  };

  const ConnectionCard: React.FC<{ connection: Connection }> = ({ connection }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`/api/placeholder/32/32`} />
              <AvatarFallback>{connection.targetName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-lg font-semibold">{connection.targetName}</h4>
              <p className="text-sm text-gray-500">Connected since {connection.acceptedAt.toString()}</p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <UserMinus className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Connection</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove {connection.targetName} from your connections?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleRemove(connection.targetUid)}>
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );

  const RequestCard: React.FC<{ request: ConnectionRequest }> = ({ request }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`/api/placeholder/32/32`} />
              <AvatarFallback>{request.fromName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-lg font-semibold">{request.fromName}</h4>
              <p className="text-sm text-gray-500">Sent at {request.sentAt.toString()}</p>
              {request.message && (
                <p className="text-sm mt-1 italic">&ldquo;{request.message}&rdquo;</p>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => handleAccept(request.fromUid)} variant="default" size="sm">
              <Check className="h-4 w-4 mr-2" />
              Accept
            </Button>
            <Button onClick={() => handleReject(request.fromUid)} variant="destructive" size="sm">
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Manage Connections</CardTitle>
        <CardDescription>View and manage your network connections</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="connections" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connections">
              <Users className="h-4 w-4 mr-2" />
              Active Connections
              <Badge variant="secondary" className="ml-2">
                {Object.keys(activeConnections).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="requests">
              <Clock className="h-4 w-4 mr-2" />
              Pending Requests
              <Badge variant="secondary" className="ml-2">
                {Object.keys(pendingRequests).length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connections">
            <ScrollArea className="h-[600px] pr-4">
              {Object.values(activeConnections).length > 0 ? (
                Object.values(activeConnections).map((connection) => (
                  <ConnectionCard key={connection.targetUid} connection={connection} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <UserPlus className="h-12 w-12 mx-auto mb-4" />
                  <p>No active connections yet</p>
                  <p className="text-sm">Start connecting with other users to grow your network</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="requests">
            <ScrollArea className="h-[600px] pr-4">
              {Object.values(pendingRequests).length > 0 ? (
                Object.values(pendingRequests).map((request) => (
                  <RequestCard key={request.fromUid} request={request} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <p>No pending requests</p>
                  <p className="text-sm">You will see connection requests here when people want to connect</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ManageUserConnections;