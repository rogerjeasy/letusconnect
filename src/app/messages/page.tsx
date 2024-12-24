"use client";

import React, { useEffect, useState } from "react";
import { api, handleError } from "@/helpers/api";
import ChatInterface from "@/components/messages/ChatInterface";
import { User, useUserStore } from "@/store/userStore";
import { Avatar, Spinner, Card, Badge } from "@nextui-org/react";
import AccessDenied from "@/components/accessdenied/AccessDenied";
import fetchUnreadCount from "@/components/messages/fetchUnreadCount";
import handleMessagesClick from "@/components/messages/handleMessagesClick";
import { getPusherInstance } from "@/helpers/pusher";


interface ChatEntity {
  id: string;
  name: string;
  avatar: string;
  type: "user" | "group";
}

const ChatPage = () => {
  const currentUser = useUserStore((state) => state.user);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [totalUnreadCount, setTotalUnreadCount] = useState<number>(0);
  const [entities, setEntities] = useState<ChatEntity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<ChatEntity | null>(null);

  useEffect(() => {
    fetchChatEntities();
  }, []);

  const fetchChatEntities = async () => {
    setLoading(true);
    try {
      const [usersResponse, groupEntities, receiverNames] = await Promise.all([
        api.get("/api/users"),
        fetchGroupChatMessages(),
        fetchUserMessages(),
      ]);
  
      const fetchedUsers: User[] = usersResponse.data.users;
  
      const userEntities: ChatEntity[] = fetchedUsers
        .filter((user) => user.uid !== currentUser?.uid)
        .filter((user) => receiverNames.includes(user.username))
        .map((user) => ({
          id: user.uid,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username,
          avatar: user.profilePicture,
          type: "user",
        }));
  
      const combinedEntities = [...userEntities, ...groupEntities];
  
      console.log("Combined entities:", combinedEntities);
  
      setEntities(combinedEntities);
  
      combinedEntities.forEach((entity) =>
        fetchUnreadCount(undefined, setUnreadCounts, entity.id)
      );
  
      fetchUnreadCount(setTotalUnreadCount);
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Error fetching chat entities:", errorMessage);
    } finally {
      setLoading(false);
    }
  };  

  const fetchUserMessages = async (): Promise<string[]> => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get("/api/messages/direct", 
        { headers: { Authorization: `Bearer ${token}` } }
      
      );
      const messages = response.data.messages;

      const receiverNames: Set<string> = new Set();
      messages.forEach((message: { directMessages: { receiverName: string }[] }) => {
        message.directMessages.forEach((dm) => {
          receiverNames.add(dm.receiverName);
        });
      });

      return Array.from(receiverNames);
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Error fetching messages:", errorMessage);
      return [];
    }
  };

  const fetchGroupChatMessages = async (): Promise<ChatEntity[]> => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get("/api/group-chats/my/group-chats", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const groupMessages = response.data.data;
      const groupEntities: ChatEntity[] = groupMessages.map(
        (group: { id: string; name: string }) => ({
          id: group.id, 
          name: group.name, 
          avatar: "", 
          type: "group", 
        })
      );
  
      return groupEntities;
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Error fetching group messages:", errorMessage);
      return [];
    }
  };    

  useEffect(() => {
    if (!currentUser) return;

    const pusher = getPusherInstance();
    const notificationChannel = pusher?.subscribe(`user-notifications-${currentUser.uid}`);

    notificationChannel?.bind("new-unread-message", ({ senderId }: { senderId: string }) => {
      fetchUnreadCount(undefined, setUnreadCounts, senderId);
      fetchUnreadCount(setTotalUnreadCount);
    });

    notificationChannel?.bind("update-unread-count", ({ senderId }: { senderId: string}) => {
      fetchUnreadCount(undefined, setUnreadCounts, senderId);
      fetchUnreadCount(setTotalUnreadCount);
    });

    notificationChannel?.bind("message-read", ({ senderId }: { senderId: string }) => {
      fetchUnreadCount(undefined, setUnreadCounts, senderId);
      fetchUnreadCount(setTotalUnreadCount);
    });

    return () => {
      notificationChannel?.unbind_all();
      pusher?.unsubscribe(`user-notifications-${currentUser.uid}`);
    };
  }, [currentUser, totalUnreadCount]);


  const handleEntityClick = async (entity: ChatEntity) => {
    setSelectedEntity(entity);

    setUnreadCounts((prevCounts) => ({
      ...prevCounts,
      [entity.id]: 0,
    }));

    await handleMessagesClick(entity.id, setTotalUnreadCount);
  };

  if (!currentUser) {
    return <AccessDenied condition={true} message="Access Denied: You need to Login to your account or create one." />;
  }

  return (
    <div className="relative flex justify-center items-center p-6 min-h-screen overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="flex w-[300%] h-full animate-slide">
          <div
            className="w-1/3 h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1522071901873-411886a10004?auto=format&fit=crop&w=1920&q=80')`,
            }}
          ></div>
          <div
            className="w-1/3 h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=80')`,
            }}
          ></div>
          {/* <div
            className="w-1/3 h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1573164574511-73c773193279?auto=format&fit=crop&w=1920&q=80')`,
            }}
          ></div> */}
          <div
            className="w-1/3 h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80')`,
            }}
          ></div>
        </div>
      </div>

      <Card className="w-full max-w-5xl h-[600px] p-4 shadow-lg rounded-lg flex flex-col relative z-10 bg-white">
        <div className="flex h-full">
          {/* User List on the Left Side */}
          <Card className="w-1/3 p-4 shadow-md flex-shrink-0 overflow-hidden">
            <h2 className="text-lg font-bold mb-4 text-black">Users</h2>
            <div className="h-full overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner size="lg" />
                </div>
              ) : entities.length === 0 ? (
                <p className="text-black font-semibold">No users available.</p>
              ) : (
                <ul className="space-y-4">
                  {entities.map((entity) => (
                    <li
                      key={entity.id}
                      className={`flex items-center gap-4 p-2 cursor-pointer rounded-lg ${
                        selectedEntity?.id === entity.id ? "bg-blue-500 text-white" : "hover:bg-blue-100"
                      }`}
                      onClick={() => handleEntityClick(entity)}
                    >
                      <Avatar src={entity.avatar} alt={entity.name} />
                      <div>
                        <p className="font-semibold text-black">{entity.name}</p>
                        <p className="text-sm text-black">{entity.type === "user" ? "User" : "Group"}</p>
                      </div>
                      {unreadCounts[entity.id] > 0 && (
                        // <Badge color="danger" className="ml-auto" size="sm">
                        //   {unreadCounts[user.uid]}
                        // </Badge>
                        <Badge
                        content={unreadCounts[entity.id]}
                        color="danger"
                        size="md"
                        shape="circle"
                        className="absolute -top-2 -right-2"
                      >
                        {""}
                      </Badge>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          {/* Chat Interface on the Right Side */}
          <div className="flex-1 p-6">
            {selectedEntity ? (
              <ChatInterface
                currentUserId={currentUser?.uid || ""}
                receiverId={selectedEntity.id}
                receiverName={selectedEntity.name}
                receiverAvatar={selectedEntity.avatar}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-black font-semibold">Select a chat to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Custom CSS for Animation */}
      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-66.66%);
          }
        }

        .animate-slide {
          animation: slide 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;