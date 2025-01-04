"use client";

import React, { useMemo } from "react";
import { Avatar, Badge } from "@nextui-org/react";
import { ChatEntity } from "@/store/chatEntitiesStore";

interface SortedChatListProps {
  entities: ChatEntity[];
  selectedEntity: ChatEntity | null;
  unreadCounts: Record<string, number>;
  handleEntityClick: (entity: ChatEntity) => void;
}

const SortedChatList: React.FC<SortedChatListProps> = ({
  entities,
  selectedEntity,
  unreadCounts,
  handleEntityClick,
}) => {
  const getLatestMessageTimestamp = (entity: ChatEntity): number => {
    const directMessages = entity.directMessages || [];
    const groupMessages = entity.groupMessages || [];
    
    const latestDirectMessage = directMessages.length > 0
      ? new Date(directMessages[directMessages.length - 1].createdAt).getTime()
      : 0;
    
    const latestGroupMessage = groupMessages.length > 0
      ? new Date(groupMessages[groupMessages.length - 1].createdAt).getTime()
      : 0;
    
    return Math.max(latestDirectMessage, latestGroupMessage);
  };

  // Memoize the sorted entities array
  const sortedEntities = useMemo(() => {
    return [...entities].sort((a, b) => {
      const timestampA = getLatestMessageTimestamp(a);
      const timestampB = getLatestMessageTimestamp(b);
      return timestampB - timestampA;
    });
  }, [entities]); // Re-sort when entities change

  return (
    <ul className="space-y-4">
      {sortedEntities.map((entity) => (
        <li
          key={entity.id}
          className={`flex items-center gap-4 p-2 cursor-pointer rounded-lg relative ${
            selectedEntity?.id === entity.id ? "bg-blue-500 text-white" : "hover:bg-blue-100"
          }`}
          onClick={() => handleEntityClick(entity)}
        >
          <Avatar src={entity.avatar} alt={entity.name} />
          <div>
            <p className="font-semibold text-black">{entity.name}</p>
            {/* <p className="text-sm text-black">{entity.type === "user" ? "User" : "Group"}</p> */}
            {/* Display latest message preview */}
            {(entity.directMessages.length > 0 || entity.groupMessages.length > 0) && (
            <p className="text-xs text-gray-500 truncate max-w-[150px]">
                {(() => {
                const content = entity.type === "user"
                    ? entity.directMessages[entity.directMessages.length - 1]?.content
                    : entity.groupMessages[entity.groupMessages.length - 1]?.content;
                
                if (!content) return "";
                
                const words = content.split(" ");
                if (words.length <= 5) return content;
                return `${words.slice(0, 5).join(" ")}...`;
                })()}
            </p>
            )}
          </div>
          {unreadCounts[entity.id] > 0 && entity.id !== selectedEntity?.id && (
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
  );
};

export default SortedChatList;