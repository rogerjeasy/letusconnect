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

const ChatPageComponent = () => {
  const currentUser = useUserStore((state) => state.user);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [totalUnreadCount, setTotalUnreadCount] = useState<number>(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/users");
      let fetchedUsers = response.data.users;

      if (currentUser) {
        fetchedUsers = fetchedUsers.filter((user: User) => user.uid !== currentUser.uid);
      }

      setUsers(fetchedUsers);
      fetchedUsers.forEach((user: User) => fetchUnreadCount(undefined, setUnreadCounts, user.uid));
      fetchUnreadCount(setTotalUnreadCount);
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Error fetching users:", errorMessage);
    } finally {
      setLoading(false);
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

    notificationChannel?.bind("message-read", ({ senderId }: { senderId: string }) => {
      fetchUnreadCount(undefined, setUnreadCounts, senderId);
      fetchUnreadCount(setTotalUnreadCount);
    });

    return () => {
      notificationChannel?.unbind_all();
      pusher?.unsubscribe(`user-notifications-${currentUser.uid}`);
    };
  }, [currentUser, totalUnreadCount]);


  const handleUserClick = async (user: User) => {
    setSelectedUser(user);

    setUnreadCounts((prevCounts) => ({
      ...prevCounts,
      [user.uid]: 0,
    }));

    await handleMessagesClick(user.uid, setTotalUnreadCount);
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
              ) : users.length === 0 ? (
                <p className="text-black font-semibold">No users available.</p>
              ) : (
                <ul className="space-y-4">
                  {users.map((user) => (
                    <li
                      key={user.uid}
                      className={`flex items-center gap-4 p-2 cursor-pointer rounded-lg ${
                        selectedUser?.uid === user.uid ? "bg-blue-500 text-white" : "hover:bg-blue-100"
                      }`}
                      onClick={() => handleUserClick(user)}
                    >
                      <Avatar src={user.profilePicture} alt={user.username} />
                      <div>
                        <p className="font-semibold text-black">{`${user.firstName} ${user.lastName}`}</p>
                        <p className="text-sm text-black">{user.username}</p>
                      </div>
                      {unreadCounts[user.uid] > 0 && (
                        // <Badge color="danger" className="ml-auto" size="sm">
                        //   {unreadCounts[user.uid]}
                        // </Badge>
                        <Badge
                        content={unreadCounts[user.uid]}
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
            {selectedUser ? (
              <ChatInterface
              currentUserId={currentUser?.uid || ""}
              receiverId={selectedUser.uid}
              receiverName={
                selectedUser.firstName || selectedUser.lastName
                  ? `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim()
                  : selectedUser.username
              }
              receiverAvatar={selectedUser.profilePicture}
            />
            
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-black font-semibold">Select a user to start chatting</p>
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

export default ChatPageComponent;