"use client";

import { create } from "zustand";
import { DirectMessage } from "./message";
import { BaseMessage } from "./groupChat";
import { Participants } from "./project";


export interface ChatEntity {
  id: string;
  name: string;
  avatar: string;
  type: "user" | "group";
  directMessages: DirectMessage[];
  groupMessages: BaseMessage[];
  participants?: Participants[];
}

interface ChatEntitiesState {
  entities: ChatEntity[];
  selectedEntity: ChatEntity | null;
  setEntities: (entities: ChatEntity[]) => void;
  addEntity: (entity: ChatEntity) => void;
  updateEntity: (entityId: string, updatedEntity: Partial<ChatEntity>) => void;
  removeEntity: (entityId: string) => void;
  setSelectedEntity: (entity: ChatEntity | null) => void;
}

export const useChatEntitiesStore = create<ChatEntitiesState>((set) => ({
  entities: [],
  selectedEntity: null,

  setEntities: (entities) =>
    set(() => ({
      entities,
    })),

  addEntity: (entity) =>
    set((state) => ({
      entities: [...state.entities, entity],
    })),

  updateEntity: (entityId, updatedEntity) =>
    set((state) => ({
      entities: state.entities.map((entity) =>
        entity.id === entityId ? { ...entity, ...updatedEntity } : entity
      ),
    })),

  removeEntity: (entityId) =>
    set((state) => ({
      entities: state.entities.filter((entity) => entity.id !== entityId),
    })),

  setSelectedEntity: (entity) =>
    set(() => ({
      selectedEntity: entity,
    })),
}));
