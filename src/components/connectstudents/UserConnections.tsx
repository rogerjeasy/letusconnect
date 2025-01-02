"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/store/userStore";
import { useParams, useRouter } from "next/navigation";
import { api, handleError } from "@/helpers/api";
import NoConnectionsPage from "./NoConectionsComponent";
import { Connection, UserConnections } from "@/store/userConnections";
import { UsersRound, MessageCircle, UserRoundX, ExternalLink } from "lucide-react";

const UserConnectionComponents = () => {
  const { userId } = useParams();
  const [connections, setConnections] = useState<Record<string, Connection>>({});
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchConnections = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/api/connections/${userId}`);
        const userConnections: UserConnections = response.data;
        setConnections(userConnections.connections);
        await fetchConnectionUsers(userConnections.connections);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchConnectionUsers = async (connections: Record<string, Connection>) => {
      const userIds = Object.values(connections).map(conn => conn.targetUid);
      const userMap = new Map<string, User>();
      
      for (const uid of userIds) {
        if (uid !== userId) {
          try {
            const response = await api.get(`/api/users/${uid}`);
            userMap.set(uid, response.data.user);
          } catch (error) {
            console.error(`Failed to fetch user ${uid}:`, error);
          }
        }
      }
      setUsers(userMap);
    };

    if (userId) fetchConnections();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
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

  if (Object.keys(connections).length === 0) {
    return <NoConnectionsPage />;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UsersRound className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Your Network</CardTitle>
              <CardDescription>
                You have {Object.keys(connections).length} connections in your network
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70vh] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(connections).map(([connectionId, connection]) => {
                const connectedUser = users.get(connection.targetUid);
                
                if (!connectedUser) return null;

                return (
                  <Card 
                    key={connectionId} 
                    className="group hover:shadow-lg transition-all duration-300 border border-muted hover:border-primary/20"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-start justify-between">
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
                                {connectedUser.currentJobTitle || 'No title'}
                              </p>
                              <Badge 
                                variant={connection.status === 'active' ? 'default' : 'secondary'}
                                className="mt-2"
                              >
                                {connection.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => router.push(`/messages/${connection.targetUid}`)}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={() => router.push(`/profile/${connection.targetUid}`)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Profile
                          </Button>
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
  );
};

export default UserConnectionComponents;