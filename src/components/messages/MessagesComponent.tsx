"use client";

import React, { useCallback, useEffect, useState } from "react";
import { handleError } from "@/helpers/api";
import { User, useUserStore } from "@/store/userStore";
import { Avatar, Spinner, Card, Badge, Button, CardHeader, Tooltip, CardBody } from "@nextui-org/react";
import handleMessagesClick from "@/components/messages/handleMessagesClick";
import { getPusherInstance } from "@/helpers/pusher";
import { Participants } from "@/store/project";
import GroupMessagesCard from "@/components/messages/GroupMessagesCard";
import UsersToChatWith from "@/components/messages/UsersToChatWith";
import { FaCog, FaTimes } from "react-icons/fa";
import ChatManagement from "@/components/messages/ChatManagement";
import { useParticipantsStore } from "@/store/participantsStore";
import { useChatEntitiesStore, ChatEntity } from "@/store/chatEntitiesStore";
import { handleMarkMessagesAsRead } from "@/components/messages/HandleGroupActions";
import { toast } from "react-toastify";
import { getAllUsers } from "@/services/users.services";
import { getDirectMessages, organizeDirectMessages } from "@/services/message.service";
import { getGroupUnreadCount, getMyGroupChats, markGroupMessagesAsRead, processGroupChats } from "@/services/groupchat.service";
import { getUnreadMessageCount } from "@/services/message.service";
import SortedChatList from "@/components/messages/SortedChatList";
import { useRouter } from "next/navigation";

type PinnedMessagesMap = Record<string, string[]>;

