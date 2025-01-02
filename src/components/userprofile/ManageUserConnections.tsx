import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, UserMinus, Clock, Check, X, Users, SendHorizontal } from "lucide-react";
import { Connection, ConnectionRequest, SentRequest } from "@/store/userConnections";
import { acceptConnectionRequest, cancelSentRequest, getUserConnections, rejectConnectionRequest, removeConnection } from '@/services/connection.service';
import { toast } from 'react-toastify';
import { getAllUsers } from '@/services/users.services';
import { User } from '@/store/userStore';

interface ManageUserConnectionsProps {
  token: string;
}

const ManageUserConnections: React.FC<ManageUserConnectionsProps> = ({ token }) => {
  const [activeConnections, setActiveConnections] = useState<Record<string, Connection>>({});
  const [pendingRequests, setPendingRequests] = useState<Record<string, ConnectionRequest>>({});
  const [sentRequests, setSentRequests] = useState<Record<string, SentRequest>>({});
  const [users, setUsers] = useState<Record<string, User>>({});
  const [activeTab, setActiveTab] = useState("connections");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [connectionsData, usersData] = await Promise.all([
        getUserConnections(),
        getAllUsers()
      ]);

      // Convert users array to a lookup object
      const usersLookup = usersData.reduce((acc: Record<string, User>, user: User) => {
        acc[user.uid] = user;
        return acc;
      }, {});

      setUsers(usersLookup);
      setActiveConnections(connectionsData.connections);
      setPendingRequests(connectionsData.pendingRequests);
      setSentRequests(connectionsData.sentRequests);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (fromUID: string) => {
    await acceptConnectionRequest(fromUID);
    fetchData();
  };

  const handleReject = async (fromUID: string) => {
    await rejectConnectionRequest(fromUID);
    fetchData();
  };

  const handleRemove = async (uid: string) => {
    await removeConnection(uid);
    fetchData();
  };

  const handleCancelRequest = async (toUID: string) => {
    setIsLoading(true);
    try {
      await cancelSentRequest(toUID);
      await fetchData();
      toast.success("Connection request cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel connection request");
    } finally {
      setIsLoading(false);
    }
  };

  const ConnectionCard: React.FC<{ connection: Connection }> = ({ connection }) => {
    const user = users[connection.targetUid];
    if (!user) return null;

    return (
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.profilePicture} alt={user.username} />
                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-lg font-semibold">{user.username}</h4>
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
                    Are you sure you want to remove {user.username} from your connections?
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
  };

  const SentRequestCard: React.FC<{ request: SentRequest }> = ({ request }) => {
    const user = users[request.toUid];
    if (!user) return null;

    return (
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.profilePicture} alt={user.username} />
                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-lg font-semibold">Request to {user.username}</h4>
                <p className="text-sm text-gray-500">Sent at {request.sentAt.toString()}</p>
                {request.message && (
                  <p className="text-sm mt-1 italic">&ldquo;{request.message}&rdquo;</p>
                )}
                <Badge variant="secondary" className="mt-2">
                  {request.status}
                </Badge>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel Request
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Connection Request</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this connection request to {user.username}?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Request</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleCancelRequest(request.toUid)}>
                    Cancel Request
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    );
  };

  const RequestCard: React.FC<{ request: ConnectionRequest }> = ({ request }) => {
    const user = users[request.fromUid];
    if (!user) return null;

    return (
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.profilePicture} alt={user.username} />
                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-lg font-semibold">{user.username}</h4>
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject Connection Request</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reject the connection request from {user.username}?
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Request</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleReject(request.fromUid)}>
                      Reject Request
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Manage Connections</CardTitle>
        <CardDescription>View and manage your network connections</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Navigation Card */}
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Active Connections */}
                <div 
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${activeTab === "connections" ? 'bg-green-100 hover:bg-green-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab("connections")}
                >
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Active Connections</span>
                  </div>
                  <Badge variant="secondary">
                    {Object.keys(activeConnections).length}
                  </Badge>
                </div>

                {/* Pending Requests */}
                <div 
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${activeTab === "requests" ? 'bg-green-100 hover:bg-green-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab("requests")}
                >
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Pending Requests</span>
                  </div>
                  <Badge variant="secondary">
                    {Object.keys(pendingRequests).length}
                  </Badge>
                </div>

                {/* Sent Requests */}
                <div 
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${activeTab === "sent" ? 'bg-green-100 hover:bg-green-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab("sent")}
                >
                  <div className="flex items-center">
                    <SendHorizontal className="h-4 w-4 mr-2" />
                    <span>Requests Sent</span>
                  </div>
                  <Badge variant="secondary">
                    {Object.keys(sentRequests).length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Card */}
          <Card>
            <CardContent className="p-4">
              <TabsContent value="connections" className="mt-4">
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

              <TabsContent value="requests" className="mt-4">
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

              <TabsContent value="sent" className="mt-4">
                <ScrollArea className="h-[600px] pr-4">
                  {Object.values(sentRequests).length > 0 ? (
                    Object.values(sentRequests).map((request) => (
                      <SentRequestCard key={request.toUid} request={request} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <SendHorizontal className="h-12 w-12 mx-auto mb-4" />
                      <p>No sent requests</p>
                      <p className="text-sm">You have not sent any connection requests yet</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ManageUserConnections;