"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/store/userStore";
import { useParams, useRouter } from "next/navigation";
import { api, handleError } from "@/helpers/api";
import NoConnectionsPage from "./NoConectionsComponent";

interface Connection {
 id: string;
 users: string[];
 status: 'pending' | 'accepted' | 'rejected';
 timestamp: string;
 lastInteraction: string;
}

const UserConnections = () => {
 const { userId } = useParams();
 const [connections, setConnections] = useState<Connection[]>([]);
 const [users, setUsers] = useState<Map<string, User>>(new Map());
 const router = useRouter();

 useEffect(() => {
   const fetchConnections = async () => {
     try {
       const response = await api.get(`/api/connections/${userId}`);
       setConnections(response.data.connections);
       await fetchConnectionUsers(response.data.connections);
     } catch (error) {
       handleError(error);
     }
   };

   const fetchConnectionUsers = async (connections: Connection[]) => {
     const userIds = new Set(connections.flatMap(c => c.users));
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

 if (connections.length === 0) {
    return <NoConnectionsPage />;
  }

 return (
   <div className="container mx-auto p-4">
     <Card>
       <CardHeader>
         <CardTitle>Connections ({connections.length})</CardTitle>
       </CardHeader>
       <CardContent>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {connections.map((connection) => {
             const connectedUserId = connection.users.find(id => id !== userId);
             const connectedUser = users.get(connectedUserId || '');
             
             if (!connectedUser) return null;

             return (
               <Card key={connection.id} className="hover:shadow-lg transition-shadow">
                 <CardContent className="p-4">
                   <div className="flex items-center gap-4">
                     <Avatar className="h-12 w-12">
                       <AvatarImage src={connectedUser.profilePicture} />
                       <AvatarFallback>
                         {connectedUser.firstName?.[0]}{connectedUser.lastName?.[0]}
                       </AvatarFallback>
                     </Avatar>
                     <div>
                       <h3 className="font-semibold">
                         {connectedUser.firstName && connectedUser.lastName 
                           ? `${connectedUser.firstName} ${connectedUser.lastName}`
                           : connectedUser.username}
                       </h3>
                       <p className="text-sm text-muted-foreground">
                         {connectedUser.currentJobTitle || 'No title'}
                       </p>
                       <Badge variant={connection.status === 'accepted' ? 'outline' : 'secondary'}>
                         {connection.status}
                       </Badge>
                     </div>
                   </div>
                   <button 
                     onClick={() => router.push(`/profile/${connectedUser.uid}`)}
                     className="mt-2 text-sm text-blue-500 hover:underline"
                   >
                     View Profile
                   </button>
                 </CardContent>
               </Card>
             );
           })}
         </div>
       </CardContent>
     </Card>
   </div>
 );
};

export default UserConnections;