const MessagesComponent = ({ current = "" }) => {
  const router = useRouter();
  const { user: currentUser} = useUserStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [totalUnreadCount, setTotalUnreadCount] = useState<number>(0);
  const {
    entities,
    selectedEntity,
    setEntities,
    addEntity,
    setSelectedEntity,
  } = useChatEntitiesStore();
  const [showModal, setShowModal] = useState(false);
  const [pinnedMessagesMap, setPinnedMessagesMap] = useState<PinnedMessagesMap>({});
  const { participants, addParticipant } = useParticipantsStore();

  const updateUnreadCount = useCallback(async (entityId: string) => {
    try {
      await getGroupUnreadCount(entityId, undefined, setUnreadCounts);
    } catch (error) {
      const errorMessage = handleError(error);
      toast.error(`Error fetching unread count: ${errorMessage}`);
    }
  }, []);

  useEffect(() => {
    fetchChatEntities().then(() => {
      if (current) {
        const entity = entities.find(e => e.id === current);
        if (entity) {
          setSelectedEntity(entity);
        } else {
          router.replace('/messages');
        }
      }
    });
  }, [current, router]);

  const fetchChatEntities = async () => {
    setLoading(true);
    try {
      const [userEntities, groupEntities] = await Promise.all([
        fetchUserMessages(),
        fetchGroupChatMessages(),
      ]);
  
      const combinedEntities = [...userEntities, ...groupEntities];
    
      setEntities(combinedEntities);
  
      userEntities.forEach((entity) =>
        getUnreadMessageCount(undefined, setUnreadCounts, entity.id)
      );
      groupEntities.forEach((entity) =>
        fetchUnreadCountForEntity(entity.id)
      );
  
      getUnreadMessageCount(setTotalUnreadCount);
      // fetchUnreadCountForTotal();
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Error fetching chat entities:", errorMessage);
    } finally {
      setLoading(false);
    }
  };    

  const fetchUserMessages = async (): Promise<ChatEntity[]> => {
    try {
      const messages = await getDirectMessages();
      const directMessagesMap = organizeDirectMessages(messages);
  
      const fetchedUsers = await getAllUsers();

      const allUsers: User[] = fetchedUsers.filter((user) => user.uid !== currentUser?.uid);
      setUsers(allUsers);
  
      const userEntities: ChatEntity[] = fetchedUsers
        .filter((user) => user.uid !== currentUser?.uid)
        .filter((user) => {
          const userKey = [currentUser?.uid, user.uid].sort().join("-");
          return directMessagesMap[userKey];
        })
        .map((user) => {
          const userKey = [currentUser?.uid, user.uid].sort().join("-");
          return {
            id: user.uid,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username,
            avatar: user.profilePicture,
            type: "user",
            directMessages: directMessagesMap[userKey] || [],
            groupMessages: [],
            participants: [
              {
                userId: user.uid,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                role: "",
              },
            ],
          };
        });

  
      // Add participants to the store
      userEntities.forEach((entity) => {
        addParticipant(entity.id, entity.participants || []);
      });
  
      return userEntities;
    } catch (error) {
      const errorMessage = handleError(error);
      toast.error("Error fetching user messages:", errorMessage);
      return [];
    }
  };
  

  const fetchGroupChatMessages = async (): Promise<ChatEntity[]> => {
    try {
      const groupChats = await getMyGroupChats();
      return processGroupChats(groupChats, setPinnedMessagesMap, addParticipant);
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Error fetching group messages:", errorMessage);
      return [];
    }
  };

  const fetchUnreadCountForEntity = async (entityId: string) => {
    try {
      await getGroupUnreadCount(entityId, undefined, setUnreadCounts);
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Error fetching unread count for entity:", entityId, errorMessage);
      toast.error("Error fetching unread count for entity: " + errorMessage || "Unknown error");
    }
  };

  const markMessagesAsRead = async (groupChatId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to perform this action.");
      return;
    }
  
    try {
      await handleMarkMessagesAsRead(groupChatId, token);
      // Optionally update local state or UI
      setUnreadCounts((prevCounts) => ({
        ...prevCounts,
        [groupChatId]: 0,
      }));
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };  
       

  useEffect(() => {
    if (!currentUser) return;

    const pusher = getPusherInstance();
    const notificationChannel = pusher?.subscribe(`user-notifications-${currentUser.uid}`);
    const unreadCountChannel = pusher?.subscribe(`group-unread-counts-${currentUser.uid}`);

    unreadCountChannel?.bind("update-unread-count", (data: { groupChatId: string; unreadCount: number }) => {
      setUnreadCounts((prevCounts) => ({
        ...prevCounts,
        [data.groupChatId]: data.unreadCount,
      }));
    });

    notificationChannel?.bind("new-unread-message", ({ senderId }: { senderId: string }) => {
      getUnreadMessageCount(undefined, setUnreadCounts, senderId);
      getUnreadMessageCount(setTotalUnreadCount);
    });

    notificationChannel?.bind("update-unread-count", ({ senderId }: { senderId: string}) => {
      getUnreadMessageCount(undefined, setUnreadCounts, senderId);
      getUnreadMessageCount(setTotalUnreadCount);
    });

    notificationChannel?.bind("message-read", ({ senderId }: { senderId: string }) => {
      getUnreadMessageCount(undefined, setUnreadCounts, senderId);
      getUnreadMessageCount(setTotalUnreadCount);
    });

    return () => {
      notificationChannel?.unbind_all();
      unreadCountChannel?.unbind_all();
      pusher?.unsubscribe(`user-notifications-${currentUser.uid}`);
    };
  }, [currentUser, totalUnreadCount]);


  const handleEntityClick = async (entity: ChatEntity) => {
    if (!entity) {
      setSelectedEntity(null);
      router.replace('/messages');
      return;
    }
    
    setSelectedEntity(entity);
    router.push(`/messages?entityId=${entity.id}`);

    if (entity.type === "group") {
      await markGroupMessagesAsRead(entity.id);
    } else if (entity.type === "user") {
      await handleMessagesClick(entity.id, setTotalUnreadCount);
    }

    setUnreadCounts((prevCounts) => {
      const updatedCounts = { ...prevCounts };
      if (entity.type === "group" && entity.id === selectedEntity?.id) {
        delete updatedCounts[entity.id];
      }
      return updatedCounts;
    });
  };


  useEffect(() => {
    if (selectedEntity?.type === "group" && selectedEntity.id) {
      markGroupMessagesAsRead(selectedEntity.id);
    }
  }, [selectedEntity]);  

  const updatePinnedMessages = (groupChatId: string, messageId: string, isUnpin = false) => {
    setPinnedMessagesMap((prev) => {
      const updated = { ...prev };
      if (isUnpin) {
        updated[groupChatId] = updated[groupChatId].filter((id) => id !== messageId);
      } else {
        updated[groupChatId] = [...(updated[groupChatId] || []), messageId];
      }
      return updated;
    });
  };   

  // if (!currentUser) {
  //   return <AccessDenied condition={true} message="Access Denied: You need to Login to your account or create one." />;
  // }
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

      <Card className="w-full max-w-5xl h-[650px] p-4 shadow-lg rounded-lg flex flex-col relative z-10 bg-white">
        <CardHeader className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-cyan-50 to-blue-50 p-6 rounded-t-lg relative">
          <div className="absolute top-4 left-4">
            <div className="flex items-center bg-green-500 hover:bg-green-600 rounded-full transition-colors">
              <ChatManagement />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-center w-full text-blue-900">
            {selectedEntity?.name && selectedEntity?.type === "group" ? selectedEntity.name : "Messages"}
          </h2>

          <div className="absolute top-4 right-4 flex gap-2">
            <Tooltip 
              content="Group Settings" 
              placement="bottom" 
              delay={200} 
              closeDelay={0}
              className="text-sm"
            >
              <Button
                isIconOnly
                variant="light"
                color="primary"
                className="bg-green/50 hover:bg-white/80 transition-colors"
              >
                <FaCog className="text-blue-600" />
              </Button>
            </Tooltip>
          </div>
        </CardHeader>
        
        <CardBody className="flex flex-row gap-4 h-full">

          {/* User List on the Left Side */}
          <div className="w-1/4 h-full">
            <Card className="h-full border shadow-md">
              {/* <h2 className="text-lg font-bold mb-4 text-black">Users</h2> */}
              <div className="h-full overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Spinner size="lg" />
                  </div>
                ) : entities.length === 0 ? (
                  <>
                    <p className="text-black font-semibold">No users available.</p>
                    <Button
                      color="primary"
                      onClick={() => setShowModal(true)}
                      className="mt-4"
                    >
                      Start Conversation
                    </Button>
                    {showModal && (
                      <UsersToChatWith
                        users={users}
                        onSelectUser={(user) => {
                          const newParticipant: Participants = {
                            userId: user.uid,
                            username: user.username,
                            email: user.email,
                            profilePicture: user.profilePicture,
                            role: "User",
                          };
                          addParticipant(user.uid, newParticipant);
                          const newChatEntity: ChatEntity = {
                            id: user.uid,
                            name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username,
                            avatar: user.profilePicture,
                            type: "user",
                            directMessages: [],
                            groupMessages: [],
                            participants: [newParticipant],
                          };
                          addParticipant(user.uid, [newParticipant]);
                          addEntity(newChatEntity);
                        }}
                        onClose={() => setShowModal(false)}
                      />
                    )}
                  </>
                ) : (
                  <SortedChatList 
                    entities={entities}
                    selectedEntity={selectedEntity}
                    unreadCounts={unreadCounts}
                    handleEntityClick={handleEntityClick}
                  />
                )}
              </div>
            </Card>
          </div>

          {/* Chat Interface on the Right Side */}
          <div className="w-3/4 h-full">
            {selectedEntity ? (
              <GroupMessagesCard
                key={selectedEntity?.id}
                groupChatId={selectedEntity.type === "group" ? selectedEntity.id : undefined}
                token={localStorage.getItem("token") || ""}
                initialMessages={
                  selectedEntity.type === "group"
                    ? selectedEntity.groupMessages
                    : selectedEntity.directMessages
                }
                participants={
                  selectedEntity.id ? participants[selectedEntity.id] || [] : []
                }
                pinnedMessages={pinnedMessagesMap[selectedEntity.id] || []}
                selectedEntity={selectedEntity}
                updatePinnedMessages={updatePinnedMessages}
              />                       
            ) : (
              <p className="text-center">Select a chat to start messaging.</p>
            )}
          </div>

        </CardBody>
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

export default MessagesComponent;